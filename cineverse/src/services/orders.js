import { supabase } from '@/lib/supabase'

export async function getOrders() {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getOrdersByUser(userId) {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getOrderById(id) {
  const { data } = await supabase.from('orders').select('*').eq('id', id).single()
  return data
}

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ ...orderData, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  return !error
}
