import { supabase } from '@/lib/supabase'

export async function getProducts({ category, search, page = 1, limit = 20, status, includeAll } = {}) {
  let query = supabase.from('products').select('*', { count: 'exact' })

  if (category) query = query.eq('category', category)
  if (status) query = query.eq('status', status)
  else if (!includeAll) query = query.eq('status', 'active')
  if (search) query = query.ilike('title', `%${search}%`)

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)
  return { data: data || [], count: count || 0 }
}

export async function getProductById(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
  if (error) return null
  return data
}

export async function upsertProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .upsert(product, { onConflict: 'slug' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}
