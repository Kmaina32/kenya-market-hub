import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayPalOrderRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  returnUrl?: string;
  cancelUrl?: string;
}

interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYPAL-PAYMENT] ${step}${detailsStr}`);
};

async function getPayPalAccessToken(): Promise<string> {
  logStep("Getting PayPal access token");
  
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.status}`);
  }

  const data: PayPalAccessToken = await response.json();
  logStep("Access token obtained", { tokenType: data.token_type });
  
  return data.access_token;
}

async function createPayPalOrder(accessToken: string, orderData: PayPalOrderRequest): Promise<PayPalOrder> {
  logStep("Creating PayPal order", { amount: orderData.amount, currency: orderData.currency });
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderData.orderId,
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount.toFixed(2),
        },
        description: orderData.description,
      }],
      application_context: {
        return_url: orderData.returnUrl || `${Deno.env.get('SUPABASE_URL')}/payment-success`,
        cancel_url: orderData.cancelUrl || `${Deno.env.get('SUPABASE_URL')}/payment-cancel`,
        brand_name: 'Sokko Sasa',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logStep("PayPal order creation failed", { status: response.status, error: errorText });
    throw new Error(`Failed to create PayPal order: ${response.status} - ${errorText}`);
  }

  const order: PayPalOrder = await response.json();
  logStep("PayPal order created", { orderId: order.id, status: order.status });
  
  return order;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("PayPal payment function started");

    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const requestBody: PayPalOrderRequest = await req.json();
    logStep("Request received", { orderId: requestBody.orderId, amount: requestBody.amount });

    // Validate required fields
    if (!requestBody.amount || !requestBody.currency || !requestBody.orderId) {
      throw new Error('Missing required fields: amount, currency, or orderId');
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(accessToken, requestBody);

    // Find the approval URL
    const approvalUrl = paypalOrder.links.find(link => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response');
    }

    logStep("Payment process completed", { paypalOrderId: paypalOrder.id, approvalUrl });

    return new Response(JSON.stringify({
      success: true,
      paypalOrderId: paypalOrder.id,
      approvalUrl: approvalUrl,
      status: paypalOrder.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in paypal-payment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});