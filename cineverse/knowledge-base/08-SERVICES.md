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

**Purpose:** AniList GraphQL API integration (free, no API key required). POSTs GraphQL queries to `https://graphql.anilist.co` with `Content-Type: application/json`.

```js
const ANILIST_URL = 'https://graphql.anilist.co'
// axios.post(ANILIST_URL, { query, variables }, { headers })
```

Throws on `data.errors` (GraphQL returns HTTP 200 + `errors` array) so React Query error states work.

| Function | GraphQL | Returns |
|----------|---------|---------|
| `getTopManga(page=1, limit=20)` | `Page.media(type: MANGA, sort: [POPULARITY_DESC], isAdult: false)` | Normalized manga array |
| `getMangaById(id)` | `Media(id, type: MANGA)` + popularity-rank count | Single normalized manga (with `rank`) |
| `searchManga(query, page=1)` | `Page.media(type: MANGA, search, sort: [SEARCH_MATCH], isAdult: false)` | Normalized manga array |

**`normalizeManga(item)`:** Transforms AniList response:

| App Field | AniList Source |
|-----------|---------------|
| `id` / `malId` | `id` (AniList media ID; used in routes `/manga/{id}` and cart slug `manga:{id}`) |
| `title` | `title.romaji` or `title.english` |
| `titleJapanese` | `title.native` |
| `authors` | `staff.edges` filtered to roles matching `/story\|art/i` → `node.name.full` |
| `description` | `description` with HTML tags and `~!…!~` spoilers stripped |
| `image` | `coverImage.extraLarge` or `large` |
| `score` | `averageScore / 10` (AniList is 0–100, app UI expects 0–10) |
| `scoredBy` | `favourites` (AniList has no vote count) |
| `rank` | Computed (see below), `null` if beyond top 200 → UI shows `#200+` |
| `popularity` | `popularity` |
| `genres`, `chapters`, `volumes` | Direct |
| `status` | Mapped: `RELEASING → 'publishing'` (drives green styling), others lowercase |
| `published` | `startDate` formatted "Mon DD, YYYY" |
| `type` | `format` mapped: `MANGA/MANHWA/MANHUA/NOVEL/ONE_SHOT` → title case |
| `price` | Derived from `id`: `(id % 2000) + 1000` |
| `category` | Always `'manga'` |

**Popularity rank algorithm** (AniList has no rank field, and `pageInfo.total` ignores filters / caps at 5000):
`getMangaById` counts manga with `popularity_greater` than the title's, 50 per page sorted `[POPULARITY]` (ascending). Page 1 is fetched first; if it fills up, pages 2–4 run in parallel (`Promise.all`). The first under-full page gives `rank = 50·(page−1) + length + 1`. If all 4 pages fill → `rank = null` → UI renders `#200+`. Verified live: Chainsaw Man #1, Jujutsu Kaisen #3, Berserk #4, One Piece #5.

**Rate limits:** 90 requests/minute (no auth needed for public reads).

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

## `src/services/cart.js`

**Purpose:** Server-side cart sync (logged-in users).

| Function | Supabase Action | Description |
|----------|-----------------|-------------|
| `getCartItems(userId)` | `select('*').eq('user_id', userId)` | Cart rows for a user |
| `addCartItem(userId, productSlug, quantity)` | `insert({ user_id, product_slug, quantity })` | New cart row |
| `updateCartItemQuantity(userId, productSlug, quantity)` | `update({ quantity }).eq('user_id', userId).eq('product_slug', productSlug)` | Quantity change |
| `removeCartItem(userId, productSlug)` | `delete().eq('user_id', userId).eq('product_slug', productSlug)` | Remove row |
| `clearCartItems(userId)` | `delete().eq('user_id', userId)` | Clear all rows |

All operations key on `user_id + product_slug` (the client never knows DB row ids). `product_slug` format: `category:externalId` (e.g. `movie:550`, `manga:105778`).

## `src/services/wishlist.js`

**Purpose:** Server-side wishlist sync (logged-in users). Same shape as `cart.js`:

| Function | Description |
|----------|-------------|
| `getWishlistItems(userId)` | Fetch user's wishlist rows |
| `addWishlistItem(userId, productSlug)` | Insert row |
| `removeWishlistItem(userId, productSlug)` | Delete by `user_id + product_slug` |
| `clearWishlistItems(userId)` | Delete all user rows |

## `src/services/seller.js`

**Purpose:** Seller marketplace — product listing, uploads, earnings, payouts.

| Function | Description |
|----------|-------------|
| `createProduct(data)` | Insert product row (trigger forces `status: 'pending'` for non-admins) |
| `getSellerProducts(sellerId)` | Products owned by the seller |
| `updateProduct(id, updates)` | Edit product (admin can set `status` to approve) |
| `deleteProduct(id)` | Remove product + storage files |
| `getPublicImageUrl(path)` | Public URL for `product-images` bucket |
| `getSignedVideoUrl(path)` | 1-hour signed URL for `product-files` bucket (buyers/downloads) |
| `getSellerEarnings(sellerId)` | Earnings rows (`available`/`pending_transfer`/`paid`) |
| `requestPayout(sellerId, amount, bankDetails)` | Insert `seller_payouts` row (min ₦100) |
| `getSellerPayouts(sellerId)` | Payout history |
| `resolveBank(code)` | Paystack `/bank/resolve` for bank account lookup |
| `getAllPayouts()` / `adminTransferPayout(id)` / `adminCancelPayout(id)` | Admin payout management |

## `src/services/ai.js`

**Purpose:** Client wrapper for the `ai-proxy` Supabase Edge Function (`{SUPABASE_URL}/functions/v1/ai-proxy`).

| Function | Action | Description |
|----------|--------|-------------|
| `aiChat(messages)` | `chat` | Store assistant chat (Gemini, <120 words) |
| `aiRecommend(interests)` | `recommend` | 5 product recommendations as JSON |
| `aiSummarize(item)` | `summarize` | 3–4 sentence product blurb |
| `aiSearch(query)` | `search` | Parse natural language into `{ category, keywords }` |
| `aiGenerate(product)` | `generate` | Copywriting for product descriptions |

---

## Data Flow Diagram

```
📄 Page Component
    ↓ (calls hook)
📄 Custom Hook (useBooks, useTrendingMovies, etc.)
    ↓ (calls service function)
📄 Service File (books.js, tmdb.js, manga.js, etc.)
    ↓ (makes HTTP request)
🌐 External API (Google Books, TMDB, AniList GraphQL, Open Library)
    ↓ (returns raw data)
📄 Service File (normalizes data, derives prices)
    ↓ (returns clean data)
📄 Custom Hook (wraps in React Query useQuery)
    ↓ (provides data, isLoading, error)
📄 Page Component (renders UI)
```
