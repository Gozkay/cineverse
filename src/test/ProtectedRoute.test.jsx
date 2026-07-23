import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'


vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

describe('ProtectedRoute', () => {
  it('shows loading spinner while auth is loading', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      role: null,
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      role: null,
    })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders children for authenticated users', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', email: 'test@test.com' },
      profile: { role: 'customer' },
      role: 'customer',
    })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('blocks users without required role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      role: 'customer',
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><div>Admin only</div></ProtectedRoute>} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('Admin only')).not.toBeInTheDocument()
  })

  it('allows users with required role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      role: 'admin',
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><div>Admin only</div></ProtectedRoute>} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Admin only')).toBeInTheDocument()
  })
})
