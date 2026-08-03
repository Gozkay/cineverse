# 06 — Pages

This section covers every page component. Each page is lazy-loaded (except Home which is the default route).

---

## `Home.jsx`

**Purpose:** The landing page. Composes three sections: Hero, Categories, and TrendingMovies.

**Structure:**
```jsx
<MainLayout>
  <Hero />
  <Categories />
  <TrendingMovies />
</MainLayout>
```

- `Hero` — full-screen animated hero with headline, CTA buttons, floating cards, and stats
- `Categories` — grid of category cards linking to Movies, Books, Manga, Comics
- `TrendingMovies` — horizontal row of trending movie cards fetched from TMDB

Note: `MainLayout` is used explicitly (not as a layout route) because `Home` is the root route and the layout route pattern may not apply when rendering directly.

---

## `Movies.jsx`

**Purpose:** Lists trending movies in a grid. Uses `useTrendingMovies()` hook. Shows loading skeletons while fetching. Each movie links to its detail page.

**Flow:**
1. `useTrendingMovies()` fetches data from TMDB
2. While loading: shows `MovieSkeleton` placeholders
3. Renders `MovieCard` components in a responsive grid

---

## `MovieDetails.jsx`

**Purpose:** Full movie detail page. Uses `useParams()` to get the movie ID, then fetches from TMDB.

**Sections:**
1. `MovieHero` — backdrop, poster, title, rating, genres, action buttons
2. `MovieInfo` — synopsis, director, release date
3. `MovieCast` — actor grid
4. `MovieTrailer` — embedded YouTube trailer
5. `MovieGallery` — screenshot lightbox
6. `WatchProviders` — where to watch
7. `MovieReviews` — user review form + list
8. `SimilarMovies` — recommendations row

**Add to Cart/Wishlist:** Uses `useCart()` and `useWishlist()` contexts. Passing product type `'movie'` for cart distinction.

---

## `Books.jsx`

**Purpose:** Lists books by category. Uses `useBooks(category)` with default category `'fiction'`. Usually has category filter tabs.

**Flow:**
1. User selects a category
2. `useBooks(category)` fetches from Google Books API
3. Renders `BookCard` components

---

## `BookDetails.jsx`

**Purpose:** Book detail page with cover, title, author, description, price, and action buttons.

**Sections:**
- Book cover with gradient overlay
- Title, author, publisher, ISBN
- Description/synopsis
- Add to Cart / Wishlist buttons
- Reviews section

---

## `Manga.jsx`

**Purpose:** Lists top manga. Uses `useManga(page)` for paginated fetching from Jikan API (MyAnimeList).

---

## `MangaDetails.jsx`

**Purpose:** Manga detail page with cover, title, author, chapters, synopsis, and action buttons. Fetches from Jikan API.

---

## `Comics.jsx`

**Purpose:** Lists comics by subject. Uses `useComics(subject)` from Open Library API.

---

## `ComicDetails.jsx`

**Purpose:** Comic detail page with cover, title, issue info, description, and action buttons.

---

## `Cart.jsx`

**Purpose:** Shopping cart page. Lists all items with quantity controls, per-item prices, and total.

**Key features:**
- Responsive layout: `max-w-7xl` with left (items) + right (summary sidebar)
- Quantity increment/decrement buttons
- Remove item button
- `formatCurrency()` for NGN price display
- Empty cart state with "Start Shopping" link
- CTA to proceed to checkout (`/checkout`)

**Derived data:** Uses `items`, `totalItems`, `totalPrice` (or `subtotal`) from `useCart()`.

---

## `Checkout.jsx` **([link](./src/pages/Checkout/Checkout.jsx))**

**Purpose:** Multi-step checkout process. 291 lines — one of the most complex pages.

**4 Steps (state machine via `step` state):**

| Step | State Value | Component | Description |
|------|-------------|-----------|-------------|
| Review Cart | `step === 1` | Item list + totals | Review items, confirm quantities |
| Shipping Info | `step === 2` | Form with Zod validation | Full Name, Email, Address, City, State, ZIP, Phone |
| Payment | `step === 3` | Payment method selection | Card (Paystack), Bank Transfer, Cash on Delivery |
| Confirmation | `step === 4` | Order placed screen | Checkmark, Order ID, Continue/View buttons |

**Step indicator:** A visual progress bar at the top. Each step has an icon (bag, truck, credit card, check). Completed steps show green checkmarks. Connecting lines between steps.

**Auth check:** If user is not authenticated, redirects to `/login` with `state.from` pointing back to checkout.

**Empty cart check:** If cart is empty and no order has been placed, shows an empty cart message.

**Shipping form (Step 2):** Uses `react-hook-form` with `zodResolver`. Default values pre-filled from user profile (name, email). Validation schema:
- `fullName` — required
- `email` — optional email format
- `address`, `city`, `state`, `phone` — required
- `zip` — optional

**Payment (Step 3):**
- **Card:** Clicking "Place Order" calls `handlePayWithPaystack()` which calls `usePaystack.initializePayment()`. Paystack popup opens. On success, order is created via `createOrder()` service.
- **Bank Transfer:** Shows bank account details (static: "CineVerse Bank", account 0123456789).
- **Cash on Delivery:** Shows "Pay upon delivery" message.

