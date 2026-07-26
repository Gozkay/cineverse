# 10 — Styling

This section covers the global CSS file (`src/index.css`) and the Tailwind CSS v4 configuration embedded within it.

---

## File: `src/index.css`

**Purpose:** Global styles — Tailwind imports, design tokens (CSS custom properties), custom utilities, animations, and base styles.

### Tailwind Imports

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";
```

- **`tailwindcss`** — Tailwind CSS v4 framework. In v4, this one import replaces the previous `@tailwind base/components/utilities` directives.
- **`tw-animate-css`** — CSS animation library for Tailwind. Provides animation utilities like `animate-in`, `slide-in`, `fade-in`.
- **`shadcn/tailwind.css`** — shadcn/ui theme variables and base styles. This provides the default dark/light theme tokens that are overridden below.
- **`@fontsource-variable/geist`** — Geist Variable font by Vercel. Loads the font family for use across the app.

### Custom Variants

```css
@custom-variant dark (&:is(.dark *));
```

Tailwind v4 syntax for the dark mode variant. The `dark:` prefix (e.g., `dark:bg-gray-900`) applies styles when a parent element has the `.dark` class. This is the "class-based dark mode" strategy — the `.dark` class is applied to `<html>` via the shadcn/ui theme.

### Theme Definition

```css
@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Geist Variable', sans-serif;
    --color-sidebar-ring: var(--sidebar-ring);
    /* ... all other CSS custom properties for shadcn/ui */
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
}
```

**`@theme inline`** is Tailwind v4's syntax for defining design tokens as CSS custom properties. This replaces Tailwind v3's `tailwind.config.js` theme extension.

The theme variables fall into categories:
- **Fonts:** `--font-sans` (Geist Variable), `--font-heading` (same as sans in this config)
- **Colors:** All shadcn/ui semantic colors mapped to CSS custom properties (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart, sidebar)
- **Border radius:** Derived from `--radius` (0.625rem) with multipliers for sm (0.6×), md (0.8×), lg (1×), xl (1.4×), 2xl (1.8×), 3xl (2.2×), 4xl (2.6×)

### CSS Custom Properties (Light Theme)

```css
:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    /* ... */
    --radius: 0.625rem;
}
```

Defines the light theme default values using `oklch()` color syntax — a perceptually uniform color space. The light theme has:
- White background (`oklch(1 0 0)`)
- Near-black text (`oklch(0.145 0 0)`)
- Gray borders and muted elements

### Dark Theme

```css
.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    /* ... */
    --border: oklch(1 0 0 / 10%);
    --sidebar-primary: oklch(0.488 0.243 264.376);
}
```

When the `.dark` class is present, all CSS custom properties switch to dark values:
- Dark background (`oklch(0.145 0 0)` — slate-950 equivalent)
- Light text (`oklch(0.985 0 0)`)
- Violet-tinted sidebar primary (`oklch(0.488 0.243 264.376)` — roughly `#7c3aed`)
- Borders are 10% white for subtle separation

**Note:** The light theme (`:root`) and dark theme (`.dark`) values are swapped from a typical setup. The default theme (no `.dark` class) is light mode, but the app never removes `.dark` — it's always dark mode. The light theme values exist for shadcn/ui compatibility but aren't used in practice.

### Base Layer Styles

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans scroll-smooth;
  }
```

- **Universal selector:** All elements get `border-border` (border color matches theme) and a subtle focus ring via `outline-ring/50`
- **Body:** Background and text color use CSS custom properties (switching with dark/light theme)
- **HTML:** Uses the Geist Variable font with `scroll-smooth` for smooth anchor scrolling

### Text Selection

```css
  ::selection {
    background-color: rgba(139, 92, 246, 0.3);
    color: #f1f5f9;
  }
```

When user selects text, highlight is violet (`#8b5cf6` at 30% opacity) with light slate text.

### Custom Scrollbar (WebKit only)

```css
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }
```

Custom dark scrollbar styling for Chrome/Edge/Safari:
- Track: slate-950 (`#0f172a`)
- Thumb: slate-700 (`#334155`) with rounded corners
- Hover: slate-600 (`#475569`)

---

## Custom Utility Classes

Tailwind v4's `@utility` directive defines custom utility classes that can be used like built-in Tailwind utilities.

### `shimmer`

```css
@utility shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.08) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

**Purpose:** Loading skeleton shimmer effect. Creates a moving highlight that sweeps across a loading placeholder.

**Usage:** `<div className="shimmer h-48 w-full rounded-xl" />`

**How it works:**
1. Sets a gradient background (transparent → faint highlight → transparent)
2. `background-size: 200% 100%` makes the gradient twice the element's width
3. The `shimmer` animation moves the background position from right to left (200% to -200%)

### `text-gradient`

```css
@utility text-gradient {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Purpose:** Violet-to-pink gradient text. Used for the CineVerse logo and headings.

**Usage:** `<h1 className="text-gradient">CineVerse</h1>`

The `background-clip: text` clips the gradient to the text shape. The `-webkit-text-fill-color: transparent` makes the text itself transparent so the background shows through.

### `glass`

```css
@utility glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.08);
}
```

**Purpose:** Frosted glass effect. Semi-transparent background with blur.

**Usage:** `<div className="glass rounded-xl p-6" />`

**How it works:**
- `rgba(15, 23, 42, 0.6)` — dark background at 60% opacity (lets underlying content show through)
- `backdrop-filter: blur(12px)` — blurs whatever is behind the element (creates the frosted effect)
- `border` — subtle white border at 8% opacity for definition

### `glow`

```css
@utility glow {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
}
```

**Purpose:** Violet outer glow effect. Used on interactive elements.

### `animate-float`

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@utility animate-float {
  animation: float 3s ease-in-out infinite;
}
```

**Purpose:** Gentle bobbing animation. Used on Hero floating cards to give a parallax feel.

### `animate-pulse-glow`

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.4); }
}

@utility animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}
```

**Purpose:** Pulsing violet glow. Used on CTA buttons to attract attention.

---

## Key Animation Definitions

| Animation | Purpose | Duration |
|-----------|---------|----------|
| `shimmer` | Loading skeleton sweep | 2s infinite |
| `float` | Gentle vertical bob | 3s infinite |
| `pulse-glow` | Box shadow breathing | 3s infinite |

---

## How Tailwind Classes Are Used

The app uses Tailwind utility classes exclusively — no CSS modules, styled-components, or inline styles (except dynamic values). This is consistent with the shadcn/ui pattern.

**Color palette usage:**
- `bg-slate-950` — main background (`#020617`)
- `bg-slate-900/50` — card backgrounds
- `border-white/5` — subtle separators
- `text-gray-400` — secondary text
- `text-violet-400` — primary accent
- `from-violet-400 to-fuchsia-400` — gradient accents

**Spacing:** Uses Tailwind's scale: `px-6` (24px), `py-12` (48px), `gap-4` (16px)

**Responsive:** `sm:`, `md:`, `lg:` prefixes for breakpoints. Mobile-first — base styles are mobile, breakpoints add desktop overrides.

---

## File Summary

| Section | Lines | Purpose |
|---------|-------|---------|
| Tailwind Imports | 1-4 | Framework and font loading |
| Dark Variant | 6 | Dark mode class selector |
| Theme Tokens | 8-48 | CSS custom properties for shadcn/ui |
| Light Theme Root | 51-84 | Default (light) property values |
| Dark Theme | 86-118 | Dark mode property overrides |
| Base Layer | 120-149 | Global element styles, scrollbar, selection |
| Custom Utilities | 152-202 | shimmer, text-gradient, glass, glow, animations |
