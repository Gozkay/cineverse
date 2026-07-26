# CineVerse Knowledge Base — Index

## Project Summary

CineVerse is a modern dark-themed e-commerce marketplace for entertainment media — **Movies, Books, Manga, and Comics**. Built as a single-page application (SPA) with React 19, Vite 8, Tailwind CSS 4, and Supabase, it features Paystack payment integration, role-based dashboards (Admin, Manager, Staff), and external API integrations for product data. Targeting Nigerian users (NGN currency).

**Live URL:** https://cineverse-blush.vercel.app  
**Repository:** https://github.com/Gozkay/cineverse

---

## File Map

| # | File | Covers |
|---|------|--------|
| 01 | [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) | Project overview, tech stack, data flow, provider chain, build toolchain |
| 02 | [02-ENTRY-POINT.md](./02-ENTRY-POINT.md) | `index.html`, `src/main.jsx`, `src/App.jsx` |
| 03 | [03-ROUTING.md](./03-ROUTING.md) | `src/routes/AppRoutes.jsx`, `src/components/ProtectedRoute.jsx`, `src/constants/routes.js` |
| 04 | [04-CONTEXT.md](./04-CONTEXT.md) | `src/context/AuthContext.jsx`, `src/context/CartContext.jsx`, `src/context/WishlistContext.jsx` |
| 05 | [05-COMPONENTS.md](./05-COMPONENTS.md) | Layout (`Navbar`, `Footer`, `MainLayout`, `DashboardLayout`), `Hero/*`, `ErrorBoundary`, UI primitives (`button`, `card`, `dialog`, etc.), `ProtectedRoute`, category cards, product cards |
| 06 | [06-PAGES.md](./06-PAGES.md) | All page components — Home, Movies, MovieDetails, Books, BookDetails, Manga, MangaDetails, Comics, ComicDetails, Cart, Checkout, Wishlist, Search, Profile, Login, Register, NotFound, Dashboard pages (Admin, Manager, Staff) |
| 07 | [07-HOOKS.md](./07-HOOKS.md) | Custom hooks — `usePaystack`, `useSearch`, `useBooks`, `useManga`, `useComics`, `useTrendingMovies`, `useDashboardStats` (includes `useRevenueData`, `useOrderVolume`, `useCategoryBreakdown`) |
| 08 | [08-SERVICES.md](./08-SERVICES.md) | API service layer — `auth.js`, `orders.js`, `movieService.js`, `tmdb.js`, `books.js`, `manga.js`, `comics.js`, `supabase.js` |
| 09 | [09-UTILS.md](./09-UTILS.md) | Helper utilities — `formatCurrency.js`, `formatDate.js`, `helpers.js`, `cn()` from `utils.js`, `tmdb.js` constants, `categoryData.js`, `heroData.js` |
| 10 | [10-STYLING.md](./10-STYLING.md) | `src/index.css` — Tailwind imports, design tokens, custom animations, dark theme variables |
| 11 | [11-DATABASE.md](./11-DATABASE.md) | `supabase-schema.sql` — all tables, RLS policies, triggers; `scripts/seed-products.mjs` |
| 12 | [12-CONFIG-BUILD.md](./12-CONFIG-BUILD.md) | `vite.config.js`, `eslint.config.js`, `package.json`, `jsconfig.json`, `components.json`, `.env.example` |
| 13 | [13-DEPLOYMENT.md](./13-DEPLOYMENT.md) | `Dockerfile`, `nginx.conf`, `.dockerignore`, `.github/workflows/ci.yml`, `public/sw.js`, `public/manifest.json`, `public/robots.txt`, `public/sitemap.xml`, `POST_SETUP.md` |
| 14 | [14-TESTING.md](./14-TESTING.md) | All test files — `setup.js`, `utils.test.jsx`, `ProtectedRoute.test.jsx`, `CartContext.test.jsx`, `WishlistContext.test.jsx`, `usePaystack.test.jsx`, `auth.test.jsx` |

---

## File Count & Stats

- **Total source files:** ~108
- **Total lines of code:** ~7,638
- **Test files:** 6 (42 tests)
- **Lint status:** 0 errors, 0 warnings
- **Build output:** ~1.2MB gzipped
