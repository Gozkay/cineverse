# 14 — Testing

---

## Overview

Testing uses **Vitest** (Vite-integrated test runner) with **Testing Library** (React component testing) and **jsdom** (browser environment simulation).

**Test configuration** (from `vite.config.js`):
```js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  css: true,
}
```

- `globals: true` — Test functions (`describe`, `it`, `expect`) are available without imports
- `environment: 'jsdom'` — Simulates a browser DOM using jsdom
- `setupFiles` — Runs before each test file to set up testing library matchers
- `css: true` — Processes CSS imports (for testing styled components)

**42 tests across 6 files.**

---

## Setup File

### `src/test/setup.js`

Imports `@testing-library/jest-dom` which adds custom matchers:
- `toBeInTheDocument()` — checks if element exists in DOM
- `toHaveTextContent()` — checks text content
- `toHaveClass()` — checks CSS classes
- `toBeDisabled()` — checks disabled attribute
- `toHaveAttribute()` — checks any attribute

These matchers make assertions more readable:
```js
expect(screen.getByText('Add to Cart')).toBeInTheDocument()
expect(button).toBeDisabled()
```

---

## Test Files

### `src/test/utils.test.jsx`

**Tests for utility functions: `formatCurrency`, `formatDate`, `formatDateTime`, `cn`.**

```
describe('formatCurrency')
  ✓ formats NGN currency correctly          → ₦1,500
  ✓ handles zero                            → ₦0
  ✓ handles large numbers                   → ₦1,000,000

describe('formatDate')
  ✓ formats date string                     → "Jan 15, 2024"
  ✓ returns N/A for null/undefined

describe('formatDateTime')
  ✓ formats date with time                  → "Jan 15, 2024, 02:30 PM"
  ✓ returns N/A for null/undefined

describe('cn')
  ✓ merges class names                      → "px-4 py-2"
  ✓ handles conditional classes             → "px-4 bg-red-500"
  ✓ resolves Tailwind conflicts             → "px-4" (not "px-4 px-6")
```

### `src/test/ProtectedRoute.test.jsx`

**Tests for the ProtectedRoute component.**

```
describe('ProtectedRoute')
  ✓ shows spinner when loading
  ✓ redirects to login when not authenticated
  ✓ renders children when authenticated
  ✓ shows 403 when role doesn't match
  ✓ renders children when role matches
```

**Key testing patterns:**
- Mocks `useAuth()` to return different states
- Wraps in `MemoryRouter` (needed because ProtectedRoute uses `Navigate` and `useLocation`)
- Tests the redirect: `expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()`

### `src/test/CartContext.test.jsx`

**Tests for CartContext operations.**

```
describe('CartContext')
  ✓ starts with empty cart
  ✓ adds items to cart
  ✓ increases quantity for existing items
  ✓ removes items from cart
  ✓ updates item quantity
  ✓ clears cart
  ✓ checks if item is in cart
```

**Testing patterns:** Wraps test component in `CartProvider`, calls `addItem`/`removeItem` from the component, asserts state changes.

### `src/test/WishlistContext.test.jsx`

**Tests for WishlistContext operations.**

```
describe('WishlistContext')
  ✓ starts with empty wishlist
  ✓ adds items to wishlist
  ✓ does not add duplicate items
  ✓ removes items from wishlist
  ✓ clears wishlist
  ✓ checks if item is in wishlist
```

### `src/test/usePaystack.test.jsx`

**Tests for the Paystack payment hook.**

```
describe('usePaystack')
  ✓ initializes payment when PaystackPop exists
  ✓ dynamically loads Paystack script when missing
```

**Testing patterns:**
- Uses `globalThis` to mock `window.PaystackPop`
- Verifies script injection via `document.querySelector('script[src*="paystack"]')`
- Tests the two code paths: already loaded vs. needs loading

### `src/test/auth.test.jsx`

**Tests for auth service functions.**

```
describe('auth service')
  ✓ loginUser returns success with valid credentials
  ✓ loginUser returns error with invalid credentials
  ✓ registerUser creates user and profile
  ✓ logoutUser signs out successfully
```

**Testing patterns:**
- Mocks `supabase.auth.signInWithPassword`, `signUp`, `signOut`, and Supabase database queries
- Uses `vi.mock()` to replace the Supabase module with mock implementations
- Tests both success and failure paths

---

## Running Tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode (re-runs on file changes)
```

**Current status:** 0 failing tests, 0 lint errors.

---

## Test Structure Pattern

```
describe('ComponentName')
  ✓ scenario 1   → arrange, act, assert
  ✓ scenario 2   → arrange, act, assert
```

**Standard arragements:**
1. **Render** the component with `render()` from Testing Library
2. **Act** using `userEvent.click()` or `fireEvent`
3. **Assert** using `expect()` with jest-dom matchers

**Mocking strategy:**
- Context: Mock `useAuth()` return values
- External APIs: Mock Supabase client functions
- Window globals: Use `globalThis` or `vi.stubGlobal()`
