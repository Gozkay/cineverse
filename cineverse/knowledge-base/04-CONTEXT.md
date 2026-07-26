# 04 — Context Providers

React Context provides global state without prop drilling. CineVerse has three context providers:

1. **AuthContext** — user authentication state
2. **CartContext** — shopping cart items
3. **WishlistContext** — wishlist items

---

## File: `src/context/AuthContext.jsx`

**Purpose:** Manages authentication state — user login, registration, logout, session restoration, and profile management. This is the most complex context because it integrates with Supabase Auth and the profiles table.

### Imports & Setup

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
```

Imports React hooks: `createContext` (creates a context object), `useContext` (consumes context in child components), `useEffect` (runs side effects on mount), `useState` (local state).

```jsx
import { supabase } from '@/services/supabase'
```

Imports the Supabase client instance. This is used for all auth API calls (login, register, logout, session check).

### createContext

```jsx
const AuthContext = createContext(undefined)
```

Creates an empty context with default value `undefined`. The actual value is provided by `AuthProvider` below. Using `undefined` as default ensures components using `useAuth()` outside the provider will get a useful error.

### useAuth Hook

```jsx
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

A custom hook that wraps `useContext`. The guard clause (`if (!context)`) provides a clear error message if a component tries to use auth context without being inside `<AuthProvider>`.

### AuthProvider Component

```jsx
export function AuthProvider({ children })
```

The provider component that wraps its children with auth context. `children` is the React subtree that will have access to auth state.

#### State Variables (Lines 11-14)

```jsx
const [user, setUser] = useState(null)
const [profile, setProfile] = useState(null)
const [isLoading, setIsLoading] = useState(true)
```

