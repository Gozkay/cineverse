import { supabase } from '@/lib/supabase'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`

async function callAI(payload) {
  const { data, error } = await supabase.functions.invoke('ai-proxy', { body: payload })
  if (error) throw new Error(error.message || 'AI request failed')
  return data
}

export async function aiChat(messages) {
  const data = await callAI({ action: 'chat', messages })
  return data?.text || ''
}

export async function aiRecommend(interests) {
  const data = await callAI({ action: 'recommend', interests })
  return data?.recommendations || []
}

export async function aiSummarize(item) {
  const data = await callAI({ action: 'summarize', item })
  return data?.text || ''
}

export async function aiSearchQuery(query) {
  const data = await callAI({ action: 'search', query })
  return data
}

export async function aiGenerateDescription(product) {
  const data = await callAI({ action: 'generate', product })
  return data?.text || ''
}

export { FUNCTION_URL }