**Order creation (Steps 3→4):**
```jsx
const orderData = {
  user_id: user.id,
  items: items.map(item => ({ productId, title, price, quantity, image, category })),
  total_amount: subtotal,
  status: 'pending',
  shipping_info: shippingData,
  payment_method: payment.method,
  payment_ref: paymentRef || null,
}
```

The `createOrder()` service sends this to Supabase. On success: cart is cleared, toast notification shown, step advances to 4.

**Animations:** Uses `AnimatePresence` with `mode="wait"` — each step slides in from right, exits to left.

---

## `Wishlist.jsx`

**Purpose:** Displays all wishlist items. Uses `useWishlist()`. Shows items in a grid with "Add to Cart" and "Remove" buttons.

**Empty state:** Heart icon + "Your wishlist is empty" + "Explore Products" link.

---

## `Search.jsx`

**Purpose:** Search results page. Reads `q` param from URL via `useSearchParams()`. Uses `useMovieSearch(query)` and other search hooks to fetch results.

**Flow:**
1. Reads `?q=<query>` from URL
2. Fetches movie search results from TMDB
3. Shows results in a grid with MovieCard components
4. Shows "No results" state if query returns nothing

---

## `Login.jsx`

**Purpose:** User login form with email/password.

**Key details:**
- Uses `react-hook-form` with `zodResolver` and `loginSchema` (email + password validation)
- Shows/hides password with eye icon toggle
- Loading state: "Signing in..." text + disabled button
- On success: toast welcome message, navigate to previous page or home
- On error: toast error message
- Link to Register page
- Wrapped in `MainLayout`

**Redirect logic:** `location.state?.from?.pathname` — this is the URL saved by `ProtectedRoute` when it redirected to login. Ensures users return to the page they were trying to access.

---

## `Register.jsx`

**Purpose:** User registration form with name, email, password.

**Key details:**
- Uses `react-hook-form` with `zodResolver`
- Collects `fullName`, `email`, `password`, `confirmPassword`
- Validates password match
- Calls `register()` from AuthContext (creates Supabase auth user + profile row)
- On success: navigates to home with welcome toast
- Link to Login page

---

## `Profile.jsx`

**Purpose:** User profile page showing account details and order history.

**Sections:**
- User info (name, email, avatar)
- Edit profile form (name, phone, address) — updates Supabase profiles table
- Order history table — fetches from `orders` table via Supabase

**Auth protection:** Must be logged in (wrapped in `ProtectedRoute`).

---

## `NotFound.jsx`

**Purpose:** 404 page for unmatched routes (`path="*"`).

**Content:**
- Large "404" heading
- "Page not found" message
- "Go Home" button
- Dark theme consistent with app style

---

## Info Pages (`src/pages/Info/`)

Static public pages linked from the footer Support column (all wrapped in `MainLayout` + `Seo`):

- **`Contact.jsx`** (`/contact`) — Business info cards (email `stompiddo3@gmail.com`, Lagos, support hours) + contact form that composes a `mailto:` link on submit (no backend — opens the visitor's email app with the message pre-filled).
- **`FAQ.jsx`** (`/faq`) — Accordion of 10 Q&As (`<details>/<summary>`) covering payments, order status, digital downloads, 1-hour links, refunds, coupons, seller/payout flow, password reset, tracking.
- **`Privacy.jsx`** (`/privacy`) — Static privacy policy: data collected, usage, Paystack/Supabase third parties, cookies/local storage, retention & deletion, user rights.
- **`Terms.jsx`** (`/terms`) — Static terms: accounts, orders/payments (NGN), digital content license, coupons, seller terms/commission, prohibited conduct, liability.

---

## Dashboard Pages

### Admin

#### `AdminDashboard/Dashboard.jsx`
Main admin overview page. Shows key metrics (users, orders, revenue, pending orders) via `useDashboardStats()`. Displays charts (revenue trend, order volume, category breakdown) using `useRevenueData()`, `useOrderVolume()`, `useCategoryBreakdown()`.

#### `AdminDashboard/Orders.jsx`
Full orders management table. Fetches from Supabase `orders` table. Columns: Order ID, Customer, Items, Total, Status, Date, Actions. Allows status updates.

#### `AdminDashboard/Products.jsx`
Product management (future feature — currently uses external APIs, so products are searchable/viewable but not CRUD-managed).

#### `AdminDashboard/Users.jsx`
User management table. Lists all users from `profiles` table. Shows email, name, role, signup date. Admin can change roles.

#### `AdminDashboard/components/`
Shared components used by admin pages (charts, stats cards, data tables).

### Manager

#### `ManagerDashboard/Dashboard.jsx`
Manager overview — shows order stats, staff performance metrics.

#### `ManagerDashboard/StaffManagement.jsx`
Staff user management — manager can view staff accounts and their activity.

### Staff

#### `StaffDashboard/Dashboard.jsx`
Staff overview — shows pending orders, personal order fulfillment stats.

#### `StaffDashboard/Orders.jsx`
Order management for staff — view and update order status.
