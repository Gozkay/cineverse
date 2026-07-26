# 08 — Services

The service layer sits between hooks/pages and external APIs. Each service file wraps an API with functions that return normalized data.

---

## `src/lib/supabase.js`

**Purpose:** Creates and exports the Supabase client instance used by all other services.

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
```

**Key details:**
- Uses Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — these must be prefixed with `VITE_` to be exposed to client code
- Graceful fallback: if env vars are missing, uses placeholder values and logs a warning. This prevents crashes during development if `.env` isn't set up
- Exports a single `supabase` client used by `auth.js`, `orders.js`, and dashboard hooks

---

## `src/services/tmdb.js`

**Purpose:** Axios instance for TMDB API v3.

```js
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    "Content-Type": "application/json",
  },
})
```

**Key details:**
- Pre-configured base URL and auth header
- Uses an API read access token (not API key) via Bearer auth
- Token comes from `VITE_TMDB_TOKEN` env var
- All TMDB requests go through this instance, including: trending, search, details, credits, videos, images, reviews, watch providers

---

## `src/services/movieService.js`

**Purpose:** Movie-specific TMDB functions. Each function wraps a specific TMDB endpoint.

| Function | Endpoint | Returns |
|----------|----------|---------|
| `getTrendingMovies()` | `/trending/movie/week` | Array of movie objects |
| `getMovieDetails(id)` | `/movie/{id}` | Single movie object |
| `getMovieCredits(id)` | `/movie/{id}/credits` | Cast array |
| `getSimilarMovies(id)` | `/movie/{id}/similar` | Similar movie array |
| `getMovieVideos(id)` | `/movie/{id}/videos` | Video array (trailers) |
| `getMovieImages(id)` | `/movie/{id}/images` | `{ backdrops, posters }` |
| `getMovieReviews(id)` | `/movie/{id}/reviews` | Review array |
| `getWatchProviders(id)` | `/movie/{id}/watch/providers` | Provider data |

**Pattern:** Each function uses `tmdb.get()` (the Axios instance from `tmdb.js`) and destructures `data` from the response. This means callers get clean data without Axios response wrappers.

---

## `src/services/books.js`

**Purpose:** Google Books API integration.

```js
const googleBooks = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
})
```

An Axios instance for the Google Books API. No auth key needed for the volumes endpoint (public API with rate limiting).

| Function | Endpoint | Returns |
|----------|----------|---------|
| `searchBooks(query, maxResults=20)` | `/volumes?q={query}` | Normalized book array |
| `getBookById(id)` | `/volumes/{id}` | Single normalized book |
| `getBooksByCategory(category, maxResults=20)` | Uses `searchBooks` with `subject:` prefix | Normalized book array |

**`normalizeBook(item)`:** Transforms Google Books API response into the app's book schema:

| App Field | Google Books Source |
|-----------|-------------------|
| `id` | `item.id` |
| `title` | `volumeInfo.title` |
| `authors` | `volumeInfo.authors` (default: `['Unknown Author']`) |
| `image` | `volumeInfo.imageLinks.thumbnail` (forced to HTTPS) |
| `categories` | `volumeInfo.categories` |
| `price` | Derived from ID: `(parseInt(id.slice(-8), 36) % 2500) + 1500` |
| `category` | Always `'book'` |

**HTTP→HTTPS conversion:** Google Books sometimes returns image URLs with `http:` protocol. The normalizer replaces `http:` with `https:` to avoid mixed content warnings.

**Price derivation:** Like TMDB movies, prices are deterministically generated from the book's ID. Formula: `(ID_hash % 2500) + 1500` → price range: ₦1,500–₦3,999.

---

## `src/services/manga.js`

**Purpose:** Jikan API v4 (MyAnimeList unofficial) integration.

```js
const jikan = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
})
```

| Function | Endpoint | Returns |
|----------|----------|---------|
| `getTopManga(page=1, limit=20)` | `/top/manga` | Normalized manga array |
| `getMangaById(id)` | `/manga/{id}/full` | Single normalized manga |
| `searchManga(query, page=1)` | `/manga?q={query}` | Normalized manga array |

**`normalizeManga(item)`:** Transforms Jikan API response:

| App Field | Jikan Source |
|-----------|-------------|
| `id` | `manga_{mal_id}` (prefixed to avoid ID collisions) |
| `malId` | `mal_id` (raw MyAnimeList ID) |
| `title` | `title` or `title_english` |
| `description` | `synopsis` |
| `image` | `images.jpg.large_image_url` or `image_url` |
| `score`, `rank`, `popularity` | Direct from API |
| `genres`, `themes` | Mapped arrays of name strings |
| `chapters`, `volumes`, `status`, `published` | Direct |
| `price` | Derived from `mal_id`: `(mal_id % 2000) + 1000` |
| `category` | Always `'manga'` |

---

## `src/services/comics.js`

**Purpose:** Open Library API integration.

```js
const openLibrary = axios.create({
  baseURL: 'https://openlibrary.org',
})
```

| Function | Endpoint | Returns |
|----------|----------|---------|
| `getComicsBySubject(subject='comics', limit=20)` | `/subjects/{subject}.json` | Normalized comic array |
| `searchComics(query, limit=20)` | `/search.json?q={query}+comics` | Normalized comic array |

**`normalizeComic(work, subject)`:** Transforms Open Library subject API response. Key fields:
- `id` — extracted from work key (removes `/works/` prefix)
- `image` — constructed from `cover_id`: `https://covers.openlibrary.org/b/id/{cover_id}-L.jpg`
- `subjects` — combines the requested subject with the work's subjects
- `price` — `(parseInt(id.slice(-8), 36) % 2300) + 1200` → ₦1,200–₦3,499
- `category` — Always `'comic'`

