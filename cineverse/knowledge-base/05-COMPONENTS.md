# 05 — Components

This section covers all reusable components: layout wrappers, Hero section, UI primitives, category cards, product cards, and the ErrorBoundary.

---

## Layout Components (`src/components/layout/`)

### `MainLayout.jsx`

**Purpose:** The layout wrapper for all public pages. Renders a persistent background pattern, navbar, main content area (children), and footer.

**Key details:**
- Uses `<main>` with `flex-1` to push the footer to the bottom even on short pages.
- **Background grid:** A fixed-position SVG grid pattern (dot grid) with `opacity-[0.015]` for a subtle texture. The `pointer-events-none` ensures clicks pass through to content below.
- The `children` prop is rendered via React Router's `<Outlet>` when used as a layout route, or can be passed explicitly.
- **PropTypes:** `children` is optional (`PropTypes.node`).

**Flow:** Route matches → MainLayout renders → Navbar renders → `<main>` renders the matched child route → Footer renders.

### `Navbar.jsx`

**Purpose:** Primary navigation bar. Sticky at the top, includes logo, nav links, search toggle, cart badge, and user menu.

**State management:**
- `mobileOpen` — toggles the responsive mobile menu
- `searchOpen` — toggles between search form and action icons
- `searchQuery` — controlled input for the search field

**Nav links:** Defined as an array of `{ name, path }` objects in `navLinks`, making it easy to add/remove links. Rendered using `<NavLink>` which provides `isActive` for styling.

**Active indicator:** When a link is active, a gradient underline (`h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500`) appears below it.

**Search flow:**
1. User clicks search icon → form appears with auto-focused input
2. User types + submits → navigates to `/search?q=<query>` via `encodeURIComponent`
3. Close button hides the form

**Cart badge:** Uses `itemCount` from `useCart()`. Shows a gradient badge with the count. Caps display at "9+" for counts > 9.

**User menu (Dropdown):**
- Authenticated: Shows avatar (first letter of name) with dropdown: Profile, Wishlist, Dashboard (for staff+), Logout
- Unauthenticated: Shows a user icon linking to `/login`
- Uses shadcn/ui `DropdownMenu` and `Avatar` components

**Mobile menu:** A full-width panel with search form, nav links, auth links, and logout.

**Role-based dashboard link:** `getDashboardLink()` maps role to route:
- `admin` → `/dashboard/admin`
- `manager` → `/dashboard/manager`  
- `staff` → `/dashboard/staff`

### `Footer.jsx`

**Purpose:** Site footer with 4-column grid layout.

**Sections:**
1. **Brand** — logo with tagline
2. **Browse** — links to Movies, Books, Manga, Comics
3. **Account** — Login, Register, Cart, Wishlist
4. **Support** — Contact, FAQ, Privacy, Terms (static text, no routes)

**Dynamic copyright:** `{new Date().getFullYear()}` auto-updates the year.

### `DashboardLayout.jsx`

**Purpose:** Layout wrapper for all dashboard pages. Includes a collapsible sidebar and top header bar.

**Sidebar navigation:** Links differ by role:
- **Admin:** Overview, Products, Orders, Users
- **Manager:** Overview, Staff, Orders
- **Staff:** Overview, Orders

**State:** `sidebarOpen` controls mobile sidebar visibility. A backdrop overlay closes the sidebar on tap.

**Responsive behavior:**
- Desktop: Sidebar is always visible (as a thin `w-16` collapsed bar via `md:w-16` with full width on overlay)
- Mobile: Sidebar slides in from left with overlay backdrop

**Top header:** Shows page title ("Admin Dashboard", "Manager Dashboard", etc.) and user info (name + avatar with gradient background).

**Exit:** A "Home" link returns to the main site, and a "Logout" button at the bottom signs the user out.

---

## Hero Section (`src/components/Hero/`)

### `index.js`

**Purpose:** Barrel file. Re-exports all Hero components for cleaner imports:
```js
export { default as Hero } from './Hero'
export { default as HeroBackground } from './HeroBackground'
export { default as HeroContent } from './HeroContent'
export { default as HeroButtons } from './HeroButtons'
export { default as HeroFloatingCards } from './HeroFloatingCards'
export { default as HeroStats } from './HeroStats'
```
This allows `import { Hero, HeroBackground } from '@/components/Hero'` instead of individual paths.

### `Hero.jsx`

**Purpose:** The main Hero component for the home page. Composes all sub-components. Handles the "Explore Movies" button click by navigating to `/movies`.

