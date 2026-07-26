# 01 — Architecture Overview

## What is CineVerse?

CineVerse is a **single-page application (SPA)** e-commerce marketplace for entertainment media. Users can browse, search, and purchase Movies, Books, Manga, and Comics. It features:

- **Product catalog** populated from external APIs (TMDB, Google Books, Jikan, Open Library)
- **Shopping cart & wishlist** persisted to localStorage
- **Multi-step checkout** with Paystack payment integration (NGN currency)
- **Role-based dashboards**: Admin (full control), Manager (staff oversight), Staff (order management)
- **Authentication**: Supabase Auth (email/password + Google OAuth)
- **Reviews system**: Star ratings per product with user review forms

---

## Tech Stack

### Frontend


| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 19.2.7 | UI framework — component-based architecture with hooks |
| **Vite** | 8.1.1 | Build tool — fast HMR, tree-shaking, code splitting |
| **React Router** | 7.18.1 | Client-side routing — lazy-loaded pages, protected routes |
| **Tailwind CSS** | 4.3.2 | Utility-first CSS — all styling via class names |
| **Framer Motion** | 12.42.2 | Animation library — page transitions, scroll reveals, hover effects |
| **TanStack React Query** | 5.101.2 | Server state management — caching, refetching, loading states |
| **React Hook Form** | 7.80.0 | Form state management — performant, minimal re-renders |
| **Zod** | 4.4.3 | Schema validation — form validation, type checking at runtime |

### Backend & Data

| Service | Purpose |
|---------|---------|
| **Supabase** | PostgreSQL database + Auth + Row Level Security |
| **Paystack** | Nigerian payment gateway — inline popup checkout |
| **TMDB API** | Movie data — trending, details, credits, trailers, providers |
| **Google Books API** | Book data — search by subject |
| **Jikan API** | Manga data — top manga, details |
| **Open Library** | Comic data — subjects, search |

### Development

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing — Jest-compatible, Vite-integrated |
| **Testing Library** | React component testing — user-centric queries |
| **ESLint** | Static analysis — React hooks rules, code quality |
| **shadcn/ui** | UI primitive components — based on @base-ui/react |

---

## Architecture Diagram (Text)

```
┌────────────────────────────────────────────────────────┐
│                      index.html                         │
│  <div id="root"/> + <script src="/src/main.jsx"/>       │
└────────────────────────┬───────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────┐
│                      main.jsx                           │
│  Entry point — renders the full provider chain           │
│                                                          │
│  StrictMode                                              │
│  └─ ErrorBoundary                                        │
│     └─ QueryClientProvider (React Query)                 │
│        └─ BrowserRouter (React Router)                   │
│           └─ AuthProvider                                │
│              └─ CartProvider                             │
│                 └─ WishlistProvider                      │
│                    └─ App (routes)                       │
│              └─ Toaster (toast notifications)            │
│                                                          │
│  Also: Service Worker registration                       │
└────────────────────────┬───────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────┐
│                   App.jsx                                │
│  Just renders <AppRoutes />                              │
└────────────────────────┬───────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────┐
│              routes/AppRoutes.jsx                        │
│  All route definitions — lazy-loaded pages               │
│  Wraps each route in:                                    │
│  - Suspense (loading spinner)                            │
│  - ErrorBoundary (per-page error catching)               │
│  - ProtectedRoute (auth gating + role gating)            │
└────────────────────────────────────────────────────────┘
```

---

## Provider Chain — Detailed

Every React context provider wraps the app in a specific order. The order matters because some providers depend on others:

```
StrictMode
  └─ ErrorBoundary                   Catches uncaught render errors
     └─ QueryClientProvider           Provides React Query to all components
        └─ BrowserRouter              Enables routing — <Routes>, <Link>, useNavigate
           └─ AuthProvider            Provides auth state — user, login, logout, role
              ├─ CartProvider         Provides cart state — items, add/remove, localStorage
              │  └─ WishlistProvider  Provides wishlist state — items, add/remove, localStorage
              │     └─ App            Renders the active route
              └─ Toaster              Toast notifications (positioned outside Cart/Wishlist but inside Auth)
```

