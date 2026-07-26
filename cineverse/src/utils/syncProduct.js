import { upsertProduct } from '@/services/products'

const defaultPrices = { movie: 2500, book: 2000, manga: 1800, comic: 2200 }

export function syncProduct({ id, slug, title, description, category, image, rating, rating_count, external_id }) {
  upsertProduct({
    slug: slug || `${category}:${external_id || id}`,
    title: title || 'Unknown',
    description: description || '',
    price: defaultPrices[category] || 2000,
    category,
    image: image || null,
    stock: 50,
    rating: rating || 0,
    rating_count: rating_count || 0,
    external_id: external_id || id?.toString() || null,
    metadata: {},
  }).catch(() => {})
}
