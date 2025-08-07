export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaptureRequest {
  orderId: string; // PayPal token from return URL
}

interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const log = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYPAL-CAPTURE] ${step}${detailsStr}`);
};

async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  if (!clientId || !clientSecret) throw new Error('PayPal credentials not configured');
  const auth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data: PayPalAccessToken = await res.json();
  return data.access_token;
}

async function captureOrder(accessToken: string, orderId: string) {
  const res = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  const text = await res.text();
  if (!res.ok) {
    log('Capture failed', { status: res.status, body: text });
    throw new Error(`Capture failed: ${res.status} ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') throw new Error('Method not allowed');
    const { orderId } = (await req.json()) as CaptureRequest;
    if (!orderId) throw new Error('Missing orderId');

    log('Starting capture', { orderId });
    const token = await getAccessToken();
    const result = await captureOrder(token, orderId);

    log('Capture success');
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    log('ERROR', { message });
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    );
  }
});
