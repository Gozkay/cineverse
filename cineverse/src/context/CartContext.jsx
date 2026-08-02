import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getCartItems, addCartItem, updateCartItemQuantity, removeCartItem, clearCart as clearCartApi } from '@/services/cart'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const CART_KEY = 'cineverse_cart'

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      localStorage.removeItem(CART_KEY)
      return []
    }
  })
  const [loaded, setLoaded] = useState(false)
  const prevUserIdRef = useRef(null)

  useEffect(() => {
    const prevUserId = prevUserIdRef.current
    prevUserIdRef.current = user?.id || null
    if (user && !loaded) {
      getCartItems(user.id).then(serverItems => {
        if (serverItems.length > 0) {
          const localItems = items
          const merged = [...serverItems.map(i => ({
            id: (i.product_slug || '').split(':').slice(1).join(':'),
            product_slug: i.product_slug,
            title: i.title,
            price: i.price,
            image: i.image,
            category: i.category,
            quantity: i.quantity,
          }))]
          for (const local of localItems) {
            if (!merged.find(m => m.product_slug === local.product_slug || m.id === local.id)) {
              merged.push(local)
              addCartItem(user.id, {
                product_slug: local.product_slug || `${local.category}:${local.id}`,
                title: local.title,
                price: local.price,
                image: local.image || '',
                category: local.category,
                quantity: local.quantity,
              }).catch(() => {})
            }
          }
          setItems(merged)
        } else if (items.length > 0) {
          for (const item of items) {
            addCartItem(user.id, {
              product_slug: item.product_slug || `${item.category}:${item.id}`,
              title: item.title,
              price: item.price,
              image: item.image || '',
              category: item.category,
              quantity: item.quantity,
            }).catch(() => {})
          }
        }
        setLoaded(true)
      }).catch(() => { setLoaded(true) })
    } else if (!user) {
      if (prevUserId) {
        setItems([])
        localStorage.removeItem(CART_KEY)
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset sync flag when the user logs out
      setLoaded(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, quantity = 1) => {
    const productSlug = `${product.category || 'movie'}:${product.id}`
    setItems(prev => {
      const existing = prev.find(item => item.product_slug === productSlug || item.id === product.id)
      if (existing) {
        toast.success(`Updated "${product.title}" quantity`)
        if (user) {
          updateCartItemQuantity(user.id, productSlug, existing.quantity + quantity).catch(() => {})
        }
        return prev.map(item =>
          (item.product_slug === productSlug || item.id === product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      toast.success(`Added "${product.title}" to cart`)
      const newItem = {
        id: product.id,
        product_slug: productSlug,
        title: product.title,
        price: product.price,
        image: product.image || product.poster_path || '',
        category: product.category || 'movie',
        quantity,
      }
      if (user) {
        addCartItem(user.id, {
          product_slug: productSlug,
          title: product.title,
          price: product.price,
          image: product.image || product.poster_path || '',
          category: product.category || 'movie',
          quantity,
        }).catch(() => {})
      }
      return [...prev, newItem]
    })
  }, [user])

  const removeItem = useCallback((slug) => {
    setItems(prev => {
      const item = prev.find(i => i.product_slug === slug || i.id === slug)
      if (item) toast.success(`Removed "${item.title}" from cart`)
      if (user && item) {
        removeCartItem(user.id, item.product_slug).catch(() => {})
      }
      return prev.filter(i => i.product_slug !== slug && i.id !== slug)
    })
  }, [user])

  const updateQuantity = useCallback((slug, quantity) => {
    if (quantity < 1) return removeItem(slug)
    setItems(prev =>
      prev.map(item =>
        (item.product_slug === slug || item.id === slug) ? { ...item, quantity } : item
      )
    )
    if (user) {
      const item = items.find(i => i.product_slug === slug || i.id === slug)
      if (item?.product_slug) updateCartItemQuantity(user.id, item.product_slug, quantity).catch(() => {})
    }
  }, [user, items, removeItem])

  const clearAll = useCallback(() => {
    setItems([])
    if (user) clearCartApi(user.id).catch(() => {})
    toast.success('Cart cleared')
  }, [user])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart: clearAll, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