### `HeroBackground.jsx`

**Purpose:** Renders the animated background for the hero section. Uses CSS animations/transitions for a gradient or particle effect.

### `HeroContent.jsx`

**Purpose:** Displays the hero headline, subtitle, and descriptive text. Typically includes:
- A large heading like "Discover Your Next Adventure"
- A subheading about CineVerse's marketplace
- "Explore Movies" CTA button

### `HeroButtons.jsx`

**Purpose:** Renders the call-to-action buttons in the hero (e.g., "Explore Movies", "Browse Books"). Uses Framer Motion for hover effects.

### `HeroFloatingCards.jsx`

**Purpose:** Animated floating cards that showcase product categories (movie poster, book cover, manga panel, comic cover) with parallax-like floating animations using Framer Motion.

### `HeroStats.jsx`

**Purpose:** Displays statistics section below the hero (e.g., "10,000+ Movies", "5,000+ Books", "2,000+ Manga", "1,000+ Comics"). Uses Framer Motion `useInView` for scroll-triggered count-up animations.

---

## Category Components (`src/components/Categories/`)

### `index.js`

**Purpose:** Barrel file. Exports `Categories` and `CategoryCard`.

### `Categories.jsx`

**Purpose:** Renders the category selection grid on the home page. Maps over `categoryData` from `@/data/categoryData` and renders a `CategoryCard` for each category. Uses Framer Motion's `motion.div` with `whileInView` for stagger-animated entrance.

### `CategoryCard.jsx`

**Purpose:** A card for each product category (Movies, Books, Manga, Comics). Usually shows an icon, category name, description, and a link to the category page. Uses Framer Motion for hover scale effect.

---

## Product Card Components

### `MovieCard.jsx` (`src/components/Movies/`)

**Purpose:** Card for displaying a movie in grid views. Shows poster image, title, year, rating, price, and action buttons (Add to Cart, Wishlist). Uses Framer Motion for hover animations (scale, shadow). Connects to `useCart()` and `useWishlist()`.

### `BookCard.jsx` (`src/components/Books/`)

**Purpose:** Card for displaying a book. Same pattern as `MovieCard` but with book-specific data: cover image, title, author, rating, price.

### `MangaCard.jsx` (`src/components/Manga/`)

**Purpose:** Card for displaying a manga. Shows cover, title, chapters, rating, price.

### `ComicCard.jsx` (`src/components/Comics/`)

**Purpose:** Card for displaying a comic. Shows cover, title, issue number, rating, price.

---

## Movie Detail Components (`src/components/Movies/`)

### `MovieHero.jsx`
The large hero banner on a movie's detail page. Shows backdrop image with gradient overlay, poster, title, year, runtime, rating, genre tags, and action buttons (Add to Cart, Wishlist, Watch Trailer).

### `MovieInfo.jsx`
Detailed movie information: synopsis, director, writers, release date, language.

### `MovieCast.jsx`
Cast grid showing actor photos, names, and character names.

### `MovieTrailer.jsx`
Embedded YouTube trailer iframe. Uses the TMDB "videos" endpoint to find official trailers.

### `MovieGallery.jsx`
Image gallery of movie screenshots/backdrops. Uses Framer Motion AnimatePresence for lightbox-style viewing.

### `MovieReviews.jsx`
Displays user reviews for the movie section. Maps over review data with star ratings.

### `MovieSkeleton.jsx`
Loading skeleton placeholder shown while movie detail data is fetching. Matches the layout of the detail page.

### `SimilarMovies.jsx`
Horizontal scrollable row of similar movie recommendations. Uses the TMDB "similar" endpoint.

### `WatchProviders.jsx`
Shows available streaming/purchase platforms (Netflix, Prime Video, Apple TV, etc.) from TMDB's watch provider data.

### `TrendingMovies.jsx`
Horizontal scrollable row of trending movies used on the home page.

### `index.js` (Movies)
```js
export { default as MovieCard } from './MovieCard'
export { default as TrendingMovies } from './TrendingMovies'
export { default as MovieHero } from './MovieHero'
export { default as MovieInfo } from './MovieInfo'
export { default as MovieCast } from './MovieCast'
export { default as MovieTrailer } from './MovieTrailer'
export { default as MovieGallery } from './MovieGallery'
export { default as MovieReviews } from './MovieReviews'
export { default as MovieSkeleton } from './MovieSkeleton'
export { default as SimilarMovies } from './SimilarMovies'
export { default as WatchProviders } from './WatchProviders'
```

