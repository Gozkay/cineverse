import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'

function MangaCard({ manga, index = 0 }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(manga.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 transition-all duration-300 hover:ring-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10"
    >
      <Link to={ROUTES.MANGA_DETAIL(manga.id)} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          <img
            src={manga.image}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {manga.type && (
            <span className="absolute left-2 top-2 rounded-md bg-pink-500/80 px-2 py-0.5 text-[10px] font-medium text-white">{manga.type}</span>
          )}
        </div>
      </Link>

      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={(e) => { e.preventDefault(); inWishlist ? removeWishlist(manga.id) : addWishlist(manga) }}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-slate-800/80 text-white hover:bg-red-500/80'}`}
        >
          <FaHeart />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); addItem(manga) }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-white transition-all hover:bg-pink-500/80"
        >
          <FaShoppingCart />
        </button>
      </div>

      <div className="p-4">
        <Link to={ROUTES.MANGA_DETAIL(manga.id)}>
          <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-pink-400">{manga.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-gray-400">{manga.authors?.[0] || 'Unknown'}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-pink-400">{formatCurrency(manga.price)}</span>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" size={10} />
            <span className="text-xs text-gray-400">{manga.score || 'N/A'}</span>
          </div>
        </div>
        {manga.chapters > 0 && (
          <p className="mt-1 text-[10px] text-gray-500">{manga.chapters} chapters</p>
        )}
      </div>
    </motion.div>
  )
}

export default MangaCard
