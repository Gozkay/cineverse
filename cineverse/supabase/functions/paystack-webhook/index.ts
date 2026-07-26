import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!paystackSecret || !supabaseUrl || !supabaseServiceKey) {
    return new Response('Missing configuration', { status: 500 })
  }

  // Verify webhook signature
  const signature = req.headers.get('x-paystack-signature')
  const body = await req.text()
  const hash = await crypto.subtle.digest(
    'SHA-512',
    new TextEncoder().encode(body + paystackSecret)
  )
  const expectedSig = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')

  if (signature !== expectedSig) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const { reference, amount, status } = event.data

    // Verify with Paystack API
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    })
    const verification = await verifyRes.json()

    if (!verification.status || verification.data.status !== 'success') {
      return new Response('Verification failed', { status: 400 })
    }

    // Update order status
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('payment_ref', reference)

    if (error) {
      return new Response('Failed to update order', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
})
