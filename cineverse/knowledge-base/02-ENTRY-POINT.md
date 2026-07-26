# 02 — Entry Point

This section covers the three files that bootstrap the application: `index.html`, `src/main.jsx`, and `src/App.jsx`. Understanding how these files connect explains how React mounts, what providers wrap the app, and how the initial render happens.

---

## File: `index.html`

**Purpose:** The HTML shell that hosts the entire React application. Every SPA needs exactly one HTML file — this is it.

**Location:** Project root (`/index.html`)

```html
<!doctype html>
```

**Line 1:** The DOCTYPE declaration. Tells the browser this is an HTML5 document. Must be the very first line with no whitespace before it.

```html
<html lang="en">
```

**Line 2:** The root `<html>` element. `lang="en"` sets the document language to English, which helps screen readers and search engines.

```html
<head>
```

**Line 3:** Opens the `<head>` section — meta-information about the page that isn't displayed directly.

```html
  <meta charset="UTF-8" />
```

**Line 4:** Sets character encoding to UTF-8 so emoji, special characters, and international text render correctly.

```html
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

**Line 5:** Links the favicon (browser tab icon). Points to `/favicon.svg` (a violet play icon on dark background). The `type="image/svg+xml"` tells browsers it's an SVG (vector format).

```html
  <link rel="manifest" href="/manifest.json" />
```

**Line 6:** Links the PWA (Progressive Web App) manifest file. This enables "Add to Home Screen" on mobile devices — it defines the app name, icons, theme color, and display mode.

```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Line 7:** Viewport meta tag essential for mobile responsiveness. `width=device-width` matches the device width; `initial-scale=1.0` sets the default zoom level.

```html
  <meta name="theme-color" content="#8b5cf6" />
```

**Line 8:** Sets the browser chrome color (address bar on mobile) to violet (`#8b5cf6`), matching the app's accent color.

```html
  <meta name="description" content="CineVerse — Discover, buy, and sell movies, books, manga, and comics. A modern e-commerce marketplace with Paystack payments." />
```

**Line 9:** Meta description — used by search engines (Google) as the page description in search results. This is critical for SEO.

```html
  <meta property="og:title" content="CineVerse — Movies, Books, Manga & Comics" />
  <meta property="og:description" content="Discover, buy, and sell your favorite entertainment media in one beautiful dark-themed marketplace." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://cineverse.app" />
```

**Lines 10-13:** Open Graph (OG) meta tags. These control how the page appears when shared on social media (Facebook, Twitter, Discord, WhatsApp). `og:title` is the headline, `og:description` is the summary, `og:type` tells platforms it's a website, `og:url` is the canonical URL.

```html
  <link rel="canonical" href="https://cineverse.app" />
```

**Line 14:** Canonical URL tag — tells search engines the "official" URL for this page, preventing duplicate content issues.

```html
  <title>CineVerse — Movies, Books, Manga &amp; Comics</title>
```

**Line 15:** The browser tab title. Also used as the default title when sharing links. The `&amp;` is HTML encoding for `&` (ampersand).

```html
</head>
<body>
```

**Lines 16-17:** Closes `<head>`, opens `<body>`.

```html
  <div id="root"></div>
```

**Line 18:** The single `<div>` where React will mount the entire application. The `id="root"` is the target that `createRoot()` looks for in `main.jsx`. Before React loads, this div is empty — the user sees a blank page. After React loads, this div fills with the full application UI.

```html
  <script type="module" src="/src/main.jsx"></script>
```

**Line 19:** Loads the JavaScript entry point. `type="module"` tells the browser this is an ES Module (supports `import`/`export`). Vite processes this file and all its imports during build/dev.

```html
</body>
</html>
```

**Lines 20-21:** Closes the document.

### Block Summary

`index.html` is the minimal HTML shell. It:
1. Sets up meta tags for SEO and social sharing
2. Links the favicon, PWA manifest, and canonical URL
3. Provides the `<div id="root">` mount point
4. Loads `main.jsx` as the JavaScript entry point

Everything else — all HTML, all UI — is generated dynamically by React. No server-side rendering; this is a pure SPA.

---

## File: `src/main.jsx`

**Purpose:** The JavaScript/React entry point. This file mounts the React application, configures all providers, and registers the service worker.

**Location:** `src/main.jsx`

```jsx
import { StrictMode } from 'react'
```

