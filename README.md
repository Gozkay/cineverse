# CineVerse

A modern e-commerce marketplace for movies, books, manga, and comics — built with React 19, Vite 8, Tailwind 4, and Supabase.

Discover, buy, and sell your favorite entertainment media in one beautiful dark-themed platform with Paystack payment integration, reviews, wishlists, and an admin dashboard.

## Tech Stack

| Layer | Tech |
|-------|------|
| **UI** | React 19, React Router 7, Framer Motion |
| **Styling** | Tailwind CSS 4, shadcn/ui, tw-animate-css |
| **State** | React Context (Cart, Wishlist, Auth) |
| **Payments** | Paystack inline popup |
| **Database** | Supabase (PostgreSQL) |
| **Data Sources** | TMDB API (movies), Open Library (books), Jikan API (manga), Comic Vine (comics) |
| **Build** | Vite 8 (Rolldown) |
| **Auth** | Supabase Auth (email/password + Google OAuth) |

## Features

- **4 Product Categories** — Movies, Books, Manga, Comics with dedicated pages
- **Search** — Real-time search across movies (TMDB), with search results grid
- **Hero Section** — Cinematic hero with gradient mesh overlays, animated badge, and floating cards
- **Product Cards** — Glassmorphism cards with glow hover effects, shimmer loading, and gradient pricing
- **Cart & Wishlist** — Context-driven with toast notifications
- **Checkout** — Multi-step (review → shipping → payment) with Paystack integration
- **Reviews** — Star ratings per product with user review forms
- **Auth** — Supabase Auth with email/password or Google, protected routes, role-based dashboards
- **Admin Dashboard** — Analytics (Chart.js), order management, product CRUD, user management
- **Responsive** — Mobile-first with adaptive grids, slide-in mobile nav, and touch-friendly cards
- **Breathtaking UI** — Dark glassmorphism, animated gradients, scroll-triggered reveals, custom scrollbar

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project
- A Paystack public key
- (Optional) TMDB API key for movie search

### Installation

```bash
git clone https://github.com/Gozkay/cineverse.git
cd cineverse
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### Database

Run `supabase-schema.sql` in your Supabase SQL editor to create the required tables (products, orders, order_items, reviews, profiles, staff_actions).

### Seed Data (Optional)

```bash
node scripts/seed-products.mjs
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── assets/          # Static images
├── components/      # Reusable UI components
│   ├── Books/       # BookCard, reviews, etc.
│   ├── Categories/  # Category cards
│   ├── Comics/      # ComicCard, reviews, etc.
│   ├── Hero/        # Hero section with animated background
│   ├── Manga/       # MangaCard, reviews, etc.
│   ├── Movies/      # MovieCard, TrendingMovies, reviews, etc.
│   ├── Reviews/     # ReviewForm, ReviewList
│   ├── layout/      # Navbar, Footer, MainLayout, DashboardLayout
│   ├── ui/          # shadcn primitives (button, card, dialog, etc.)
│   └── charts/      # Admin chart components
├── constants/       # Routes, TMDB config
├── context/         # AuthContext, CartContext, WishlistContext
├── data/            # Static data (hero, categories)
├── hooks/           # Custom hooks (useBooks, useManga, usePaystack, etc.)
├── lib/             # Supabase client, storage helpers
├── pages/           # Route pages
│   ├── Books/ Books.jsx, BookDetails.jsx
│   ├── Cart/ Cart.jsx
│   ├── Checkout/ Checkout.jsx
│   ├── Comics/ Comics.jsx, ComicDetails.jsx
│   ├── Home/ Home.jsx
│   ├── Login/ Login.jsx
│   ├── Manga/ Manga.jsx, MangaDetails.jsx
│   ├── Movies/ Movies.jsx, MovieDetails.jsx
│   ├── Profile/ Profile.jsx
│   ├── Register/ Register.jsx
│   ├── Search/ Search.jsx
│   ├── Wishlist/ Wishlist.jsx
│   └── dashboard/  Admin, Manager, Staff dashboards
├── services/        # API services (auth, orders, movieService, etc.)
├── utils/           # formatCurrency, helpers
├── index.css        # Global styles, Tailwind utilities, custom animations
└── main.jsx         # Entry point
```

## UI Design System

The UI follows a dark glassmorphism design language:

- **Background**: `#0f172a` (slate-950) with subtle dot-grid texture
- **Cards**: `bg-slate-900/40` with `backdrop-blur` and `ring-1 ring-white/5`
- **Gradients**: Category-specific (red→orange for movies, violet→fuchsia for books, pink→rose for manga, emerald→teal for comics)
- **Animations**: Framer Motion for scroll reveals, hover scales, and page transitions
- **Custom utilities**: `shimmer`, `glass`, `glow`, `text-gradient`, custom scrollbar
