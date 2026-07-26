-- Run this in Supabase SQL Editor to migrate the existing reviews table
-- Changes: product_id (UUID FK) → product_slug (TEXT)

ALTER TABLE reviews DROP CONSTRAINT reviews_product_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT reviews_user_id_product_id_key;
ALTER TABLE reviews RENAME COLUMN product_id TO product_slug;
ALTER TABLE reviews ALTER COLUMN product_slug TYPE TEXT;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_product_slug_key UNIQUE (user_id, product_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_product_slug ON reviews(product_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
