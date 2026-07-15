import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser } from '@/services/auth'

const AuthContext = createContext(null)

const AUTH_KEY = 'cineverse_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem(AUTH_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const result = loginUser(email, password)
    if (result.success) {
      setUser(result.user)
      localStorage.setItem(AUTH_KEY, JSON.stringify(result.user))
    }
    return result
  }, [])

  const register = useCallback(async (userData) => {
    const result = registerUser(userData)
    if (result.success) {
      setUser(result.user)
      localStorage.setItem(AUTH_KEY, JSON.stringify(result.user))
    }
    return result
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  const refreshUser = useCallback(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch {
      setUser(null)
    }
  }, [])

  const isAuthenticated = !!user
  const role = user?.role || null
  const isAdmin = role === 'admin'
  const isManager = role === 'manager'
  const isStaff = role === 'staff'
  const isCustomer = role === 'customer'
  const isStaffOrAbove = isStaff || isManager || isAdmin

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated, role, isAdmin, isManager, isStaff, isCustomer, isStaffOrAbove, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
