import { supabase } from '@/lib/supabase'

export async function getCartItems(userId) {
  const { data } = await supabase.from('cart_items').select('*').eq('user_id', userId)
  return data || []
}

export async function addCartItem(userId, item) {
  const existing = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_slug', item.product_slug)
    .single()

  if (existing.data) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.data.quantity + item.quantity })
      .eq('id', existing.data.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('cart_items').insert({ user_id: userId, ...item })
    if (error) throw error
  }
}

export async function updateCartItemQuantity(userId, productSlug, quantity) {
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('user_id', userId).eq('product_slug', productSlug)
  if (error) throw error
}

export async function removeCartItem(userId, productSlug) {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId).eq('product_slug', productSlug)
  if (error) throw error
}

export async function clearCart(userId) {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId)
  if (error) throw error
}