---

## Review Components (`src/components/Reviews/`)

### `ReviewForm.jsx`
A form for submitting a product review. Includes star rating input (clickable stars), text area for review content, and submit button. Connects to Supabase to save the review.

### `ReviewList.jsx`
Displays a list of reviews for a product. Shows reviewer name, star rating, date, and review text.

---

## Error Handling

### `ErrorBoundary.jsx`

**Purpose:** A class-based React component that catches JavaScript errors in its child component tree and displays a fallback UI.

**Why a class component?** Error boundaries require `getDerivedStateFromError()` and `componentDidCatch()`, which are only available in class components. React hooks don't have an equivalent yet.

**Lifecycle methods:**
- `getDerivedStateFromError(error)` — static method called during the "render" phase. Updates state to trigger a fallback render. Cannot have side effects.
- `componentDidCatch(error, errorInfo)` — called during the "commit" phase. Used for logging (console.error here). Can have side effects.

**Fallback UI:** A centered card with:
1. A red warning icon (SVG triangle with exclamation mark)
2. "Something went wrong" heading
3. The error message (or generic fallback)
4. A "Reload Page" button that calls `window.location.reload()`

**Usage in routes:** Every route in `AppRoutes.jsx` is wrapped in an `ErrorBoundary` so a crash in one page doesn't affect other pages.

**Nesting strategy:**
- Top-level ErrorBoundary in `main.jsx` catches anything that slips through
- Per-route ErrorBoundaries in `AppRoutes.jsx` catch page-specific errors
- If a page crashes, only that page shows the error UI — the rest of the app (navbar, footer) continues working

---

## UI Primitives (`src/components/ui/`)

These are shadcn/ui components — unstyled primitives based on Radix UI, styled with Tailwind.

### `button.jsx`
A `button` component with multiple variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and sizes (`default`, `sm`, `lg`, `icon`). Uses `cn()` for conditional class merging. Uses React's `forwardRef` for ref forwarding.

### `card.jsx`
A card container with sub-components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. Provides consistent card styling with rounded corners, border, background, and padding.

### `dialog.jsx`
A modal dialog based on `@base-ui-components/react/dialog` (Base UI). Includes `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, and `DialogClose`. Uses AnimatePresence for enter/exit animations. Close on backdrop click and Escape key are built in.

### `dropdown-menu.jsx`
A dropdown menu component based on `@base-ui-components/react/dropdown-menu`. Includes `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`. Used in Navbar for the user menu and in cards for context menus.

### `input.jsx`
A styled input field with consistent focus ring, border colors, and placeholder styling.

### `badge.jsx`
A badge component with variants: `default`, `secondary`, `destructive`, `outline`. Used for status indicators (e.g., "In Stock", "New Release").

### `avatar.jsx`
An avatar component with `Avatar` and `AvatarFallback`. Used in the user menu (shows first letter of name).

### `sheet.jsx`
A slide-over panel (drawer) component based on `@base-ui-components/react/drawer`. Slides in from the side (default: right). Used for mobile menus and filters.

### `table.jsx`
A table component with `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. Used in the admin dashboard for displaying users, products, and orders.

All UI components use the `cn()` utility from `@/lib/utils` for className merging (combines `clsx` and `twMerge`).

---

## `ProtectedRoute.jsx`

**Purpose:** Protects routes behind authentication and optionally role-based authorization.

**Location:** `src/components/ProtectedRoute.jsx` (also covered in 03-ROUTING.md)

**Key behavior:**
```
isLoading? → Show spinner
  → !user? → Redirect to /login (with return URL)
    → requiredRole && role mismatch? → Show 403 page
      → Render children
```

**Props:**
- `children` — the route content to render
- `requiredRole` — optional; e.g., `'admin'`, `'manager'`, `'staff'`

### Integration With Route Guards

In `AppRoutes.jsx`, `ProtectedRoute` wraps dashboard routes:
```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="admin" element={<AdminDashboard />} />
    <Route path="manager" element={<ProtectedRoute requiredRole="manager"><ManagerDashboard /></ProtectedRoute>} />
    <Route path="staff" element={<ProtectedRoute requiredRole="staff"><StaffDashboard /></ProtectedRoute>} />
  </Route>
</Route>
```

The outer `ProtectedRoute` gates all dashboard access to authenticated users. The inner `ProtectedRoute` adds role-specific gating for manager and staff dashboards.
