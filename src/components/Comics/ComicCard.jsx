import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'

function ComicCard({ comic, index = 0 }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(comic.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 transition-all duration-300 hover:ring-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
    >
      <Link to={ROUTES.COMIC_DETAIL(comic.id)} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          <img
            src={comic.image}
            alt={comic.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={(e) => { e.preventDefault(); inWishlist ? removeWishlist(comic.id) : addWishlist(comic) }}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-slate-800/80 text-white hover:bg-red-500/80'}`}
        >
          <FaHeart />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); addItem(comic) }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-white transition-all hover:bg-emerald-500/80"
        >
          <FaShoppingCart />
        </button>
      </div>

      <div className="p-4">
        <Link to={ROUTES.COMIC_DETAIL(comic.id)}>
          <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-emerald-400">{comic.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-gray-400">{comic.authors?.[0] || 'Unknown'}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-emerald-400">{formatCurrency(comic.price)}</span>
          {comic.firstPublishYear && (
            <span className="text-[10px] text-gray-500">{comic.firstPublishYear}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ComicCard
