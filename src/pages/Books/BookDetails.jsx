import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaShoppingCart, FaHeart, FaStar, FaBook, FaUser, FaCalendar, FaBuilding, FaLanguage, FaFileAlt } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useBookDetails } from '@/hooks/useBooks'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import ReviewForm from '@/components/Reviews/ReviewForm'
import ReviewList from '@/components/Reviews/ReviewList'
import toast from 'react-hot-toast'

function BookDetails() {
  const { id } = useParams()
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)
  const { data: book, isLoading, error } = useBookDetails(id)
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-24 rounded bg-slate-800" />
              <div className="flex gap-10">
                <div className="aspect-[3/4] w-80 rounded-xl bg-slate-800" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-3/4 rounded bg-slate-800" />
                  <div className="h-4 w-1/2 rounded bg-slate-800" />
                  <div className="h-4 w-1/3 rounded bg-slate-800" />
                  <div className="h-20 rounded bg-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !book) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="text-center">
            <p className="text-xl text-red-400">Failed to load book details.</p>
            <Link to={ROUTES.BOOKS} className="mt-4 inline-block text-violet-400 hover:underline">Back to Books</Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  const inWishlist = isInWishlist(book.id)

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link to={ROUTES.BOOKS} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-violet-400 transition-colors">
            <FaArrowLeft /> Back to Books
          </Link>

          <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/350x500?text=No+Cover' }}
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { addItem(book); toast.success('Added to cart') }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={() => inWishlist ? removeWishlist(book.id) : addWishlist(book)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${inWishlist ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-slate-700 text-gray-300 hover:border-red-500/50 hover:text-red-400'}`}>
                  <FaHeart />
                </button>
              </div>
              <div className="mt-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <p className="text-3xl font-bold text-violet-400">{formatCurrency(book.price)}</p>
                {book.averageRating > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" size={14} />
                      <span className="text-sm font-medium text-white">{book.averageRating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({book.ratingsCount} ratings)</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-bold text-white">{book.title}</h1>
              <p className="mt-2 text-lg text-gray-400">{book.authors?.join(', ')}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaUser className="text-blue-400" />
                  <div><p className="text-xs text-gray-500">Author</p><p className="text-sm text-white">{book.authors?.[0] || 'Unknown'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaBuilding className="text-cyan-400" />
                  <div><p className="text-xs text-gray-500">Publisher</p><p className="text-sm text-white">{book.publisher}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaCalendar className="text-green-400" />
                  <div><p className="text-xs text-gray-500">Published</p><p className="text-sm text-white">{book.publishedDate}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaFileAlt className="text-purple-400" />
                  <div><p className="text-xs text-gray-500">Pages</p><p className="text-sm text-white">{book.pageCount || 'N/A'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaLanguage className="text-orange-400" />
                  <div><p className="text-xs text-gray-500">Language</p><p className="text-sm text-white">{book.language?.toUpperCase()}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaBook className="text-pink-400" />
                  <div><p className="text-xs text-gray-500">Categories</p><p className="text-sm text-white">{book.categories?.slice(0, 2).join(', ') || 'General'}</p></div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold text-white">Description</h2>
                <p className="leading-relaxed text-gray-400">{book.description}</p>
              </div>

              <div className="mt-12 border-t border-slate-800 pt-8">
                <h2 className="mb-6 text-xl font-bold text-white">Reviews</h2>
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                  <ReviewList productId={id} refreshKey={reviewRefreshKey} />
                  <ReviewForm productId={id} onReviewAdded={() => setReviewRefreshKey(k => k + 1)} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default BookDetails
