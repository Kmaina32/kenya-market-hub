
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

    // Validate inputs
    if (!phoneNumber || !amount || !orderId) {
      throw new Error('Missing required parameters: phoneNumber, amount, or orderId')
    }

    if (amount < 1) {
      throw new Error('Amount must be at least 1 KSh')
    }

    // Get M-Pesa access token
    const tokenResponse = await getMpesaToken()
    if (!tokenResponse.success) {
      console.error('Failed to get M-Pesa token:', tokenResponse.error)
      throw new Error('Failed to authenticate with M-Pesa service')
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
            merchant_request_id: stkResponse.MerchantRequestID,
            initiated_at: new Date().toISOString()
          }
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Don't fail the request if DB insert fails, M-Pesa request was successful
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
      console.error('STK Push failed:', stkResponse.errorMessage)
      throw new Error(stkResponse.errorMessage || 'STK Push failed')
    }

  } catch (error) {
    console.error('M-Pesa payment error:', error)
    
    let errorMessage = 'Payment processing failed'
    let statusCode = 400
    
    if (error.message) {
      errorMessage = error.message
    }
    
    // Check for specific error types
    if (error.message?.includes('authenticate')) {
      statusCode = 503
      errorMessage = 'Payment service temporarily unavailable'
    } else if (error.message?.includes('phone') || error.message?.includes('Phone')) {
      errorMessage = 'Invalid phone number format'
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode
      }
    )
  }
})

async function getMpesaToken() {
  try {
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    
    if (!consumerKey || !consumerSecret) {
      console.error('M-Pesa credentials not found in environment')
      throw new Error('M-Pesa credentials not configured')
    }

    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log('Token response status:', response.status)
    
    if (response.ok && data.access_token) {
      return { success: true, access_token: data.access_token }
    } else {
      console.error('Token generation failed:', data)
      return { success: false, error: data.error_description || 'Failed to get access token' }
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
    
    // Ensure phone number is in correct format
    let formattedPhone = phoneNumber.toString().replace(/^\+/, '')
    if (!formattedPhone.startsWith('254')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1)
      } else {
        formattedPhone = '254' + formattedPhone
      }
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

    console.log('STK Push payload:', { ...stkPushPayload, Password: '[HIDDEN]' })

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

    if (response.ok && data.ResponseCode === '0') {
      return {
        success: true,
        CheckoutRequestID: data.CheckoutRequestID,
        MerchantRequestID: data.MerchantRequestID
      }
    } else {
      const errorMessage = data.ResponseDescription || data.errorMessage || `HTTP ${response.status}: STK Push failed`
      return {
        success: false,
        errorMessage: errorMessage
      }
    }
  } catch (error) {
    console.error('STK Push error:', error)
    return { success: false, errorMessage: `Network error: ${error.message}` }
  }
}
