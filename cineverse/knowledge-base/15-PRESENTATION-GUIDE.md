# 15 — Presentation Guide (prepared for the demo)

Quick reference for demoing CineVerse live. Everything here is verified to work as of the `f38277b` release.

---

## Accounts

| Role | Email | Login |
|------|-------|-------|
| Admin | `emmanuelchigozie0808@gmail.com` | Password (user's own) |
| Manager | `stompiddo2@gmail.com` | Password (user's own) |
| Customer | `mebuka70@gmail.com` | Password (user's own) |

**Keep only these 3 accounts in the DB.** Never create test signups with fake emails — Supabase flags bounced emails and can suspend the project (happened once; recovery takes 24h+). For demo signups use the customer account or a REAL email.

---

## Live Assets

- **Live URL:** https://cineverse-blush.vercel.app
- **Paystack test mode** — use test card `4084 0840 8408 4081`, any future expiry, any CVV, OTP `123456` (or `0000`).
- **Coupon:** `TEST10` (10% off) — create/disable it under Admin → Coupon Management.
- **DB orders present:** two `pending` test orders (₦3531, ₦3424, both with TEST10) and one `shipped` order (₦10800).

---

## Suggested Demo Script (~10 min)

### 1. Browse & search (customer)
Home → Movies (TMDB trending), Books (Google Books), Manga (Jikan), Comics (Open Library). Search box in navbar. Detail pages show rating, runtime, genres, cast.

### 2. Cart, coupon & checkout (customer `mebuka70@gmail.com`)
Add items → Cart → Checkout → apply `TEST10` → select **Card** → Paystack popup with test card → success screen. Note: the order shows as `pending` until the webhook flips it — if webhook simulation wasn't re-run, flip it manually in Supabase: `UPDATE orders SET status='paid' WHERE payment_ref = '<ref>';`

### 3. Manager dashboard (`stompiddo2@gmail.com`)
Dashboard → Orders (all orders visible — the role-resolution fix), Staff Management (add staff; note the temp password + "admin must promote" flow), Revenue chart.

### 4. Admin dashboard
Users (promote a staff → manager to demo), Coupons, Products moderation, Seller Requests (approve a seller to demo the seller flow).

### 5. Seller flow (if demoed)
Approved seller uploads a product → it appears as `pending` → Admin approves → product listed; earnings credited after a paid order (5% platform commission).

### 6. Roles & security (strong talking point)
- New signups always start as `customer` — metadata can't escalate (trigger hardening).
- Only admins can change roles (`guard_profile_role` trigger).
- Managers manage staff through the `manage_staff` RPC — RLS can't be bypassed.
- Webhook is idempotent — replayed Paystack events can't double-credit sellers.

---

## Known Limitations (answer-ready)

| Limitation | Explanation |
|------------|-------------|
| Orders stay `pending` after test payment | Paystack webhook must be re-simulated in the dashboard (or order flipped manually in SQL). Webhook code updates are deployed via `supabase functions deploy paystack-webhook --project-ref lkcdoylwdjgruyccetcl` |
| Product sync writes fail silently for customers | `syncProduct` upserts are RLS-gated to admins/sellers (products INSERT requires `seller_id = auth.uid()`); the hook now only runs for admins |
| `product-files` downloads need auth | Private bucket — signed URLs expire after 1h |
| Avatar upload retest pending | Supabase bounced-email incident caused a delay; re-test avatar re-upload before demo if it matters |
| Movie details from TMDB may be missing for some titles | External API data — pages now show `N/A` instead of crashing |

---

## Presenter Cheat Sheet

- **Don't** create new accounts during the demo — use the 3 real accounts.
- **Don't** refresh the Paystack webhook history if unsure — just flip the order status in SQL.
- **Don't** demo seller payouts end-to-end — real bank transfers don't run in test mode.
- **Do** demo the coupon, role promotion, and idempotency/security story — those are the differentiators.
- If the AI assistant (ChatWidget) is demoed, it calls the edge function `ai-summary`; it returns "AI is busy" if concurrent users hit it — retry after a minute.
