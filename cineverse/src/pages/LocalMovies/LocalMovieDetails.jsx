import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaShoppingCart, FaStar } from 'react-icons/fa'
import { FaHeart, FaArrowLeft, FaStore, FaClapperboard } from 'react-icons/fa6'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import AISummary from '@/components/AI/AISummary'
import ReviewForm from '@/components/Reviews/ReviewForm'
import ReviewList from '@/components/Reviews/ReviewList'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { supabase } from '@/lib/supabase'
import { getPublicImageUrl } from '@/services/seller'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import toast from 'react-hot-toast'

function LocalMovieDetails() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { wishlist, addWishlist, removeWishlist } = useWishlist()
  const [movie, setMovie] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)

  useEffect(() => {
    if (!id) return
    supabase.from('products').select('*').eq('id', id).maybeSingle()
      .then(async ({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return }
        if (data.status !== 'active') { setNotFound(true); setLoading(false); return }
        setMovie(data)
        if (data.seller_id) {
          const { data: sellerData } = await supabase.from('profiles').select('name').eq('id', data.seller_id).maybeSingle()
          setSeller(sellerData)
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      </MainLayout>
    )
  }

  if (notFound || !movie) {
    return (
      <MainLayout>
        <Seo title="Movie Not Found" noIndex />
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
          <p className="text-6xl">🎬</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Movie not available</h1>
          <p className="mt-2 text-sm text-gray-500">This local movie may have been removed or is pending review.</p>
          <Link to={ROUTES.LOCAL_MOVIES} className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500">
            Browse Local Movies
          </Link>
        </div>
      </MainLayout>
    )
  }

  const inWishlist = wishlist.some(w => w.id === movie.id || w.product_slug === movie.slug)

  const handleAddToCart = () => {
    const slugId = movie.slug.replace(/^movie:/, '')
    addItem({
      id: slugId,
      category: 'movie',
      title: movie.title,
      price: movie.price,
      image: movie.image,
    })
  }

  return (
    <MainLayout>
      <Seo title={movie.title} noIndex />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link to={ROUTES.LOCAL_MOVIES} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors">
            <FaArrowLeft /> Back to Local Movies
          </Link>

          <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
                <ImageWithFallback src={getPublicImageUrl(movie.image)} alt={movie.title} className="w-full object-cover" />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={handleAddToCart} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-semibold text-slate-950 hover:opacity-90 transition-opacity">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={() => inWishlist ? removeWishlist(movie.id) : addWishlist({ id: movie.id, category: 'movie', title: movie.title, price: movie.price, image: movie.image })} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${inWishlist ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-slate-700 text-gray-300 hover:border-red-500/50 hover:text-red-400'}`}>
                  <FaHeart />
                </button>
              </div>
              <div className="mt-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <p className="text-3xl font-bold text-amber-400">{formatCurrency(movie.price)}</p>
                <p className="mt-1 text-xs text-gray-500">Digital download — delivered after payment</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-400 ring-1 ring-amber-500/30">
                  <FaClapperboard size={10} /> LOCAL MOVIE
                </span>
                {movie.sales_count > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-[11px] text-gray-400">
                    <FaStar className="text-yellow-500" size={10} /> {movie.sales_count} sold
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-3xl font-bold text-white">{movie.title}</h1>

              {seller && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <FaStore className="text-amber-400" size={13} />
                  Sold by <span className="font-medium text-white">{seller.name}</span>
                </div>
              )}

              <div className="mt-6 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Delivery</span>
                  <span className="text-sm font-medium text-white">Instant download link after payment</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Format</span>
                  <span className="text-sm font-medium text-white">Digital video (MP4)</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold text-white">Description</h2>
                <p className="leading-relaxed text-gray-400">{movie.description || 'No description provided by the seller.'}</p>
                <div className="mt-4">
                  <AISummary item={{ title: movie.title, category: 'movie', description: movie.description }} />
                </div>
              </div>

              <div className="mt-12 border-t border-slate-800 pt-8">
                <h2 className="mb-6 text-xl font-bold text-white">Reviews</h2>
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                  <ReviewList productSlug={movie.slug} refreshKey={reviewRefreshKey} />
                  <ReviewForm productSlug={movie.slug} onReviewAdded={() => setReviewRefreshKey(k => k + 1)} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default LocalMovieDetails
