import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

async function getHook() {
  const { usePaystack } = await import('@/hooks/usePaystack')
  return usePaystack
}

describe('usePaystack', () => {
  beforeEach(() => {
    vi.resetModules()
    delete window.PaystackPop
    document.body.innerHTML = ''
  })

  it('creates a script tag when PaystackPop is not loaded', async () => {
    const usePaystack = await getHook()
    const { result } = renderHook(() => usePaystack())

    act(() => {
      result.current.initializePayment({
        email: 'test@test.com',
        amount: 2500,
        onSuccess: vi.fn(),
        onClose: vi.fn(),
      })
    })

    const scripts = document.querySelectorAll('script[src="https://js.paystack.co/v1/inline.js"]')
    expect(scripts.length).toBe(1)
  })

  it('does not duplicate script tags on multiple calls', async () => {
    const usePaystack = await getHook()
    const { result } = renderHook(() => usePaystack())

    act(() => {
      result.current.initializePayment({ email: 'a@a.com', amount: 1000, onSuccess: vi.fn(), onClose: vi.fn() })
    })
    act(() => {
      result.current.initializePayment({ email: 'b@b.com', amount: 2000, onSuccess: vi.fn(), onClose: vi.fn() })
    })

    const scripts = document.querySelectorAll('script[src="https://js.paystack.co/v1/inline.js"]')
    expect(scripts.length).toBe(1)
  })

  it('calls openPaystack directly if PaystackPop is already loaded', async () => {
    window.PaystackPop = {
      setup: vi.fn(() => ({ openIframe: vi.fn() })),
    }
    const usePaystack = await getHook()
    const { result } = renderHook(() => usePaystack())

    act(() => {
      result.current.initializePayment({
        email: 'test@test.com',
        amount: 2500,
        onSuccess: vi.fn(),
        onClose: vi.fn(),
      })
    })

    expect(window.PaystackPop.setup).toHaveBeenCalledOnce()
  })
})
