# 09 — Utilities

---

## `src/lib/utils.js`

**Purpose:** Shared utility function for className merging. Used by all shadcn/ui components.

```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**How it works:**
- `clsx` — conditionally joins class names. Accepts strings, objects (keys are classes, values are conditions), and arrays. Example: `clsx('px-4', { 'bg-red-500': isError }, ['text-sm'])`.
- `twMerge` — intelligently merges Tailwind classes, resolving conflicts. If two classes affect the same CSS property, the later one wins. Example: `twMerge('px-4', 'px-6')` returns `'px-6'`.
- Together, `cn()` provides a clean API: `cn('base-class', condition && 'conditional-class', 'override-class')`.

**Usage pattern** (from UI components):
```jsx
<button className={cn(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium",
  variant === "destructive" && "bg-red-500 text-white",
  size === "sm" && "h-8 px-3",
  className  // allow caller overrides
)} />
```

---

## `src/utils/formatCurrency.js`

**Purpose:** Formats numeric amounts as Nigerian Naira (NGN) currency strings.

```js
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
```

**Behavior:**
- Uses `Intl.NumberFormat` with locale `en-NG` (English, Nigeria)
- `currency: 'NGN'` sets the currency symbol to `₦`
- `minimumFractionDigits: 0` + `maximumFractionDigits: 0` — no decimal places (prices are whole Naira)

**Examples:**
| Input | Output |
|-------|--------|
| `1500` | `₦1,500` |
| `2999` | `₦2,999` |
| `0` | `₦0` |

---

## `src/utils/formatDate.js`

**Purpose:** Date formatting helpers.

```js
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
```

**`formatDate`:** Returns like "Jan 15, 2024"
**`formatDateTime`:** Returns like "Jan 15, 2024, 02:30 PM"

Both handle null/undefined gracefully, returning `'N/A'`.

---

## `src/utils/helpers.js`

**Purpose:** General-purpose helper utilities.

```js
export function sanitizeUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  if (url.startsWith('/')) return url
  return ''
}
```

**`sanitizeUrl`:** Validates URL safety. Only allows:
- `http://` and `https://` URLs (absolute)
- `//` protocol-relative URLs
- `/` relative paths
- Returns empty string for `javascript:`, `data:`, or other potentially dangerous schemes

```js
export function sanitizeText(text) {
  if (!text) return ''
  return String(text).replace(/<[^>]*>/g, '').trim()
}
```

**`sanitizeText`:** Strips HTML tags from user-supplied text. Uses regex `<[^>]*>` to remove anything between angle brackets. This prevents XSS (Cross-Site Scripting) attacks — if user input containing `<script>alert('xss')</script>` is rendered, the tags are stripped.

---

## Constants

### `src/constants/routes.js`

**Purpose:** Single source of truth for all route paths.

```js
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  MOVIE_DETAILS: '/movies/:id',
  BOOKS: '/books',
  BOOK_DETAILS: '/books/:id',
  MANGA: '/manga',
  MANGA_DETAILS: '/manga/:id',
  COMICS: '/comics',
  COMIC_DETAILS: '/comics/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  WISHLIST: '/wishlist',
  SEARCH: '/search',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DASHBOARD_ADMIN: '/dashboard/admin',
  DASHBOARD_ADMIN_PRODUCTS: '/dashboard/admin/products',
  DASHBOARD_ADMIN_ORDERS: '/dashboard/admin/orders',
  DASHBOARD_ADMIN_USERS: '/dashboard/admin/users',
  DASHBOARD_MANAGER: '/dashboard/manager',
  DASHBOARD_MANAGER_STAFF: '/dashboard/manager/staff',
  DASHBOARD_STAFF: '/dashboard/staff',
  DASHBOARD_STAFF_ORDERS: '/dashboard/staff/orders',
}
```

See [03-ROUTING.md](./03-ROUTING.md) for detailed route structure.

### `src/constants/tmdb.js`

**Purpose:** TMDB related constants used across the app.

```js
export const API_BASE_URL = "https://api.themoviedb.org/3"
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original"
```

**Usage:**
- `API_BASE_URL` — used by `useSearch.js` for search queries (direct Axios calls)
- `IMAGE_BASE_URL` — poster images at 500px width
- `BACKDROP_BASE_URL` — full-resolution backdrop images (for hero banners)

Note: `src/services/tmdb.js` duplicates `API_BASE_URL` in the Axios instance config. The constant is used by files that don't use the Axios instance (like `useSearch.js`).

---

## Data Files

### `src/data/categoryData.js`

**Purpose:** Defines the four product categories for the home page category grid.

```js
const categoryData = [
  { id: "movies", title: "Movies", icon: FaFilm, count: "15K+", color: "from-red-500 to-orange-500" },
  { id: "books", title: "Books", icon: FaBook, count: "5K+", color: "from-blue-500 to-cyan-500" },
  { id: "manga", title: "Manga", icon: FaDragon, count: "3K+", color: "from-pink-500 to-purple-500" },
  { id: "comics", title: "Comics", icon: FaMasksTheater, count: "1K+", color: "from-green-500 to-emerald-500" },
]
```

Each entry has:
- `id` — URL-friendly slug
- `title` — display name
- `icon` — React icon component from `react-icons/fa6`
- `count` — displayed as "X+" inventory count
- `color` — Tailwind gradient class for card styling

Imported by `Categories.jsx` which maps over it to render `CategoryCard` components.

### `src/data/heroData.js`

**Purpose:** Content data for the Hero section.

```js
const heroData = {
  badge: "YOUR ULTIMATE ENTERTAINMENT MARKETPLACE",
  title: { first: "Discover Your", second: "Next Adventure" },
  description: "Buy, sell and discover thousands of Movies, Manga, Books and Comics from one beautiful marketplace.",
  buttons: { primary: "Explore Collection", secondary: "Become a Seller" },
  stats: [
    { number: "15K+", label: "Movies" },
    { number: "5K+", label: "Books" },
    { number: "3K+", label: "Manga" },
    { number: "1K+", label: "Comics" },
  ],
}
```

**Structure:**
- `badge` — small label above title
- `title` — split into two parts for gradient styling in HeroContent
- `description` — paragraph text
- `buttons` — CTA button labels
- `stats` — statistics array for HeroStats component

Separating content from markup means the hero text can be changed without touching component structure.
