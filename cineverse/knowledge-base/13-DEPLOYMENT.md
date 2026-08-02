# 13 — Deployment

---

## Actual Release Flow (used during development)

The app is deployed manually with the Vercel CLI (not Git-connected auto-deploy):

```
npm run lint        # ESLint — 0 errors, 0 warnings
npm run test        # Vitest — 42 tests / 6 files pass
npm run build       # Vite production build
vercel --prod --yes # Deploys to https://cineverse-blush.vercel.app
git commit + push   # Push to github.com/Gozkay/cineverse (master)
```

**Live URL:** https://cineverse-blush.vercel.app  
**Vercel project:** `gozkays-projects/cineverse`

**Database/edge-function changes are NOT deployed by Vercel.** They ship as migration `.sql` files at the repo root (e.g. `migration-presentation-fixes.sql`) that the developer pastes into the Supabase **SQL Editor**, and the Deno edge functions are deployed with the Supabase CLI (project already linked — `.temp/linked-project.json`):

```
supabase functions deploy paystack-webhook --project-ref lkcdoylwdjgruyccetcl
supabase functions deploy seller-payout --project-ref lkcdoylwdjgruyccetcl
supabase functions list --project-ref lkcdoylwdjgruyccetcl   # verify version bump
```

**There is no code editor in the Supabase dashboard** — the Edge Functions page (https://supabase.com/dashboard/project/lkcdoylwdjgruyccetcl/functions) is for inspecting deployments, logs, invocations, and secrets only. Function code updates always go through the CLI (or the Platform API). Function secrets are managed with `supabase secrets set --project-ref <ref>`.

---

## Docker

### `Dockerfile`

**Purpose:** Multi-stage Docker build for production deployment.

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Stage 1 — Build (node:22-alpine):**
1. `node:22-alpine` — Minimal Node.js 22 image (46MB). Alpine Linux keeps the image small.
2. `WORKDIR /app` — Sets working directory.
3. `COPY package*.json && RUN npm ci` — Copies only dependency files first, then installs. Docker layer caching: if `package*.json` hasn't changed, this layer is cached and the `npm ci` step is skipped.
4. `COPY . .` — Copies the rest of the source code.
5. `RUN npm run build` — Runs the Vite production build.

**Stage 2 — Serve (nginx:1.27-alpine):**
1. `nginx:1.27-alpine` — Minimal Nginx image (23MB). Latest stable Nginx on Alpine.
2. `COPY --from=build /app/dist /usr/share/nginx/html` — Copies the built static files from the build stage. The `--from=build` references the first stage.
3. `COPY nginx.conf` — Copies the custom Nginx config.
4. `EXPOSE 80` — Documents that port 80 is used.
5. `CMD ["nginx", "-g", "daemon off;"]` — Starts Nginx in the foreground (required for Docker — if Nginx forks to background, the container exits).

**Result:** ~50MB image containing a production-ready Nginx server serving the built SPA.

### `nginx.conf`

**Purpose:** Nginx configuration for serving the SPA.

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**`location /` block (SPA fallback):**
```nginx
try_files $uri $uri/ /index.html;
```
For any URL, Nginx first tries the exact path (`$uri`), then the path as a directory (`$uri/`), and finally falls back to `/index.html`. This is essential for SPAs — when a user navigates to `/movies/123` directly (or refreshes the page), the server must serve `index.html` because React Router handles the routing client-side.

**Static assets caching:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2?)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```
- Matches files with static asset extensions (case-insensitive via `~*`)
- `expires 1y` — Sets `Expires` header 1 year in the future
- `Cache-Control: public, immutable` — Tells browsers and CDNs to cache aggressively. `immutable` means the file will never change (handled by Vite's content hashing — `main.abc123.js` changes filename when content changes)

### `.dockerignore`

```
node_modules
dist
.git
.env
.gitignore
README.md
*.md
```

Ensures that `node_modules` (35MB+) and the `.env` file (secrets) are not copied into the Docker build context. Only source files needed for the build are included.

---

## CI/CD

**No GitHub Actions workflow present in the codebase** (`.github/` directory was not found on disk). The `POST_SETUP.md` references Vercel auto-deploy via GitHub Secrets. The app is likely deployed on Vercel (connected via GitHub) rather than through Actions.

Typical Vercel Git deployment workflow:
1. Push to `main` branch on GitHub
2. Vercel webhook triggers
3. Vercel runs `npm run build`
4. Static files deployed to Vercel's edge network
5. Automatic SSL, CDN, and preview deployments for PRs

---

## Progressive Web App (PWA)

### `public/sw.js`

**Purpose:** Service worker for offline support and caching.

**Cache name:** `cineverse-v1` — versioned so cache busting is done by changing the version string.

**Pre-cached assets on install:**
```js
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg',
  '/placeholder-book.svg', '/placeholder-manga.svg', '/placeholder-comic.svg']
