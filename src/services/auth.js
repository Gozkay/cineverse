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
  const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return profiles || []
}

export async function getUserById(id) {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
  return data
}

export async function updateUser(id, updates) {
  const { data } = await supabase.from('profiles').update(updates).eq('id', id).select().single()
  return data
}

export async function banUser(id) {
  return updateUser(id, { banned: true })
}

export async function unbanUser(id) {
  return updateUser(id, { banned: false })
}

export async function suspendUser(id) {
  return updateUser(id, { suspended: true })
}

export async function unsuspendUser(id) {
  return updateUser(id, { suspended: false })
}

export async function removeStaff(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  return !error
}
