# 12 — Configuration & Build

---

## `package.json`

**Purpose:** Project metadata, scripts, and dependencies.

**Scripts:**

| Command | Script | Description |
|---------|--------|-------------|
| `npm run dev` | `vite` | Start Vite dev server with HMR |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run lint` | `eslint .` | Run ESLint on all files |
| `npm test` | `vitest run` | Run test suite once |
| `npm run test:watch` | `vitest` | Run tests in watch mode |
| `npm run preview` | `vite preview` | Preview production build locally |

**Dependencies (production):**

| Package | Version | Purpose |
|---------|---------|---------|
| `@base-ui/react` | ^1.6.0 | Unstyled UI primitives (dialog, dropdown, drawer) |
| `@fontsource-variable/geist` | ^5.2.9 | Geist Variable font |
| `@hookform/resolvers` | ^5.4.0 | Zod resolver for react-hook-form |
| `@supabase/supabase-js` | ^2.110.5 | Supabase client (auth + database) |
| `@tailwindcss/vite` | ^4.3.2 | Tailwind CSS v4 Vite plugin |
| `@tanstack/react-query` | ^5.101.2 | Server state management |
| `axios` | ^1.18.1 | HTTP client |
| `chart.js` | ^4.5.1 | Charts for dashboard |
| `class-variance-authority` | ^0.7.1 | Variant-based class generation (used by shadcn) |
| `clsx` | ^2.1.1 | Conditional className joining |
| `framer-motion` | ^12.42.2 | Animations |
| `lucide-react` | ^1.23.0 | Icon library |
| `prop-types` | ^15.8.1 | Runtime prop type checking |
| `react` | ^19.2.7 | UI framework |
| `react-chartjs-2` | ^5.3.1 | React wrapper for Chart.js |
| `react-dom` | ^19.2.7 | React DOM renderer |
| `react-hook-form` | ^7.80.0 | Form state management |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `react-icons` | ^5.7.0 | Icon library (FontAwesome, etc.) |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `tailwind-merge` | ^3.6.0 | Intelligent Tailwind class merging |
| `tailwindcss` | ^4.3.2 | CSS framework |
| `tw-animate-css` | ^1.4.0 | Tailwind animation utilities |
| `zod` | ^4.4.3 | Schema validation |
| `dotenv` | ^16.4.7 | Environment variable loading |

**Dev Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `@eslint/js` | ^10.0.1 | ESLint JavaScript rules |
| `@testing-library/jest-dom` | ^6.9.1 | Custom DOM matchers for tests |
| `@testing-library/react` | ^16.3.2 | React component testing |
| `@testing-library/user-event` | ^14.6.1 | Simulated user events in tests |
| `@vitejs/plugin-react` | ^6.0.3 | Vite React plugin (JSX transform) |
| `eslint` | ^10.6.0 | Linter |
| `eslint-plugin-react-hooks` | ^7.1.1 | React Hooks rules |
| `eslint-plugin-react-refresh` | ^0.5.3 | HMR optimization for React |
| `globals` | ^17.7.0 | Global variables for ESLint |
| `jsdom` | ^29.1.1 | DOM environment for tests |
| `shadcn` | ^4.13.0 | shadcn/ui CLI |
| `vite` | ^8.1.1 | Build tool |
| `vitest` | ^4.1.10 | Test runner |

**Key dependency notes:**
- `react@19` — latest stable React with concurrent features
- `vite@8` — latest major Vite version
- `tailwindcss@4` — latest major Tailwind version with CSS-first configuration
- `zod@4` — latest Zod version (schema validation)
- `react-router-dom@7` — latest React Router with loaders/actions
- `framer-motion@12` — latest major Framer Motion

---

## `vite.config.js`

**Purpose:** Vite configuration — plugins, path aliases, test settings.

```js
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
```

**Key sections:**
- **`/// <reference types="vitest" />`** — TypeScript reference for Vitest types (so `test` property is recognized)
- **`react()` plugin** — Enables JSX/TSX transformation with React Refresh (HMR for components)
- **`tailwindcss()` plugin** — Tailwind CSS v4 Vite plugin (replaces PostCSS plugin from v3)
- **`@` alias** — Maps `@/components/...` to `./src/components/...`. Configured identically in `jsconfig.json` for editor IntelliSense
- **`test` section** — Vitest configuration: `jsdom` environment, setup file, CSS support

**`__dirname` workaround:** In ES modules (`"type": "module"`), `__dirname` is not available. `fileURLToPath(import.meta.url)` + `path.dirname()` recreates it.

---

## `eslint.config.js`

**Purpose:** ESLint flat config (v9+ format).

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```

- **`globalIgnores(['dist'])`** — Ignores the build output directory
- **`extends`** — Three configs: ESLint recommended rules, React Hooks rules (exhaustive-deps, etc.), and React Refresh rules (ensures HMR-safe exports)
- **`languageOptions`** — `globals.browser` provides `window`, `document`, etc. `jsx: true` allows JSX syntax

---

## `jsconfig.json`

**Purpose:** JavaScript project configuration for VS Code IntelliSense.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Mirrors the `@` alias from `vite.config.js`. Without this, VS Code would show import errors for `@/components/...` imports even though they work at build time.

---

## `components.json`

**Purpose:** shadcn/ui CLI configuration.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Key settings:**
- `style: "base-nova"` — shadcn/ui Nova theme
- `rsc: false` — Not using React Server Components
- `tsx: false` — Using JavaScript, not TypeScript
- `tailwind.css` — Path to global CSS (where theme variables are)
- `aliases.ui` — Points to `@/components/ui` (where all shadcn components are)

---

## `.env.example`

**Purpose:** Template for environment variables.

```
# TMDB API (required for movies)
VITE_TMDB_TOKEN=your_tmdb_api_read_access_token_here

# Supabase (required for backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# Paystack (required for payments)
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
```

**Environment variables required:**
1. `VITE_TMDB_TOKEN` — TMDB API Read Access Token (v4 auth). Used by `tmdb.js` and `useSearch.js`.
2. `VITE_SUPABASE_URL` — Supabase project URL. Used by `lib/supabase.js`.
3. `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key. Used by `lib/supabase.js`.
4. `VITE_SUPABASE_SERVICE_KEY` — Supabase service role key (admin). Used by seed scripts/server-side operations.
5. `VITE_PAYSTACK_PUBLIC_KEY` — Paystack public key. Used by `usePaystack.js`.

**All Vite env vars must be prefixed with `VITE_`** to be exposed to client-side code. Variables without this prefix are not available in the browser.

**Gitignore:** The `.gitignore` excludes `.env` files from version control.
