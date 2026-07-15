import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaShoppingCart, FaHeart, FaUser, FaCalendar, FaLayerGroup, FaBookOpen } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import { searchComics } from '@/services/comics'
import toast from 'react-hot-toast'

function ComicDetails() {
  const { id } = useParams()
  const [comic, setComic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    async function fetchComic() {
      try {
        setLoading(true)
        const results = await searchComics(id.replace('comic_', ''))
        const found = results.find(r => r.id === id) || results[0]
        if (found) setComic(found)
        else setError('Comic not found')
      } catch (err) {
        setError('Failed to load comic details')
      } finally {
        setLoading(false)
      }
    }
    fetchComic()
  }, [id])

  if (loading) {
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
                  <div className="h-20 rounded bg-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !comic) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="text-center">
            <p className="text-xl text-red-400">{error || 'Comic not found'}</p>
            <Link to={ROUTES.COMICS} className="mt-4 inline-block text-emerald-400 hover:underline">Back to Comics</Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  const inWishlist = isInWishlist(comic.id)

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link to={ROUTES.COMICS} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
            <FaArrowLeft /> Back to Comics
          </Link>

          <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
                <img src={comic.image} alt={comic.title} className="w-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/350x500?text=No+Cover' }} />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { addItem(comic); toast.success('Added to cart') }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={() => inWishlist ? removeWishlist(comic.id) : addWishlist(comic)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${inWishlist ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-slate-700 text-gray-300 hover:border-red-500/50 hover:text-red-400'}`}>
                  <FaHeart />
                </button>
              </div>
              <div className="mt-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(comic.price)}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-bold text-white">{comic.title}</h1>
              <p className="mt-2 text-gray-400">{comic.authors?.join(', ')}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaUser className="text-emerald-400" />
                  <div><p className="text-xs text-gray-500">Author/Artist</p><p className="text-sm text-white">{comic.authors?.[0] || 'Unknown'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaCalendar className="text-cyan-400" />
                  <div><p className="text-xs text-gray-500">First Published</p><p className="text-sm text-white">{comic.firstPublishYear}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaLayerGroup className="text-purple-400" />
                  <div><p className="text-xs text-gray-500">Editions</p><p className="text-sm text-white">{comic.editionCount || 'N/A'}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <FaBookOpen className="text-orange-400" />
                  <div><p className="text-xs text-gray-500">Category</p><p className="text-sm text-white capitalize">{comic.subjects?.[0]?.replace(/_/g, ' ') || 'Comics'}</p></div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold text-white">Description</h2>
                <p className="leading-relaxed text-gray-400">{comic.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ComicDetails
