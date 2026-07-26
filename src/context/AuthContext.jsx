import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, logoutUser, onAuthChange, getSession } from '@/services/auth'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = onAuthChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  const login = useCallback(async (email, password) => {
    const result = await loginUser(email, password)
    if (result.success) {
      setUser(result.user)
      if (result.user?.id) fetchProfile(result.user.id)
    }
    return result
  }, [])

  const register = useCallback(async (userData) => {
    const result = await registerUser(userData)
    if (result.success) {
      setUser(result.user)
      if (result.user?.id) fetchProfile(result.user.id)
    }
    return result
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setUser(null)
    setProfile(null)
  }, [])

  const isAuthenticated = !!user
  const role = profile?.role || null
  const isAdmin = role === 'admin'
  const isManager = role === 'manager'
  const isStaff = role === 'staff'
  const isCustomer = role === 'customer'
  const isStaffOrAbove = isStaff || isManager || isAdmin

  const refreshUser = useCallback(() => {
    if (user?.id) fetchProfile(user.id)
  }, [user?.id])

  return (
    <AuthContext.Provider value={{ user, profile, login, register, logout, loading, isAuthenticated, role, isAdmin, isManager, isStaff, isCustomer, isStaffOrAbove, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
