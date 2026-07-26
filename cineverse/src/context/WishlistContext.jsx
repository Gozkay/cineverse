import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getWishlistItems, addWishlistItem, removeWishlistItem } from '@/services/wishlist'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'cineverse_wishlist'

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      localStorage.removeItem(WISHLIST_KEY)
      return []
    }
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (user && !loaded) {
      getWishlistItems(user.id).then(serverItems => {
        if (serverItems.length > 0) {
          const merged = [...serverItems.map(i => ({
            id: i.product_slug,
            product_slug: i.product_slug,
            title: i.title,
            price: i.price,
            image: i.image,
            category: i.category,
          }))]
          for (const local of items) {
            if (!merged.find(m => m.product_slug === local.product_slug || m.id === local.id)) {
              merged.push(local)
              addWishlistItem(user.id, {
                product_slug: local.product_slug || `${local.category}:${local.id}`,
                title: local.title,
                price: local.price,
                image: local.image || '',
                category: local.category,
              }).catch(() => {})
            }
          }
          setItems(merged)
        } else if (items.length > 0) {
          for (const item of items) {
            addWishlistItem(user.id, {
              product_slug: item.product_slug || `${item.category}:${item.id}`,
              title: item.title,
              price: item.price,
              image: item.image || '',
              category: item.category,
            }).catch(() => {})
          }
        }
        setLoaded(true)
      }).catch(() => { setLoaded(true) })
    } else if (!user) {
      setLoaded(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    const productSlug = `${product.category || 'movie'}:${product.id}`
    setItems(prev => {
      if (prev.find(item => item.product_slug === productSlug || item.id === product.id)) {
        toast('Already in wishlist')
        return prev
      }
      toast.success(`Added "${product.title}" to wishlist`)
      const newItem = {
        id: productSlug,
        product_slug: productSlug,
        title: product.title,
        price: product.price,
        image: product.image || product.poster_path || '',
        category: product.category || 'movie',
      }
      if (user) {
        addWishlistItem(user.id, {
          product_slug: productSlug,
          title: product.title,
          price: product.price,
          image: product.image || product.poster_path || '',
          category: product.category || 'movie',
        }).catch(() => {})
      }
      return [...prev, newItem]
    })
  }, [user])

  const removeItem = useCallback((slug) => {
    setItems(prev => {
      const item = prev.find(i => i.product_slug === slug || i.id === slug)
      if (item) toast.success(`Removed "${item.title}" from wishlist`)
      if (user) {
        removeWishlistItem(item?.id).catch(() => {})
      }
      return prev.filter(i => i.product_slug !== slug && i.id !== slug)
    })
  }, [user])

  const isInWishlist = useCallback((slug) => {
    return items.some(item => item.product_slug === slug || item.id === slug)
  }, [items])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist: clearAll }}>
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
