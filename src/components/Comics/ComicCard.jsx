import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'

function ComicCard({ comic, index = 0 }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(comic.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
    >
      <Link to={ROUTES.COMIC_DETAIL(comic.id)} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
          <img
            src={comic.image}
            alt={comic.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[1deg]"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 md:translate-x-4 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); inWishlist ? removeWishlist(comic.id) : addWishlist(comic) }}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all backdrop-blur-sm ${
            inWishlist
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'bg-white/10 text-white hover:bg-red-500/80 hover:shadow-lg hover:shadow-red-500/25'
          }`}
        >
          <FaHeart />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(comic); toast.success(`Added "${comic.title}" to cart`) }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-emerald-500/80 hover:shadow-lg hover:shadow-emerald-500/25 backdrop-blur-sm"
        >
          <FaShoppingCart />
        </button>
      </div>

      <div className="p-4">
        <Link to={ROUTES.COMIC_DETAIL(comic.id)}>
          <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-emerald-400">{comic.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-gray-500">{comic.authors?.[0] || 'Unknown'}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">{formatCurrency(comic.price)}</span>
          {comic.firstPublishYear && (
            <span className="text-[10px] text-gray-600">{comic.firstPublishYear}</span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); addItem(comic); toast.success(`Added "${comic.title}" to cart`) }}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-1.5 text-[11px] font-semibold text-white transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 md:hidden"
        >
          <FaShoppingCart className="inline mr-1" size={10} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

ComicCard.propTypes = {
  comic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number,
    authors: PropTypes.arrayOf(PropTypes.string),
    firstPublishYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  index: PropTypes.number,
}

export default memo(ComicCard)
