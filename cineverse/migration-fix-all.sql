-- Migration: Fix-all — missing storage buckets, RPC security, signup trigger, account deletion
-- Run this in the Supabase SQL Editor. Idempotent (IF NOT EXISTS / DROP ... IF EXISTS / OR REPLACE).
-- Replaces migration-avatars.sql, migration-sellers.sql storage section, and fixes
-- increment_coupon_usage / delete_user / handle_new_user.

-- ============================================================
-- 1. Storage buckets (all were missing on this project)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', false)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

-- product-images: public reads, owner writes
DROP POLICY IF EXISTS "Anyone can read product images" ON storage.objects;
CREATE POLICY "Anyone can read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Sellers upload product images" ON storage.objects;
CREATE POLICY "Sellers upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Sellers update own product images" ON storage.objects;
CREATE POLICY "Sellers update own product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Sellers delete own product images" ON storage.objects;
CREATE POLICY "Sellers delete own product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- product-files: authenticated reads, owner writes
DROP POLICY IF EXISTS "Authenticated users read product files" ON storage.objects;
CREATE POLICY "Authenticated users read product files" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Sellers upload product files" ON storage.objects;
CREATE POLICY "Sellers upload product files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-files' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Sellers update own product files" ON storage.objects;
CREATE POLICY "Sellers update own product files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-files' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Sellers delete own product files" ON storage.objects;
CREATE POLICY "Sellers delete own product files" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- avatars: public reads, owner writes
DROP POLICY IF EXISTS "Anyone can read avatars" ON storage.objects;
CREATE POLICY "Anyone can read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Users upload own avatars" ON storage.objects;
CREATE POLICY "Users upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users update own avatars" ON storage.objects;
CREATE POLICY "Users update own avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users delete own avatars" ON storage.objects;
CREATE POLICY "Users delete own avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- 2. increment_coupon_usage: SECURITY DEFINER so customers can
--    apply coupons at checkout (RLS would otherwise block the UPDATE)
-- ============================================================
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$;

-- ============================================================
-- 3. Signup trigger: profile + seller application + staff/manager role
--    - Creates the profile row (fixes RLS insert error at signup)
--    - Creates seller_requests when metadata sellerType is present
--      (the client cannot do this pre-confirmation - no session yet)
--    - Applies role from metadata, whitelist only (staff/manager, never admin)
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
  v_role text := COALESCE(v_meta ->> 'role', '');
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(v_meta ->> 'name', split_part(new.email, '@', 1), ''),
    new.email,
    CASE WHEN v_role IN ('staff', 'manager') THEN v_role ELSE 'customer' END
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
-- 4. delete_user: full, FK-safe account deletion
--    Orders must be deleted (FK, no cascade). Products keep records
--    but lose the seller link. Auth user row is removed last.
-- ============================================================
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM seller_payouts WHERE seller_id = v_uid;
  DELETE FROM seller_earnings WHERE seller_id = v_uid;
  DELETE FROM seller_requests WHERE user_id = v_uid;
  DELETE FROM refund_requests WHERE user_id = v_uid;
  DELETE FROM reviews WHERE user_id = v_uid;
  DELETE FROM cart_items WHERE user_id = v_uid;
  DELETE FROM wishlist_items WHERE user_id = v_uid;
  DELETE FROM orders WHERE user_id = v_uid;

  UPDATE products SET seller_id = NULL, status = 'active' WHERE seller_id = v_uid;

  DELETE FROM profiles WHERE id = v_uid;
  DELETE FROM auth.users WHERE id = v_uid;
END;
$$;