**Line 1:** Imports `StrictMode` from React. `StrictMode` is a development-only wrapper that activates additional checks and warnings:
- Detects unsafe lifecycle methods
- Warns about legacy string ref API usage
- Detects unexpected side effects (by double-invoking functions)
- It does NOT render any visible UI — it's invisible.

```jsx
import { createRoot } from 'react-dom/client'
```

**Line 2:** Imports `createRoot` from React DOM. In React 18+, `createRoot` replaced `ReactDOM.render()`. It creates a React root that can be rendered into, enabling concurrent features.

```jsx
import { BrowserRouter } from 'react-router-dom'
```

**Line 3:** Imports `BrowserRouter` from React Router. `BrowserRouter` uses the HTML5 History API (`pushState`, `popState`) to keep the UI in sync with the URL. It's the standard router for SPAs because it produces clean URLs (no `#` in the path).

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
```

**Line 4:** Imports React Query's core. `QueryClient` manages query caching, deduplication, and background refetching. `QueryClientProvider` makes the client available to all components via React context.

```jsx
import { Toaster } from 'react-hot-toast'
```

**Line 5:** Imports the toast notification component. `react-hot-toast` renders non-blocking popup notifications (success, error, info) that auto-dismiss.

```jsx
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
```

**Lines 6-8:** Imports the three context providers. The `@/` alias maps to `./src/` (configured in `vite.config.js` and `jsconfig.json`). Each provider wraps the app with its state:
- `AuthProvider` — user authentication state (login, logout, role)
- `CartProvider` — shopping cart items (persisted to localStorage)
- `WishlistProvider` — wishlist items (persisted to localStorage)

```jsx
import ErrorBoundary from '@/components/ErrorBoundary'
```

**Line 9:** Imports the error boundary component. Error boundaries are React class components that catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of crashing the whole app.

```jsx
import App from './App.jsx'
```

**Line 10:** Imports the root App component. `App.jsx` simply renders `<AppRoutes />` — it's a thin shell that delegates to the routing layer. Note the explicit `.jsx` extension — this is required by Vite's import resolution.

```jsx
import './index.css'
```

**Line 11:** Imports the global CSS file. Vite processes this and includes it in the bundle. This file contains Tailwind imports, design tokens, custom animations, and dark theme variables.

```jsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

**Lines 13-17:** Service worker registration. This block:
- **Line 13:** Checks if the browser supports service workers (`'serviceWorker' in navigator`). Most modern browsers do; this guard prevents errors in older browsers.
- **Line 14:** Waits for the `load` event (when the page is fully loaded) before registering. This ensures the service worker doesn't compete with the initial page load for bandwidth.
- **Line 15:** Calls `navigator.serviceWorker.register('/sw.js')` to register the service worker. The service worker (`public/sw.js`) intercepts network requests and serves cached responses for offline support.

**Why this matters:** Without this registration, the service worker file exists but never runs. With it, returning visitors get cached pages even when offline.

```jsx
const queryClient = new QueryClient()
```

**Line 19:** Creates a new `QueryClient` instance. This client manages:
- **Query cache** — stores fetched data so components don't re-fetch on every render
- **Default options** — retries, stale times, garbage collection
- **Devtools** — in development, the React Query Devtools can inspect cache state

No options are passed here, so defaults apply:
- `staleTime: 0` (data is immediately stale)
- `retry: 3` (retry failed queries 3 times)
- `refetchOnWindowFocus: true`

Individual hooks set their own `staleTime` (e.g., `useTrendingMovies` uses 5 minutes).

```jsx
createRoot(document.getElementById('root')).render(
```

**Line 21:** The mount point. `createRoot()` takes the DOM element (`<div id="root">` from `index.html`) and creates a React root. This is the bridge between React's virtual DOM and the browser's real DOM. `.render()` kicks off the entire React application.

```jsx
  <StrictMode>
```

**Line 22:** Wraps the entire app in `StrictMode`. In development, this double-invokes certain functions to detect side effects. In production, it's a no-op.

```jsx
    <ErrorBoundary>
```

**Line 23:** The top-level error boundary. If any component throws an uncaught error during rendering, this boundary catches it and shows a "Something went wrong" fallback UI with a reload button. Without this, the entire app would show a blank white screen on error.

```jsx
      <QueryClientProvider client={queryClient}>
```

