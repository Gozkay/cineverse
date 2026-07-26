import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { WishlistProvider, useWishlist } from '@/context/WishlistContext'

const wrapper = ({ children }) => <WishlistProvider>{children}</WishlistProvider>

const sampleProduct = {
  id: '1',
  title: 'Test Movie',
  price: 2500,
  category: 'movie',
  image: '/test.jpg',
}

describe('WishlistContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    expect(result.current.items).toEqual([])
  })

  it('adds an item to the wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].title).toBe('Test Movie')
  })

  it('does not add duplicate items', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.addItem(sampleProduct))
    expect(result.current.items).toHaveLength(1)
  })

  it('removes an item from the wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.removeItem('1'))
    expect(result.current.items).toHaveLength(0)
  })

  it('checks if an item is in the wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    expect(result.current.isInWishlist('1')).toBe(true)
    expect(result.current.isInWishlist('2')).toBe(false)
  })

  it('clears the wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    act(() => result.current.clearWishlist())
    expect(result.current.items).toHaveLength(0)
  })

  it('persists wishlist to localStorage', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })
    act(() => result.current.addItem(sampleProduct))
    const stored = JSON.parse(localStorage.getItem('cineverse_wishlist'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('1')
  })

  it('loads wishlist from localStorage on mount', () => {
    localStorage.setItem('cineverse_wishlist', JSON.stringify([sampleProduct]))
    const { result } = renderHook(() => useWishlist(), { wrapper })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('1')
  })
})
