
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

    const callbackData = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2))

    const { Body } = callbackData
    const { stkCallback } = Body

    if (!stkCallback) {
      console.error('Invalid callback format')
      return new Response('OK', { status: 200 })
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode
    const resultDesc = stkCallback.ResultDesc

    // Find the transaction in our database
    const { data: transaction, error: findError } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_id', checkoutRequestId)
      .single()

    if (findError || !transaction) {
      console.error('Transaction not found:', checkoutRequestId)
      return new Response('OK', { status: 200 })
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || []
      const mpesaReceiptNumber = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value
      const transactionDate = callbackMetadata.find((item: any) => item.Name === 'TransactionDate')?.Value
      const phoneNumber = callbackMetadata.find((item: any) => item.Name === 'PhoneNumber')?.Value

      // Update transaction status
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          payment_data: {
            ...transaction.payment_data,
            mpesa_receipt_number: mpesaReceiptNumber,
            transaction_date: transactionDate,
            phone_number: phoneNumber,
            callback_data: callbackData
          }
        })
        .eq('id', transaction.id)

      if (updateError) {
        console.error('Failed to update transaction:', updateError)
      } else {
        // Update order status
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'processing'
          })
          .eq('id', transaction.order_id)

        console.log('Payment completed successfully:', mpesaReceiptNumber)
      }
    } else {
      // Payment failed
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'failed',
          payment_data: {
            ...transaction.payment_data,
            error_message: resultDesc,
            callback_data: callbackData
          }
        })
        .eq('id', transaction.id)

      if (updateError) {
        console.error('Failed to update failed transaction:', updateError)
      }

      console.log('Payment failed:', resultDesc)
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Callback processing error:', error)
    return new Response('OK', { status: 200 })
  }
})
