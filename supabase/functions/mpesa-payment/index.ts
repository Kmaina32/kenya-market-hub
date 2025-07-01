
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { phoneNumber, amount, orderId } = await req.json()

    console.log('Processing M-Pesa payment:', { phoneNumber, amount, orderId })

    // Get M-Pesa access token
    const tokenResponse = await getMpesaToken()
    if (!tokenResponse.success) {
      throw new Error('Failed to get M-Pesa access token')
    }

    // Initiate STK Push
    const stkResponse = await initiateStkPush(tokenResponse.access_token, phoneNumber, amount, orderId)
    
    if (stkResponse.success) {
      // Store transaction details in database
      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          order_id: orderId,
          payment_method: 'mpesa',
          amount: amount,
          status: 'pending',
          transaction_id: stkResponse.CheckoutRequestID,
          payment_data: {
            phone_number: phoneNumber,
            checkout_request_id: stkResponse.CheckoutRequestID,
            merchant_request_id: stkResponse.MerchantRequestID
          }
        })

      if (dbError) {
        console.error('Database error:', dbError)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'STK Push sent successfully',
          checkoutRequestId: stkResponse.CheckoutRequestID,
          merchantRequestId: stkResponse.MerchantRequestID
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error(stkResponse.errorMessage || 'STK Push failed')
    }

  } catch (error) {
    console.error('M-Pesa payment error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment processing failed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function getMpesaToken() {
  try {
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    
    if (!consumerKey || !consumerSecret) {
      throw new Error('M-Pesa credentials not configured')
    }

    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    })

    const data = await response.json()
    
    if (data.access_token) {
      return { success: true, access_token: data.access_token }
    } else {
      return { success: false, error: 'Failed to get access token' }
    }
  } catch (error) {
    console.error('Token generation error:', error)
    return { success: false, error: error.message }
  }
}

async function initiateStkPush(accessToken: string, phoneNumber: string, amount: number, orderId: string) {
  try {
    // M-Pesa sandbox configuration
    const BusinessShortCode = "174379"
    const Passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    const Timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const Password = btoa(`${BusinessShortCode}${Passkey}${Timestamp}`)
    
    // Format phone number (ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/^\+/, '').replace(/^0/, '254')
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone
    }

    const stkPushPayload = {
      BusinessShortCode,
      Password,
      Timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: BusinessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
      AccountReference: `ORDER-${orderId}`,
      TransactionDesc: `Payment for Order ${orderId}`
    }

    console.log('STK Push payload:', stkPushPayload)

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPushPayload)
    })

    const data = await response.json()
    console.log('STK Push response:', data)

    if (data.ResponseCode === '0') {
      return {
        success: true,
        CheckoutRequestID: data.CheckoutRequestID,
        MerchantRequestID: data.MerchantRequestID
      }
    } else {
      return {
        success: false,
        errorMessage: data.ResponseDescription || data.errorMessage || 'STK Push failed'
      }
    }
  } catch (error) {
    console.error('STK Push error:', error)
    return { success: false, errorMessage: error.message }
  }
}
