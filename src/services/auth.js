import { getAll, create, query, update as updateItem, remove as removeItem } from '@/lib/storage'

export function loginUser(email, password) {
  const users = getAll('users')
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return { success: false, error: 'Invalid email or password' }
  if (user.banned) return { success: false, error: 'Your account has been banned. Contact support.' }
  if (user.suspended) return { success: false, error: 'Your account has been suspended.' }
  const { password: _, ...safeUser } = user
  return { success: true, user: safeUser }
}

export function registerUser(userData) {
  const users = getAll('users')
  const exists = users.find(u => u.email === userData.email)
  if (exists) return { success: false, error: 'Email already registered' }
  const newUser = create('users', {
    ...userData,
    role: 'customer',
    avatar: null,
    banned: false,
    suspended: false,
  })
  const { password: _, ...safeUser } = newUser
  return { success: true, user: safeUser }
}

export function getUsers() {
  return getAll('users').map(({ password, ...u }) => u)
}

export function getUserById(id) {
  const users = getAll('users')
  const user = users.find(u => u.id === id)
  if (!user) return null
  const { password: _, ...safeUser } = user
  return safeUser
}

export function updateUser(id, updates) {
  return updateItem('users', id, updates)
}

export function banUser(id) {
  return updateItem('users', id, { banned: true })
}

export function unbanUser(id) {
  return updateItem('users', id, { banned: false })
}

export function suspendUser(id) {
  return updateItem('users', id, { suspended: true })
}

export function unsuspendUser(id) {
  return updateItem('users', id, { suspended: false })
}

export function removeStaff(id) {
  return removeItem('users', id)
}
