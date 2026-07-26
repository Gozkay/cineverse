-- Migration: New tables and functions added during Phase 3-5
-- Run this in Supabase SQL Editor. Uses IF NOT EXISTS so it's safe alongside existing tables.

-- 1. Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  product_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category TEXT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- 2. Wishlist items
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  product_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_slug)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist_items;
CREATE POLICY "Users can manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id);

-- 3. Replace coupons table with new schema (discount_percent / discount_amount)
-- If the old coupons table has columns 'type' and 'value', drop and recreate.
-- SAFE: drops the old table only if it uses the old schema, then recreates.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'type') THEN
    DROP TABLE IF EXISTS coupons CASCADE;
  END IF;
END $$;
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INT DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  min_amount NUMERIC(10,2) DEFAULT 0,
  max_uses INT DEFAULT 0,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT at_least_one_discount CHECK (discount_percent > 0 OR discount_amount > 0)
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coupons are viewable by everyone" ON coupons;
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Coupons are viewable by everyone" ON coupons FOR SELECT USING (true);
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Function to increment coupon usage count
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$;

-- 5. Refund requests table
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own refunds" ON refund_requests;
DROP POLICY IF EXISTS "Users can create refunds" ON refund_requests;
DROP POLICY IF EXISTS "Admins manage refunds" ON refund_requests;
CREATE POLICY "Users can view own refunds" ON refund_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create refunds" ON refund_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage refunds" ON refund_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- 6. Function to delete user account (called by user themselves)
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM profiles WHERE id = auth.uid();
  DELETE FROM cart_items WHERE user_id = auth.uid();
  DELETE FROM wishlist_items WHERE user_id = auth.uid();
END;
$$;

-- 7. Seller requests table
CREATE TABLE IF NOT EXISTS seller_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE seller_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own seller request" ON seller_requests;
DROP POLICY IF EXISTS "Admins manage seller requests" ON seller_requests;
CREATE POLICY "Users can manage own seller request" ON seller_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins manage seller requests" ON seller_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
