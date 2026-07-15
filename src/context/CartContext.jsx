import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const CART_KEY = 'cineverse_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      localStorage.removeItem(CART_KEY)
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, loaded])

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        toast.success(`Updated "${product.title}" quantity`)
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      toast.success(`Added "${product.title}" to cart`)
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) toast.success(`Removed "${item.title}" from cart`)
      return prev.filter(item => item.id !== id)
    })
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return removeItem(id)
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    toast.success('Cart cleared')
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, loaded }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
