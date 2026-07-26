import { supabase } from '@/lib/supabase'

export async function getCoupons() {
  const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function getCouponByCode(code) {
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle()
  return data
}

export async function createCoupon(coupon) {
  const { data, error } = await supabase.from('coupons').insert(coupon).select().single()
  if (error) throw error
  return data
}

export async function updateCoupon(id, updates) {
  const { data, error } = await supabase.from('coupons').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) throw error
}

export function validateCoupon(coupon, subtotal) {
  if (!coupon || !coupon.active) return { valid: false, reason: 'Coupon not found' }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { valid: false, reason: 'Coupon expired' }
  if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) return { valid: false, reason: 'Coupon usage limit reached' }
  if (subtotal < coupon.min_amount) return { valid: false, reason: `Minimum order amount is ₦${coupon.min_amount.toLocaleString()}` }

  let discount = 0
  if (coupon.discount_percent > 0) discount = Math.round(subtotal * coupon.discount_percent / 100)
  if (coupon.discount_amount > 0) discount = Math.max(discount, coupon.discount_amount)
  discount = Math.min(discount, subtotal)

  return { valid: true, discount, code: coupon.code }
}

export async function incrementCouponUsage(id) {
  const { error } = await supabase.rpc('increment_coupon_usage', { coupon_id: id })
  if (error) throw error
}
