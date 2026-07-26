import { supabase } from '@/lib/supabase'

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, error: error.message }
  const profile = await getProfile(data.user.id)
  const safeUser = { ...data.user, ...profile }
  return { success: true, user: safeUser }
}

export async function registerUser({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) return { success: false, error: error.message }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
      role: 'customer',
    })
    if (profileError) return { success: false, error: profileError.message }
  }

  const profile = data.user ? await getProfile(data.user.id) : null
  const safeUser = data.user ? { ...data.user, ...profile } : data.user
  return { success: true, user: safeUser }
}

export function getSession() {
  return supabase.auth.getSession()
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) return { success: false, error: error.message }
  return { success: true }
}

async function getProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data || {}
}

export async function getUsers() {
  const { data: profiles, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return profiles || []
}

export async function getUserById(id) {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
  return data
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function banUser(id) {
  const { error } = await supabase.from('profiles').update({ banned: true }).eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function unbanUser(id) {
  const { error } = await supabase.from('profiles').update({ banned: false }).eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function suspendUser(id) {
  const { error } = await supabase.from('profiles').update({ suspended: true }).eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function unsuspendUser(id) {
  const { error } = await supabase.from('profiles').update({ suspended: false }).eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function removeStaff(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}
