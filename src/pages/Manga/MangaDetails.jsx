import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaShoppingCart, FaHeart, FaStar, FaDragon, FaUser, FaBook, FaLayerGroup, FaStar as FaStarSolid } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useMangaDetails } from '@/hooks/useManga'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

function MangaDetails() {
  const { id } = useParams()
  const { data: manga, isLoading, error } = useMangaDetails(id)
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

  if (error || !manga) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="text-center">
            <p className="text-xl text-red-400">Failed to load manga details.</p>
            <Link to={ROUTES.MANGA} className="mt-4 inline-block text-pink-400 hover:underline">Back to Manga</Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  const inWishlist = isInWishlist(manga.id)

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link to={ROUTES.MANGA} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors">
            <FaArrowLeft /> Back to Manga
          </Link>

          <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
                <img src={manga.image} alt={manga.title} className="w-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/350x500?text=No+Cover' }} />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { addItem(manga); toast.success('Added to cart') }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white hover:bg-pink-500 transition-colors">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={() => inWishlist ? removeWishlist(manga.id) : addWishlist(manga)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${inWishlist ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-slate-700 text-gray-300 hover:border-red-500/50 hover:text-red-400'}`}>
                  <FaHeart />
                </button>
              </div>
              <div className="mt-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <p className="text-3xl font-bold text-pink-400">{formatCurrency(manga.price)}</p>
                {manga.score > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" size={14} />
                      <span className="text-sm font-medium text-white">{manga.score}</span>
                    </div>
                    <span className="text-xs text-gray-500">({manga.scoredBy} votes)</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-bold text-white">{manga.title}</h1>
              {manga.titleJapanese && <p className="mt-1 text-gray-500">{manga.titleJapanese}</p>}
              <p className="mt-2 text-gray-400">{manga.authors?.join(', ')}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaUser className="text-pink-400" />
                  <div><p className="text-xs text-gray-500">Author</p><p className="text-sm text-white">{manga.authors?.[0] || 'Unknown'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaLayerGroup className="text-purple-400" />
                  <div><p className="text-xs text-gray-500">Type</p><p className="text-sm text-white">{manga.type || 'Manga'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaBook className="text-indigo-400" />
                  <div><p className="text-xs text-gray-500">Chapters</p><p className="text-sm text-white">{manga.chapters || 'N/A'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaStarSolid className="text-yellow-400" />
                  <div><p className="text-xs text-gray-500">Rank</p><p className="text-sm text-white">#{manga.rank || 'N/A'}</p></div>
                </div>
              </div>

              {manga.genres?.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 text-lg font-semibold text-white">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre) => (
                      <span key={genre} className="rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-400 ring-1 ring-pink-500/20">{genre}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold text-white">Synopsis</h2>
                <p className="leading-relaxed text-gray-400">{manga.description}</p>
              </div>

              {manga.status && (
                <div className="mt-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <span className={`text-sm font-medium ${manga.status === 'publishing' ? 'text-green-400' : 'text-yellow-400'}`}>{manga.status}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Published</span>
                    <span className="text-sm text-white">{manga.published}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default MangaDetails
