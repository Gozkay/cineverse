import { supabase } from '@/lib/supabase'

const PAYOUT_FUNCTION = 'seller-payout'

async function callPayout(payload) {
  const { data, error } = await supabase.functions.invoke(PAYOUT_FUNCTION, { body: payload })
  if (error) throw new Error(error.message || 'Request failed')
  return data
}

export async function getSellerProducts(sellerId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getSellerStats(sellerId) {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, status, sales_count')
    .eq('seller_id', sellerId)
  if (productsError) throw new Error(productsError.message)

  const { data: earnings, error: earningsError } = await supabase
    .from('seller_earnings')
    .select('net, status')
    .eq('seller_id', sellerId)
  if (earningsError) throw new Error(earningsError.message)

  const { data: payouts, error: payoutsError } = await supabase
    .from('seller_payouts')
    .select('amount, status')
    .eq('seller_id', sellerId)
  if (payoutsError) throw new Error(payoutsError.message)

  return {
    productCount: products.length,
    pendingCount: products.filter(p => p.status === 'pending').length,
    activeCount: products.filter(p => p.status === 'active').length,
    salesCount: products.reduce((sum, p) => sum + (p.sales_count || 0), 0),
    availableBalance: earnings.filter(e => e.status === 'available').reduce((sum, e) => sum + Number(e.net), 0),
    pendingPayout: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0),
    totalEarned: earnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + Number(e.net), 0),
  }
}

export async function getEarnings(sellerId) {
  const { data, error } = await supabase
    .from('seller_earnings')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getAvailableBalance(sellerId) {
  const { data, error } = await supabase
    .from('seller_earnings')
    .select('net')
    .eq('seller_id', sellerId)
    .eq('status', 'available')
  if (error) throw new Error(error.message)
  return (data || []).reduce((sum, e) => sum + Number(e.net), 0)
}

export async function requestPayout({ amount, bank_details }) {
  return callPayout({ action: 'request', amount, bank_details })
}

export async function getBanks() {
  return callPayout({ action: 'banks' })
}

export async function adminTransferPayout(payoutId) {
  return callPayout({ action: 'transfer', payout_id: payoutId })
}

export async function adminCancelPayout(payoutId) {
  return callPayout({ action: 'cancel', payout_id: payoutId })
}

export async function getSellerPayouts(sellerId) {
  const { data, error } = await supabase
    .from('seller_payouts')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getAllPayouts() {
  const { data, error } = await supabase
    .from('seller_payouts')
    .select('*, seller:profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return data || []
}

export async function uploadSellerFile(bucket, userId, file, onProgress) {
  const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  onProgress?.(100)
  return path
}

export function getPublicImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data?.publicUrl || ''
}

export async function getSignedVideoUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data, error } = await supabase.storage.from('product-files').createSignedUrl(path, 3600)
  if (error) return null
  return data?.signedUrl || null
}
