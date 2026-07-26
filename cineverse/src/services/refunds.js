import { supabase } from '@/lib/supabase'

export async function getRefundRequests(orderId) {
  const { data } = await supabase.from('refund_requests').select('*').eq('order_id', orderId).order('created_at', { ascending: false })
  return data || []
}

export async function getAllRefundRequests() {
  const { data } = await supabase.from('refund_requests').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function createRefundRequest(orderId, reason) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('refund_requests').insert({
    order_id: orderId,
    user_id: user.id,
    reason,
  }).select().single()
  if (error) throw error
  return data
}

export async function updateRefundStatus(id, status, adminNote) {
  const { data, error } = await supabase.from('refund_requests').update({
    status,
    admin_note: adminNote || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select().single()
  if (error) throw error
  return data
}
