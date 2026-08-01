# 07 — Hooks

Custom hooks encapsulate data fetching and side-effect logic. All hooks use `@tanstack/react-query` for server state management.

---

## `usePaystack.js`

**Purpose:** Paystack payment integration hook. Dynamically loads the Paystack inline script and initializes payment.

**Module-level variable:**
```js
let paystackScriptLoaded = false
```
This flag prevents multiple script injections. It's module-scoped (not inside a hook), so it persists across component re-renders and even across different components using the hook.

**`usePaystack()` hook:**

Returns `{ initializePayment }` — a single function.

**`initializePayment({ email, amount, onSuccess, onClose })`:**

Three code paths for script loading:

1. **Already loaded** `(window.PaystackPop exists)` → call `openPaystack()` immediately
2. **Not started loading** `(!paystackScriptLoaded)` → create `<script>` element, append to body, set `onload` to call `openPaystack()`, set flag to true
3. **Loading in progress** (script added but not yet loaded) → poll with `setInterval` every 200ms until `window.PaystackPop` is available, then call `openPaystack()` and clear interval

**Why this complexity?** Multiple components could call `initializePayment` rapidly. Without the flag + interval approach, the script could be injected multiple times, or a second call could start before the first script finishes loading.

**`openPaystack({ email, amount, onSuccess, onClose })`:**

Creates a Paystack inline handler:
```js
const handler = PaystackPop.setup({
  key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,  // Public key from env
  email,                                            // Customer email
  amount: Math.round(amount * 100),                // Convert to kobo (smallest NGN unit)
  currency: 'NGN',                                  // Nigerian Naira
  ref: 'cineverse_' + Date.now(),                   // Unique reference
  callback: (response) => onSuccess(response.reference),  // Called on successful payment
  onClose: () => onClose(),                         // Called when user closes popup
})
handler.openIframe()  // Opens Paystack checkout in an iframe
```

**Amount conversion:** Paystack expects amounts in kobo (1 NGN = 100 kobo). `Math.round(amount * 100)` converts the app's NGN price to kobo.

**Reference format:** `'cineverse_' + Date.now()` — a unique string combining the app name and a timestamp. This avoids duplicate payment references.

**Env var:** `VITE_PAYSTACK_PUBLIC_KEY` is loaded at build time (Vite prefix requirement). It's a test key in development, live key in production.

---

## `useSearch.js`

**Purpose:** Movie search hook. Calls TMDB search API.

**`useMovieSearch(query, page)`:**
```js
useQuery({
  queryKey: ['movieSearch', query, page],
  queryFn: () => searchMovies(query, page),
  enabled: !!query && query.length > 2,   // Don't search until query has 3+ chars
  staleTime: 2 * 60 * 1000,               // Cache for 2 minutes
})
```

**`searchMovies(query, page)`:**

Fetches from `TMDB_BASE_URL/search/movie` with the query and page number. Maps results to include:
- `poster_url` — constructed from TMDB image base URL + poster path
- `category: 'movie'` — added for cart/wishlist distinction
- `price` — generated from the movie ID: `(parseInt(movie.id.slice(-8), 36) % 2000) + 2000`. This is a deterministic price based on the movie's ID (always the same price for the same movie).

**Guard clause:** `if (!query || query.length < 2) return { results: [], totalPages: 0 }` prevents API calls for empty or single-character queries.

---

## `useBooks.js`

**Purpose:** Book data fetching from Google Books API.

**`useBooks(category = 'fiction')`:**
- Query key: `['books', category]`
- Fetches books by category via `getBooksByCategory(category)`
- `staleTime: 5 min`

**`useBookDetails(id)`:**
- Query key: `['book', id]`
- Fetches single book via `getBookById(id)`
- `enabled: !!id` — only runs when id is truthy
- `staleTime: 5 min`

**`useBookSearch(query)`:**
- Query key: `['bookSearch', query]`
- Fetches via `searchBooks(query)`
- `enabled: !!query && query.length > 2` — minimum 3 characters
- `staleTime: 2 min`

---

## `useManga.js`

**Purpose:** Manga data fetching from AniList GraphQL API (keyless, 90 req/min).

**`useManga(page = 1)`:**
- Query key: `['manga', page]`
- Fetches top manga via `getTopManga(page)`
- `staleTime: 5 min`

**`useMangaDetails(id)`:**
- Query key: `['manga', id]`
- Fetches single manga via `getMangaById(id)`
- `enabled: !!id`

**`useMangaSearch(query)`:**
- Query key: `['mangaSearch', query]`
- Fetches via `searchManga(query)`
- `enabled: query.length > 2`

---

## `useComics.js`

**Purpose:** Comic data fetching from Open Library API.