- `user` — the Supabase Auth user object (null when logged out). Contains `id`, `email`, `user_metadata`, etc.
- `profile` — the user's profile from the `profiles` database table. Contains `full_name`, `role`, `avatar_url`, `phone`, `address`. Null until the profile is fetched.
- `isLoading` — starts `true`. Set to `false` after the initial session check completes. Prevents UI flicker (see ProtectedRoute's loading spinner).

#### Session Restoration (Lines 16-24)

```jsx
useEffect(() => {
  const restoreSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      await fetchProfile(session.user.id)
    }
    setIsLoading(false)
  }
  restoreSession()
}, [])
```

**What this does:** On initial mount, checks if a user session exists (from a previous login that was persisted in localStorage/cookies by Supabase). If a session exists, restores the user and fetches their profile.

**Why it's necessary:** Without this, refreshing the page would lose the auth state. Supabase stores the session in localStorage and the `getSession()` call retrieves it.

**The `[]` dependency array** ensures this runs only once on mount.

#### Auth State Listener (Lines 26-36)

```jsx
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      setUser(session.user)
      await fetchProfile(session.user.id)
    } else {
      setUser(null)
      setProfile(null)
    }
  })
  return () => subscription?.unsubscribe()
}, [])
```

**What this does:** Listens for auth state changes in real time. When a user logs in, registers, or logs out (even in another tab), this fires and updates the state.

**Events that trigger this:**
| Event | When it fires |
|-------|---------------|
| `SIGNED_IN` | User logs in or registers |
| `SIGNED_OUT` | User logs out |
| `TOKEN_REFRESHED` | Session token auto-refreshed |
| `USER_UPDATED` | User profile updated |

**Cleanup:** The returned function (`subscription?.unsubscribe()`) unsubscribes when the component unmounts, preventing memory leaks.

#### Profile Fetching (Lines 38-42)

```jsx
async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (!error) setProfile(data)
}
```

Queries the `profiles` table for the user's profile row. The `profiles` table is created via the database schema and linked to auth.users via a foreign key on `id`. If the profile doesn't exist yet (new user), `error` is set and profile stays null.

#### Auth Actions

**loginUser (Lines 44-47):**
```jsx
async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}
```
Calls Supabase's `signInWithPassword`. On success, the auth state listener fires and updates user/profile. On error, throws the error to the calling component.

**registerUser (Lines 49-56):**
```jsx
async function registerUser(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  if (error) throw error
  if (data?.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id, email, full_name: fullName, role: 'customer'
    })
    if (profileError) throw profileError
  }
  return data
}
```

Registers a new user in two steps:
1. Creates the auth user via `supabase.auth.signUp()` (stores `full_name` in `user_metadata`)
2. Inserts a profile row in the `profiles` table with default role `'customer'`

The profile insert link happens because the `profiles` table has a foreign key to `auth.users`.

**loginWithGoogle (Lines 58-61):**
```jsx
async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  if (error) throw error
  return data
}
```
Triggers Supabase's OAuth flow for Google. Opens a popup (or redirect, depending on config). Supabase handles the entire OAuth flow — the auth state listener catches the result.

**logoutUser (Lines 63-66):**
```jsx
async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```
Signs the user out. The auth state listener fires, setting user and profile to null.

#### Context Value

```jsx
const value = {
  user, profile, isLoading,
  isAuthenticated: !!user,
  role: profile?.role || null,
  login: loginUser,
  register: registerUser,
  loginWithGoogle,
  logout: logoutUser,
  fetchProfile: () => fetchProfile(user?.id),
}
```

The context value exposes:
- `user` — raw Supabase user object
- `profile` — profile from database
- `isLoading` — true during initial session check
- `isAuthenticated` — derived boolean (`!!user`)
- `role` — derived from profile (or null)
- `login`/`register`/`loginWithGoogle`/`logout` — auth action functions
- `fetchProfile` — manually refresh profile

#### Render

```jsx
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
```

Wraps children with the context value, making all state and functions available via `useAuth()`.

### Flow Summary

```
App starts → AuthProvider mounts
  → restoreSession() checks for existing session
    → If session exists: set user, fetchProfile() → set profile → isLoading = false
    → If no session: user = null, profile = null, isLoading = false
  → onAuthStateChange listener subscribed

User logs in → loginUser() called
  → supabase.auth.signInWithPassword() succeeds
  → onAuthStateChange fires with SIGNED_IN + session
  → setUser(session.user) → fetchProfile(userId) → setProfile(data)
  → All components using useAuth() re-render with new state

User logs out → logoutUser() called
  → supabase.auth.signOut() succeeds
  → onAuthStateChange fires with SIGNED_OUT + null session
  → setUser(null) → setProfile(null)
  → ProtectedRoute redirects to /login
```

### Auth Persistence

Supabase stores the session in **localStorage** under the `sb-<project-ref>-auth-token` key. This means:
- Closing and reopening the browser preserves the session
- Multiple tabs share the same session
- Clearing browser storage logs the user out

---

## File: `src/context/CartContext.jsx`

**Purpose:** Manages the shopping cart. Items persist to localStorage so the cart survives page refreshes.

### Imports & Initialization

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
```

Standard React imports.

```jsx
const CartContext = createContext(undefined)
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
```

Same pattern as AuthContext: create context with `undefined` default, export a `useCart` hook with a guard clause.

### State & Persistence

```jsx
const CART_STORAGE_KEY = 'cineverse_cart'
```

The localStorage key used to store/retrieve cart data. Using a constant ensures consistency.

```jsx
const [items, setItems] = useState(() => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
})
```

**Key technique:** lazy initialization. The initial value is computed once (not on every render) by reading from localStorage. This avoids a flash of empty cart followed by loading.

The `try/catch` handles corrupted localStorage data gracefully — if JSON parsing fails, it defaults to an empty array.

```jsx
useEffect(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}, [items])
```

Persists the cart whenever it changes. This effect runs after every `setItems()` call.

### Derived State

```jsx
const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

Two derived values computed from `items`:
- `totalItems` — total count of all items (sum of quantities)
- `totalPrice` — total cost (price × quantity summed)

These are re-computed on every render of the provider (which happens whenever items change).

### Cart Actions

**addItem (Lines 29-41):**
```jsx
function addItem(product, quantity = 1) {
  setItems(prev => {
    const existing = prev.find(item => item.id === product.id && item.type === product.type)
    if (existing) {
      return prev.map(item =>
        item.id === product.id && item.type === product.type
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    }
    return [...prev, { ...product, quantity }]
  })
}
```

