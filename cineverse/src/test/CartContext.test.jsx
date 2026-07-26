import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/context/CartContext'

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const sampleProduct = {
  id: '1',
  title: 'Test Movie',
  price: 2500,
  category: 'movie',
  image: '/test.jpg',
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('adds an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].title).toBe('Test Movie')
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('increments quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.addItem(sampleProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('removes an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.removeItem('1'))
    expect(result.current.items).toHaveLength(0)
  })

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.updateQuantity('1', 5))
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('removes item when quantity drops below 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.updateQuantity('1', 0))
    expect(result.current.items).toHaveLength(0)
  })

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.clearCart())
    expect(result.current.items).toHaveLength(0)
  })

  it('calculates subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.addItem({ ...sampleProduct, id: '2', title: 'Test Book', price: 1500 }))
    expect(result.current.subtotal).toBe(4000)
  })

  it('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    const stored = JSON.parse(localStorage.getItem('cineverse_cart'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('1')
  })

  it('loads cart from localStorage on mount', () => {
    localStorage.setItem('cineverse_cart', JSON.stringify([{ ...sampleProduct, quantity: 2 }]))
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })
})
