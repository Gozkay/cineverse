# Post-Setup

## 1. GitHub Secrets for Vercel Auto-Deploy

Add these in your repo: Settings → Secrets and variables → Actions → New repository secret

| Secret | Value | Where to get it |
|--------|-------|-----------------|
| `VERCEL_TOKEN` | Your Vercel access token | Vercel Dashboard → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Your Vercel team ID | `vercel link` then check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Same file as above |

## 2. Seed Products

```bash
node scripts/seed-products.mjs
```

Populates movies (TMDB), books (Google Books), manga (Jikan), and comics (Open Library) into your Supabase `products` table.

## 3. Create Seed Users in Supabase Auth

Go to your Supabase dashboard → Authentication → Users → Add user for each role:

| Email | Password | Role (set in profiles table) |
|-------|----------|------------------------------|
| admin@cineverse.com | (your choice) | admin |
| manager@cineverse.com | (your choice) | manager |
| staff1@cineverse.com | (your choice) | staff |
| john@example.com | (your choice) | customer |

After creating each user, update their `role` in the `profiles` table from the SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@cineverse.com';
```

## 4. Optional: Run Locally

```bash
npm run dev
```