**Line 24:** Makes React Query available to all components. The `client` prop passes the `queryClient` instance created on line 19. Any component using `useQuery()` or `useMutation()` must be inside this provider.

```jsx
        <BrowserRouter>
```

**Line 25:** Enables client-side routing. All `<Routes>`, `<Link>`, `<Route>`, and routing hooks like `useParams()` must be inside a router component. `BrowserRouter` uses clean URLs (e.g., `/movies/123`).

```jsx
          <AuthProvider>
```

**Line 26:** Provides authentication context. Components can use `useAuth()` to access:
- `user` — the current Supabase user object
- `profile` — the user's profile from the `profiles` table (name, role, avatar)
- `role` — user role (customer, staff, manager, admin)
- `isAuthenticated` — boolean flag
- `login()`, `register()`, `logout()` — auth functions

```jsx
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
```

**Lines 27-30:** Cart and Wishlist providers. Both use localStorage for persistence. The App component (which renders routes) is inside all providers, so every page can access cart, wishlist, and auth state.

```jsx
            <Toaster position="top-center" reverseOrder={false} toastOptions={{
              style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            }} />
```

**Lines 32-34:** The toast notification renderer. Rendered outside Cart/Wishlist but inside Auth (so it can be styled consistently). Configuration:
- `position="top-center"` — toasts appear centered at the top of the screen
- `reverseOrder={false}` — new toasts appear below existing ones
- `toastOptions.style` — dark theme styling: slate-800 background, slate-100 text, slate-700 border

```jsx
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
```

**Lines 35-40:** Closes all the opening tags from above. The comma after `</StrictMode>` is the second argument to `render()` — but `render()` only takes one argument (the JSX tree). The comma is just JavaScript syntax for separating expressions; the closing `)` on line 40 completes the `render()` call.

### Provider Tree Visualization

```
createRoot(root)
└── render(
    └── <StrictMode>
        └── <ErrorBoundary>
            └── <QueryClientProvider>
                └── <BrowserRouter>
                    └── <AuthProvider>
                        ├── <CartProvider>
                        │   └── <WishlistProvider>
                        │       └── <App />
                        └── <Toaster />
```

### Block Summary

`main.jsx` does exactly four things:
1. **Configures services** — creates React Query client, registers service worker
2. **Wraps in providers** — error handling, routing, state management, auth
3. **Renders the app** — mounts the React tree into `#root`
4. **Sets up notifications** — toast system for user feedback

---

## File: `src/App.jsx`

**Purpose:** The top-level application component. The simplest component in the entire codebase.

**Location:** `src/App.jsx`

```jsx
import AppRoutes from "./routes/AppRoutes";
```

**Line 1:** Imports the routing component. `AppRoutes` contains all route definitions (Home, Movies, Cart, Dashboard, etc.) with lazy loading and Suspense.

```jsx
function App() {
  return <AppRoutes />;
}
```

**Lines 3-5:** The entire App component. It's a function component that returns exactly one thing: the `<AppRoutes />` component. That's it. No hooks, no state, no lifecycle — pure delegation.

```jsx
export default App;
```

**Line 7:** Exports `App` as the default export. This matches the import in `main.jsx` (`import App from './App.jsx'`).

### Why is App.jsx so thin?

Because all providers are in `main.jsx`, and all routing logic is in `AppRoutes.jsx`. `App.jsx` is deliberately minimal — it's a single point of delegation. If you need to add a layout wrapper or global logic, you'd add it here or in `main.jsx`.

### Flow Summary: index.html → main.jsx → App.jsx

```
1. Browser loads index.html
2. Browser sees <script src="/src/main.jsx">
3. Vite serves main.jsx (transformed, with all imports resolved)
4. React creates a root on <div id="root">
5. render() mounts the provider tree:
   - StrictMode (dev checks)
   - ErrorBoundary (crash protection)
   - QueryClientProvider (data fetching)
   - BrowserRouter (URL routing)
   - AuthProvider (user state)
   - CartProvider + WishlistProvider (cart/wishlist)
   - App (which renders AppRoutes)
6. AppRoutes matches the current URL and renders the correct page
7. User sees the UI
```

The key insight: **the provider chain is the backbone of the application.** Every component that renders has access to auth, cart, wishlist, routing, data fetching, and error handling through this chain. The nesting order matters — inner providers can consume from outer providers (e.g., CartProvider could theoretically access AuthContext).
