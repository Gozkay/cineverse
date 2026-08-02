import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const PAYSTACK_API = 'https://api.paystack.co'
const MIN_PAYOUT = 100

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function paystack(path, secret, method = 'GET', body) {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

async function handleWebhook(req, paystackSecret, supabase) {
  const signature = req.headers.get('x-paystack-signature')
  const body = await req.text()
  const hash = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(body + paystackSecret))
  const expectedSig = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')

  if (signature !== expectedSig) return json({ error: 'Invalid signature' }, 401)

  const event = JSON.parse(body)

  if (event.event === 'transfer.success' || event.event === 'transfer.failed' || event.event === 'transfer.reversed') {
    const transferCode = event.data?.transfer_code
    if (!transferCode) return json({ ok: true })

    const paid = event.event === 'transfer.success'

    const { data: payout } = await supabase
      .from('seller_payouts')
      .select('id')
      .eq('transfer_code', transferCode)
      .maybeSingle()

    if (payout) {
      const update = paid
        ? { status: 'paid', updated_at: new Date().toISOString() }
        : { status: 'failed', updated_at: new Date().toISOString() }

      await supabase.from('seller_payouts').update(update).eq('id', payout.id)

      if (paid) {
        await supabase
          .from('seller_earnings')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('payout_id', payout.id)
      } else {
        await supabase
          .from('seller_earnings')
          .update({ status: 'available', payout_id: null })
          .eq('payout_id', payout.id)
      }
    }
  }

  return json({ ok: true })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')

  if (!supabaseUrl || !supabaseServiceKey || !paystackSecret) {
    return json({ error: 'Missing configuration' }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const signature = req.headers.get('x-paystack-signature')
  if (signature) {
    return handleWebhook(req, paystackSecret, supabase)
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader) return json({ error: 'Unauthorized' }, 401)

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle()

  const isAdmin = profile?.role === 'admin'
  const isSeller = profile?.role === 'seller'

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { action } = body

  switch (action) {
    case 'request': {
      if (!isSeller) return json({ error: 'Seller only' }, 403)

      const amount = Number(body.amount)
      const { account_number, bank_code, bank_name } = body.bank_details || {}

      if (!Number.isFinite(amount) || amount < MIN_PAYOUT) {
        return json({ error: `Minimum payout is ₦${MIN_PAYOUT}` }, 400)
      }
      if (!account_number || !bank_code) {
        return json({ error: 'Bank details required' }, 400)
      }

      const { data: balanceRows, error: balanceError } = await supabase
        .from('seller_earnings')
        .select('net')
        .eq('seller_id', user.id)
        .eq('status', 'available')

      if (balanceError) return json({ error: 'Failed to load balance' }, 500)

      const available = (balanceRows || []).reduce((sum, r) => sum + Number(r.net), 0)
      if (amount > available + 0.01) {
        return json({ error: 'Amount exceeds available balance' }, 400)
      }

      const resolve = await paystack(
        `/bank/resolve?account_number=${encodeURIComponent(account_number)}&bank_code=${encodeURIComponent(bank_code)}`,
        paystackSecret
      )
      const accountName = resolve?.data?.account_name || ''

      const { data: payout, error: payoutError } = await supabase
        .from('seller_payouts')
        .insert({
          seller_id: user.id,
          amount,
          bank_details: { account_number, bank_code, bank_name, account_name: accountName },
        })
        .select()
        .single()

      if (payoutError) return json({ error: payoutError.message }, 500)

      const { data: earnings } = await supabase
        .from('seller_earnings')
        .select('id, net')
        .eq('seller_id', user.id)
        .eq('status', 'available')
        .order('created_at', { ascending: true })

      let remaining = amount
      const toReserve = []
      for (const e of earnings || []) {
        if (remaining <= 0) break
        toReserve.push(e.id)
        remaining -= Number(e.net)
      }

      if (toReserve.length) {
        await supabase
          .from('seller_earnings')
          .update({ status: 'pending_transfer', payout_id: payout.id })
          .in('id', toReserve)
      }

      return json({ success: true, payout, account_name: accountName })
    }

    case 'banks': {
      if (!isSeller && !isAdmin) return json({ error: 'Seller or Admin only' }, 403)
      const banks = await paystack('/bank?currency=NGN', paystackSecret)
      return json({ banks: banks?.data || [] })
    }

    case 'transfer': {
      if (!isAdmin) return json({ error: 'Admin only' }, 403)

      const { data: payout, error: loadError } = await supabase
        .from('seller_payouts')
        .select('*')
        .eq('id', body.payout_id)
        .maybeSingle()

      if (loadError || !payout) return json({ error: 'Payout not found' }, 404)
      if (payout.status !== 'pending') {
        if (payout.status === 'processing' && payout.transfer_code) {
          return json({ success: true, transfer: { transfer_code: payout.transfer_code }, idempotent: true })
        }
        return json({ error: 'Payout is not pending' }, 400)
      }

      const details = payout.bank_details || {}

      let recipientCode = payout.recipient_code
      if (!recipientCode) {
        const recipient = await paystack('/transferrecipient', paystackSecret, 'POST', {
          type: 'nuban',
          name: details.account_name || `CineVerse Seller ${payout.seller_id.slice(0, 8)}`,
          account_number: details.account_number,
          bank_code: details.bank_code,
          currency: 'NGN',
        })

        if (!recipient?.status || !recipient?.data?.recipient_code) {
          return json({ error: `Could not create recipient: ${recipient?.message || 'unknown error'}` }, 502)
        }
        recipientCode = recipient.data.recipient_code
      }

      const transfer = await paystack('/transfer', paystackSecret, 'POST', {
        source: 'balance',
        amount: Math.round(Number(payout.amount) * 100),
        recipient: recipientCode,
        reason: `CineVerse seller payout (${payout.id.slice(0, 8)})`,
      })

      if (!transfer?.status || !transfer?.data?.transfer_code) {
        return json({ error: `Transfer failed: ${transfer?.message || 'unknown error'}` }, 502)
      }

      await supabase
        .from('seller_payouts')
        .update({
          status: 'processing',
          transfer_code: transfer.data.transfer_code,
          recipient_code: recipientCode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payout.id)

      return json({ success: true, transfer: transfer.data })
    }

    case 'cancel': {
      if (!isAdmin) return json({ error: 'Admin only' }, 403)

      const { data: payout } = await supabase
        .from('seller_payouts')
        .select('id')
        .eq('id', body.payout_id)
        .maybeSingle()

      if (!payout) return json({ error: 'Payout not found' }, 404)

      await supabase
        .from('seller_payouts')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', payout.id)
      await supabase
        .from('seller_earnings')
        .update({ status: 'available', payout_id: null })
        .eq('payout_id', payout.id)

      return json({ success: true })
    }

    default:
      return json({ error: 'Unknown action' }, 400)
  }
})