### Why this order?

1. **ErrorBoundary outermost** — catches errors from any child, including providers
2. **QueryClientProvider** — needed by any component making API calls; doesn't depend on auth
3. **BrowserRouter** — needed by any component using routing hooks; doesn't depend on data
4. **AuthProvider** — provides user/auth state; Cart and Wishlist may depend on user identity
5. **CartProvider + WishlistProvider** — depend on Auth (for future multi-device sync)
6. **Toaster** — must be inside AuthProvider to access auth context for styled toasts

---

## Data Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────────┐
│ External  │───▶│  Services    │───▶│  React Query    │
│ APIs      │    │  (API calls) │    │  (cache/state)  │
└──────────┘    └──────────────┘    └────────┬────────┘
                                             │
┌──────────┐    ┌──────────────┐             │
│ Supabase │───▶│  supabase.js │             │
│ (DB+Auth)│    │  (client)    │             │
└──────────┘    └──────┬───────┘             │
                       │                     │
              ┌────────▼────────┐            │
              │  Auth Context   │            │
              │  (user, role)   │            │
              └────────┬────────┘            │
                       │                     │
              ┌────────▼────────┐   ┌────────▼────────┐
              │  Cart Context   │   │  Page Components │
              │  (localStorage) │   │  (useQuery)      │
              └────────┬────────┘   └────────┬────────┘
                       │                     │
              ┌────────▼────────┐   ┌────────▼────────┐
              │  Wishlist Ctx   │   │  UI Components  │
              │  (localStorage) │   │  (render data)  │
              └─────────────────┘   └─────────────────┘
```

### External API flow

```
User visits /movies
  → AppRoutes lazy-loads Movies.jsx
  → Movies component calls useTrendingMovies()
  → useTrendingMovies hook calls movieService.js
  → movieService.js calls TMDB API via Axios
  → React Query caches the result (staleTime: 5 min)
  → UI renders movie cards
```

### Auth flow

```
User submits login form
  → Login page calls loginUser() from services/auth.js
  → auth.js calls supabase.auth.signInWithPassword()
  → On success, AuthContext updates state
  → Protected routes re-render (now authenticated)
  → User sees dashboard/profile
```

### Payment flow

```
User completes checkout step 3 (payment)
  → Checkout calls usePaystack.initializePayment()
  → usePaystack injects Paystack script (if not loaded)
  → Paystack popup opens
  → User completes payment
  → onSuccess callback creates order via services/orders.js
  → Order stored in Supabase
  → Cart cleared
  → Confirmation screen shown
```

---

## Build Toolchain

```
npm run dev
  → Starts Vite dev server
  → HMR enabled (hot module replacement)
  → Tailwind JIT compiler watches for class changes

npm run build
  → Vite bundles all JSX/JS into optimized chunks
  → Code splitting via React.lazy() — each page is a separate chunk
  → CSS extracted and minified
  → Assets hashed for cache busting
  → Output in /dist

npm run test
  → Vitest runs all .test.jsx files
  → jsdom environment simulates browser
  → 42 tests across 6 files

npm run lint
  → ESLint checks all .js/.jsx files
  → React hooks rules + react-refresh rules
```

## File & Directory Conventions

| Pattern | Convention |
|---------|-----------|
| File names | PascalCase for components (`MovieCard.jsx`), camelCase for utilities (`formatCurrency.js`) |
| Exports | Default export for page components, named exports for hooks/context |
| Imports | `@/` alias maps to `./src/` — configured in `vite.config.js` + `jsconfig.json` |
| Styling | Tailwind utility classes — no CSS modules, no styled-components |
| State | React Context for global state, React Query for server state, local useState for UI state |
| Tests | Colocated in `src/test/` with `.test.jsx` extension |