**`normalizeComicSearch(doc)`:** Same structure but maps from search API response fields (`doc.author_name`, `doc.cover_i`, `doc.first_sentence`).

---

## `src/services/auth.js`

**Purpose:** User authentication and profile management functions.

**Authentication functions:**

| Function | Description |
|----------|-------------|
| `loginUser(email, password)` | Supabase `signInWithPassword`. Returns `{ success, user }` or `{ success: false, error }` |
| `registerUser({ name, email, password })` | Creates auth user + profile row. Returns `{ success, user }` |
| `logoutUser()` | Calls `signOut()`. Returns `{ success }` or `{ success: false, error }` |
| `getSession()` | Returns current session from `supabase.auth.getSession()` |
| `onAuthChange(callback)` | Subscribes to auth state changes |

**`loginUser()`** differs from `AuthContext.loginUser()` in error handling. The service function catches Supabase errors and returns them as `{ success: false, error: message }`, while the context function throws errors.

**User management functions (admin):**

| Function | Description |
|----------|-------------|
| `getUsers()` | Fetches all profiles, ordered by created_at descending |
| `getUserById(id)` | Fetches single profile |
| `updateUser(id, updates)` | Updates profile fields |
| `banUser(id)` | Sets `banned: true` |
| `unbanUser(id)` | Sets `banned: false` |
| `suspendUser(id)` | Sets `suspended: true` |
| `unsuspendUser(id)` | Sets `suspended: false` |
| `removeStaff(id)` | Deletes profile (for removing staff accounts) |

**`getProfile()` helper** — private function that fetches a profile by user ID. Returns `{}` if not found (null-safe for new users without profiles).

---

## `src/services/orders.js`

**Purpose:** Order CRUD operations with Supabase.

| Function | Supabase Action | Description |
|----------|-----------------|-------------|
| `getOrders()` | `select('*').order('created_at', false)` | All orders, newest first |
| `getOrdersByUser(userId)` | `select('*').eq('user_id', userId).order(...)` | User's orders |
| `getOrderById(id)` | `select('*').eq('id', id).single()` | Single order |
| `createOrder(orderData)` | `insert({ ...orderData, status: 'pending' }).select().single()` | New order |
| `updateOrderStatus(id, status)` | `update({ status, updated_at })` | Status change |
| `deleteOrder(id)` | `delete().eq('id', id)` | Remove order |

**`createOrder()` flow:**
1. Called from Checkout page after payment success
2. Accepts `{ user_id, items, total_amount, shipping_info, payment_method, payment_ref }`
3. Inserts with `status: 'pending'` hardcoded
4. Returns the created order with its Supabase-generated `id`
5. On error, throws (caught by Checkout's try/catch → toast error)

---

## Data Flow Diagram

```
📄 Page Component
    ↓ (calls hook)
📄 Custom Hook (useBooks, useTrendingMovies, etc.)
    ↓ (calls service function)
📄 Service File (books.js, tmdb.js, etc.)
    ↓ (makes HTTP request)
🌐 External API (Google Books, TMDB, Jikan, Open Library)
    ↓ (returns raw data)
📄 Service File (normalizes data, derives prices)
    ↓ (returns clean data)
📄 Custom Hook (wraps in React Query useQuery)
    ↓ (provides data, isLoading, error)
📄 Page Component (renders UI)
```
