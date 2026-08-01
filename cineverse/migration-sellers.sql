-- Migration: Sellers & Movie Producers Marketplace
-- Run this in the Supabase SQL Editor. Idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS).

-- 1. Allow 'seller' role on profiles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check' AND conrelid = 'profiles'::regclass) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
  END IF;
END $$;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer','seller','staff','manager','admin'));

-- 2. seller_requests: add type (seller / producer)
ALTER TABLE seller_requests ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'seller' CHECK (type IN ('seller','producer'));

-- 3. products: seller ownership + moderation + digital delivery columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active','rejected'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS sales_count INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- 4. RLS: sellers manage their own products (inserts always start as 'pending')
DROP POLICY IF EXISTS "Sellers can insert own products" ON products;
CREATE POLICY "Sellers can insert own products" ON products FOR INSERT WITH CHECK (
  auth.uid() = seller_id
);
DROP POLICY IF EXISTS "Sellers can update own products" ON products;
CREATE POLICY "Sellers can update own products" ON products FOR UPDATE
  USING (seller_id = auth.uid()) WITH CHECK (seller_id = auth.uid());
DROP POLICY IF EXISTS "Sellers can delete own products" ON products;
CREATE POLICY "Sellers can delete own products" ON products FOR DELETE USING (seller_id = auth.uid());

-- 5. Trigger: non-admin sellers can never publish; any edit re-submits for review.
--    Service role (webhook) and admin bypass. Customer product syncs (seller_id NULL) untouched.
CREATE OR REPLACE FUNCTION enforce_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  IF NEW.seller_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) <> 'admin' THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_product_status ON products;
CREATE TRIGGER trg_enforce_product_status
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION enforce_product_status();

-- 6. Function to increment product sales count (called by the payment webhook)
CREATE OR REPLACE FUNCTION increment_product_sales(p_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products SET sales_count = sales_count + 1 WHERE slug = p_slug;
END;
$$;

-- 7. Storage buckets: public images, private video files
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', false)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Sellers upload product images" ON storage.objects;
CREATE POLICY "Sellers upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Anyone can read product images" ON storage.objects;
CREATE POLICY "Anyone can read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Sellers update own product images" ON storage.objects;
CREATE POLICY "Sellers update own product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Sellers delete own product images" ON storage.objects;
CREATE POLICY "Sellers delete own product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Sellers upload product files" ON storage.objects;
CREATE POLICY "Sellers upload product files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-files' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Authenticated users read product files" ON storage.objects;
CREATE POLICY "Authenticated users read product files" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Sellers update own product files" ON storage.objects;
CREATE POLICY "Sellers update own product files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-files' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Sellers delete own product files" ON storage.objects;
CREATE POLICY "Sellers delete own product files" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 8. Seller payouts (created first - referenced by earnings)
CREATE TABLE IF NOT EXISTS seller_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  bank_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed','cancelled')),
  transfer_code TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payouts_seller ON seller_payouts(seller_id);
ALTER TABLE seller_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers view own payouts" ON seller_payouts;
CREATE POLICY "Sellers view own payouts" ON seller_payouts FOR SELECT USING (auth.uid() = seller_id);
DROP POLICY IF EXISTS "Admins manage payouts" ON seller_payouts;
CREATE POLICY "Admins manage payouts" ON seller_payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 9. Seller earnings (per order line)
CREATE TABLE IF NOT EXISTS seller_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  gross NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL,
  net NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','pending_transfer','paid','failed')),
  payout_id UUID REFERENCES seller_payouts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_earnings_seller ON seller_earnings(seller_id);
CREATE INDEX IF NOT EXISTS idx_earnings_payout ON seller_earnings(payout_id);
ALTER TABLE seller_earnings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers view own earnings" ON seller_earnings;
CREATE POLICY "Sellers view own earnings" ON seller_earnings FOR SELECT USING (auth.uid() = seller_id);
DROP POLICY IF EXISTS "Admins manage earnings" ON seller_earnings;
CREATE POLICY "Admins manage earnings" ON seller_earnings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
