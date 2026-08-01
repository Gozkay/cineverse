import { supabase } from '@/lib/supabase'

export async function getWishlistItems(userId) {
  const { data } = await supabase.from('wishlist_items').select('*').eq('user_id', userId)
  return data || []
}

export async function addWishlistItem(userId, item) {
  const existing = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_slug', item.product_slug)
    .single()

  if (!existing.data) {
    const { error } = await supabase.from('wishlist_items').insert({ user_id: userId, ...item })
    if (error) throw error
  }
}

export async function removeWishlistItem(userId, productSlug) {
  const { error } = await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_slug', productSlug)
  if (error) throw error
}

export async function clearWishlist(userId) {
  const { error } = await supabase.from('wishlist_items').delete().eq('user_id', userId)
  if (error) throw error
}
