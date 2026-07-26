import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'cineverse_wishlist'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      localStorage.removeItem(WISHLIST_KEY)
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    setItems(prev => {
      if (prev.find(item => item.id === product.id)) {
        toast('Already in wishlist')
        return prev
      }
      toast.success(`Added "${product.title}" to wishlist`)
      return [...prev, product]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) toast.success(`Removed "${item.title}" from wishlist`)
      return prev.filter(item => item.id !== id)
    })
  }, [])

  const isInWishlist = useCallback((id) => {
    return items.some(item => item.id === id)
  }, [items])

  const clearWishlist = useCallback(() => {
    setItems([])
  }, [])

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}
