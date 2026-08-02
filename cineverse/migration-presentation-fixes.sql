-- Migration: Presentation fixes (Tier 3 security + idempotency)
-- Run this in the Supabase SQL Editor. Idempotent.
--
-- Contents:
--   1. manage_staff RPC        - lets managers ban/suspend/remove staff (RLS would otherwise block)
--   2. Hardened signup trigger - metadata role is no longer honored (prevents role escalation)
--   3. profiles role guard     - only admins may change a profile's role (kills self-escalation)
--   4. seller_earnings unique  - (order_id, product_slug) so paystack-webhook can upsert idempotently
--   5. seller_payouts column   - recipient_code for recipient reuse + transfer idempotency

-- ============================================================
-- 1. manage_staff: manager/admin RPC for staff lifecycle actions
-- ============================================================
CREATE OR REPLACE FUNCTION public.manage_staff(p_action text, p_target uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT role INTO v_role FROM profiles WHERE id = v_uid;
  IF v_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  IF p_action = 'ban' THEN
    UPDATE profiles SET banned = true, updated_at = NOW() WHERE id = p_target;
  ELSIF p_action = 'unban' THEN
    UPDATE profiles SET banned = false, updated_at = NOW() WHERE id = p_target;
  ELSIF p_action = 'suspend' THEN
    UPDATE profiles SET suspended = true, updated_at = NOW() WHERE id = p_target;
  ELSIF p_action = 'unsuspend' THEN
    UPDATE profiles SET suspended = false, updated_at = NOW() WHERE id = p_target;
  ELSIF p_action = 'remove' THEN
    DELETE FROM cart_items WHERE user_id = p_target;
    DELETE FROM wishlist_items WHERE user_id = p_target;
    DELETE FROM reviews WHERE user_id = p_target;
    DELETE FROM refund_requests WHERE user_id = p_target;
    DELETE FROM profiles WHERE id = p_target;
  ELSE
    RAISE EXCEPTION 'Unknown action';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.manage_staff(text, uuid) TO authenticated;

-- ============================================================
-- 2. Hardened signup trigger: never trust metadata role
--    (Staff/manager accounts are promoted by an admin in Admin -> Users)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_meta jsonb := new.raw_user_meta_data;
  v_seller_type text := lower(COALESCE(v_meta ->> 'sellerType', 'none'));
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(v_meta ->> 'name', split_part(new.email, '@', 1), ''),
    new.email,
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_seller_type IN ('seller', 'producer') THEN
    INSERT INTO public.seller_requests (user_id, type, reason)
    VALUES (
      new.id,
      v_seller_type,
      CASE WHEN v_seller_type = 'producer'
        THEN 'Signed up as a movie producer to sell local movies.'
        ELSE 'Signed up as a seller to list products.' END
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. profiles role guard: only admins may change a role
--    (profiles has "Users can update own profile" USING (auth.uid() = id))
-- ============================================================
CREATE OR REPLACE FUNCTION public.guard_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
    IF v_role IS NULL OR v_role <> 'admin' THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_profile_role ON profiles;
CREATE TRIGGER guard_profile_role
  BEFORE UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profile_role();

-- ============================================================
-- 4. seller_earnings idempotency: one earning row per order line
-- ============================================================
DROP INDEX IF EXISTS idx_earnings_order_product;
CREATE UNIQUE INDEX IF NOT EXISTS idx_earnings_order_product
  ON seller_earnings(order_id, product_slug);

-- ============================================================
-- 5. seller_payouts: store recipient_code (recipient reuse + transfer retries)
-- ============================================================
ALTER TABLE seller_payouts ADD COLUMN IF NOT EXISTS recipient_code TEXT;