```

**Install event:**
```js
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)))
})
```
Pre-caches the app shell and placeholder images when the service worker installs.

**Activate event:**
```js
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  )
})
```
Deletes old cache versions when a new service worker activates.

**Fetch strategy — two strategies depending on URL:**
```js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    event.respondWith(networkFirst(event.request))
  } else {
    event.respondWith(cacheFirst(event.request))
  }
})
```

| Strategy | Used for | Behavior |
|----------|----------|----------|
| `cacheFirst` | Static assets, UI | Return cached if available; fetch and cache if not |
| `networkFirst` | API calls, Supabase | Try network first; fall back to cache on failure |

**`cacheFirst(request)`:**
1. Check cache for the request
2. If found, return cached response immediately (fast)
3. If not found, fetch from network, cache the response, return it

**`networkFirst(request)`:**
1. Try to fetch from network
2. If successful, update cache and return network response
3. If network fails (offline), try cache
4. If both fail, return 503 "Offline" JSON response

### `public/manifest.json`

```json
{
  "name": "CineVerse",
  "short_name": "CineVerse",
  "description": "E-commerce marketplace for movies, books, manga, and comics",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#8b5cf6",
  "icons": [{ "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }]
}
```

**`display: "standalone"`** — When added to home screen, the app opens without browser chrome (no address bar, no tab bar). Looks like a native app.

**`start_url: "/"`** — Opens to the home page.

**Icon:** SVG favicon with `sizes: "any"` (scales to any size). On iOS, additional icon sizes would be needed for the best experience.

### `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://cineverse.app/sitemap.xml
```

Allows all search engines to crawl the entire site. Points to the sitemap for better SEO.

### `public/sitemap.xml`

Lists 7 URLs with priority values:
| URL | Priority |
|-----|----------|
| `/` | 1.0 |
| `/movies`, `/books`, `/manga`, `/comics` | 0.8 |
| `/search` | 0.6 |
| `/cart`, `/wishlist` | 0.5 |

Product detail pages are not included (they're dynamic from external APIs and SEO is handled client-side). Login, Register, Checkout, and Dashboard are excluded (no SEO value).

### `public/favicon.svg`

An SVG icon: a rounded rectangle (dark background) with a violet play-button triangle and a subtle waveform below it. At 32×32px but scales cleanly as SVG.

### Placeholder Images

- `placeholder-book.svg` — Fallback when Google Books image is missing
- `placeholder-manga.svg` — Fallback when Jikan image is missing
- `placeholder-comic.svg` — Fallback when Open Library image is missing

---

## POST_SETUP.md

**Purpose:** Post-deployment setup instructions.

**Three setup steps:**
1. **GitHub Secrets for Vercel** — `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
2. **Seed Products** — `node scripts/seed-products.mjs` to populate Supabase products table
3. **Create Seed Users** — Admin (admin@cineverse.com), Manager, Staff, Customer via Supabase Auth panel, then update roles in profiles table

---

## Deployment Options

| Platform | Method | Notes |
|----------|--------|-------|
| **Vercel** | Git connect | Zero config, automatic deploys, preview URLs |
| **Docker** | `docker build -t cineverse . && docker run -p 80:80 cineverse` | Served via Nginx |
| **Railway/Fly.io** | Dockerfile deploy | Same Docker image, managed hosting |
| **Manual** | `npm run build` + serve `dist/` with any static server | `npx serve dist` |