**`useComics(subject = 'comics')`:**
- Query key: `['comics', subject]`
- Fetches comics by subject via `getComicsBySubject(subject)`
- `staleTime: 5 min`

**`useComicSearch(query)`:**
- Query key: `['comicSearch', query]`
- Fetches via `searchComics(query)`
- `enabled: !!query && query.length > 2`

---

## `useTrendingMovies.js`

**Purpose:** Fetches trending movies from TMDB.

```js
export function useTrendingMovies() {
  return useQuery({
    queryKey: ["trending-movies"],
    queryFn: async () => {
      const response = await tmdb.get("/trending/movie/week")
      return response.data.results
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

- Uses the Axios instance from `@/services/tmdb` (which has base URL and auth header pre-configured)
- Endpoint: `/trending/movie/week` — TMDB's weekly trending movies
- `staleTime: 5 min` — reduces API calls. Trending movies don't change minute-to-minute.

---

## `useDashboardStats.js`

**Purpose:** Fetches dashboard statistics for the admin panel. Contains 4 separate queries.

### `useDashboardStats()`

Fetches general dashboard stats:
```js
queryFn: async () => {
  const { count: userCount } = await supabase
    .from('profiles').select('*', { count: 'exact', head: true })
  const { data: orders } = await supabase
    .from('orders').select('total_amount, status, created_at')
  const ordersList = orders || []
  const totalRevenue = ordersList.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const pendingCount = ordersList.filter(o => o.status === 'pending').length
  return { users: userCount, orders: ordersList.length, revenue: totalRevenue, pending: pendingCount }
}
```

- **User count:** Uses `{ count: 'exact', head: true }` — this only returns the count, not the actual rows (more efficient).
- **Orders:** Fetches all orders, computes total revenue and pending count on the client side. This works for moderate data volumes but should use PostgreSQL aggregation for large datasets.
- **Return value:** `{ users, orders, revenue, pending }`

### `useRevenueData()`

Returns daily revenue for the last 30 days. Builds a `dailyMap` object with all 30 days initialized to 0, then fills in actual order amounts. Returns `{ labels: [...], values: [...] }` for chart rendering.

Date initialization loop:
```js
for (let i = 0; i < 30; i++) {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  dailyMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0
}
```
This creates entries like `{ "Jan 1": 0, "Jan 2": 0, ... }` for 30 consecutive days. The formula `29 - i` ensures the first iteration is 30 days ago and the last iteration is today.

### `useOrderVolume()`

Same pattern as `useRevenueData` but counts orders per day instead of summing amounts. Returns `{ labels, values }` where values are order counts.

### `useCategoryBreakdown()`

Aggregates revenue by product category across all orders. Iterates through each order's `items` array and sums `price * quantity` per category. Returns an array of `{ name, value }` objects for pie/donut chart rendering.

**All four hooks share:** `staleTime: 60 * 1000` (1 minute) — dashboard data is more frequently updated than catalog data.

---

## Hook Comparison Table

| Hook | API Source | Data | Query Key | staleTime | Pagination |
|------|------------|------|-----------|-----------|------------|
| `useTrendingMovies` | TMDB | Trending movie list | `['trending-movies']` | 5 min | No |
| `useMovieSearch` | TMDB | Search results | `['movieSearch', query, page]` | 2 min | Yes (page) |
| `useBooks` | Google Books | By category | `['books', category]` | 5 min | No |
| `useBookDetails` | Google Books | Single book | `['book', id]` | 5 min | No |
| `useManga` | AniList | Top manga | `['manga', page]` | 5 min | Yes (page) |
| `useMangaDetails` | AniList | Single manga | `['manga', id]` | 5 min | No |
| `useComics` | Open Library | By subject | `['comics', subject]` | 5 min | No |
| `useDashboardStats` | Supabase | Admin stats | `['dashboardStats']` | 1 min | No |
| `useRevenueData` | Supabase | 30-day revenue | `['revenueData']` | 1 min | No |
| `useOrderVolume` | Supabase | 30-day order count | `['orderVolume']` | 1 min | No |
| `useCategoryBreakdown` | Supabase | Revenue by category | `['categoryBreakdown']` | 1 min | No |
| `usePaystack` | Paystack SDK | Payment popup | N/A (not useQuery) | N/A | No |

---

## Data Loading Pattern

Every data-fetching hook follows this pattern:
```jsx
const { data, isLoading, error } = useMovieSearch(query)
```

Components then render according to state:

| State | UI |
|-------|-----|
| `isLoading && !data` | Skeleton/spinner (first load) |
| `isLoading && data` | Show data + subtle refresh indicator |
| `error` | Error message with retry option |
| `data` with results | Render the data |
| `data` with empty results | "No results" empty state |

This pattern is consistent across all hooks and pages, making the UI predictable.