Two scenarios:
1. **Item already in cart** (same `id` + same `type`): increments quantity
2. **New item**: adds it to the array with specified quantity

The `type` check (e.g., 'movie', 'book') prevents duplicate detection across product categories that might share the same ID.

**removeItem (Lines 43-45):**
```jsx
function removeItem(id, type) {
  setItems(prev => prev.filter(item => !(item.id === id && item.type === type)))
}
```

Filters out the item matching both `id` and `type`.

**updateQuantity (Lines 47-55):**
```jsx
function updateQuantity(id, type, quantity) {
  if (quantity < 1) {
    removeItem(id, type)
    return
  }
  setItems(prev => prev.map(item =>
    item.id === id && item.type === type ? { ...item, quantity } : item
  ))
}
```

If quantity falls below 1, removes the item. Otherwise updates the quantity.

**clearCart:**
```jsx
function clearCart() {
  setItems([])
}
```

Empties the cart entirely.

**isInCart:**
```jsx
function isInCart(id, type) {
  return items.some(item => item.id === id && item.type === type)
}
```

Boolean helper for UI — used to show "In Cart" vs "Add to Cart" buttons.

### Context Value

```jsx
<CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, isInCart }}>
```

Exposes all state and actions to consuming components.

### Flow Summary

```
User clicks "Add to Cart" on a movie card
  → Component calls addItem(movie, 1)
  → setItems adds/appends the item
  → useEffect fires: items saved to localStorage
  → All components using useCart() re-render
  → Navbar badge shows updated totalItems count

User refreshes page
  → CartProvider mounts
  → Lazy initialization reads localStorage
  → Cart state is restored
```

---

## File: `src/context/WishlistContext.jsx`

**Purpose:** Manages the wishlist. Structurally identical to CartContext but simpler (no quantity tracking).

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
const WishlistContext = createContext(undefined)
const WISHLIST_STORAGE_KEY = 'cineverse_wishlist'
```

Same pattern as CartContext. The localStorage key is different (`cineverse_wishlist` vs `cineverse_cart`).

### Lazy Initialization

```jsx
const [items, setItems] = useState(() => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
})
```

Same try/catch pattern as CartContext.

### Persistence

```jsx
useEffect(() => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
}, [items])
```

### Wishlist Actions

**addToWishlist (Lines 27-32):**
```jsx
function addToWishlist(product) {
  setItems(prev => {
    if (prev.some(item => item.id === product.id && item.type === product.type)) return prev
    return [...prev, { ...product }]
  })
}
```

Unlike the cart, adding a duplicate is a no-op. No quantity — an item is either in the wishlist or not.

**removeFromWishlist (Lines 34-36):**
```jsx
function removeFromWishlist(id, type) {
  setItems(prev => prev.filter(item => !(item.id === id && item.type === type)))
}
```

**isInWishlist:**
```jsx
function isInWishlist(id, type) {
  return items.some(item => item.id === id && item.type === type)
}
```

**clearWishlist:**
```jsx
function clearWishlist() {
  setItems([])
}
```

### Derived State

```jsx
const wishlistCount = items.length
```

Simple count — not a sum of quantities (there are no quantities in a wishlist).

### Context Value

```jsx
<WishlistContext.Provider value={{ items, wishlistCount, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist }}>
```

---

## Context Comparison

| Feature | AuthContext | CartContext | WishlistContext |
|---------|-------------|-------------|-----------------|
| Persistence | Supabase session (localStorage) | localStorage | localStorage |
| Initial state from | API call / session check | localStorage | localStorage |
| Async operations | Yes (API calls to Supabase) | No (sync only) | No (sync only) |
| Complexity | High (OAuth, session, profile) | Low | Low |
| Dependencies | None (standalone) | None | None |
| Used by | ProtectedRoute, Navbar, Profile, Dashboard, Login, Register | Cart page, Checkout, MovieCard, BookCard, Navbar badge | Wishlist page, ProductCard, Navbar |

### Data Flow Between Contexts

All three contexts are independent — they don't reference each other. If you wanted to implement "add to cart from wishlist", you'd need to call `addItem()` from CartContext and `removeFromWishlist()` from WishlistContext in the same component. The component itself orchestrates the cross-context logic.
