import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
        order: vi.fn(() => ({
          order: vi.fn(),
        })),
      })),
      order: vi.fn(),
    })),
    insert: vi.fn(() => ({ error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
}

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))

const auth = await import('@/services/auth')

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loginUser returns success with user on valid credentials', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '1', email: 'test@test.com' } },
      error: null,
    })
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: '1', name: 'Test', role: 'customer' }, error: null })),
        })),
      })),
      insert: vi.fn(() => ({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    }))

    const result = await auth.loginUser('test@test.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.user).toBeDefined()
  })

  it('loginUser returns error on invalid credentials', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    })

    const result = await auth.loginUser('wrong@test.com', 'badpassword')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid login credentials')
  })

  it('registerUser creates account and profile', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '2', email: 'new@test.com' } },
      error: null,
    })
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: '2', name: 'New User', role: 'customer' }, error: null })),
        })),
      })),
      insert: vi.fn(() => ({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    }))

    const result = await auth.registerUser({ name: 'New User', email: 'new@test.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('logoutUser signs out successfully', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })
    const result = await auth.logoutUser()
    expect(result.success).toBe(true)
  })
})
