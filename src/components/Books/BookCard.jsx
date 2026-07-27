import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'

function BookCard({ book, index = 0 }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(book.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1"
    >
      <Link to={ROUTES.BOOK_DETAIL(book.id)} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
          <img
            src={book.image}
            alt={book.title}
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
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); inWishlist ? removeWishlist(book.id) : addWishlist(book) }}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all backdrop-blur-sm ${
            inWishlist
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'bg-white/10 text-white hover:bg-red-500/80 hover:shadow-lg hover:shadow-red-500/25'
          }`}
        >
          <FaHeart />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(book); toast.success(`Added "${book.title}" to cart`) }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-violet-500/80 hover:shadow-lg hover:shadow-violet-500/25 backdrop-blur-sm"
        >
          <FaShoppingCart />
        </button>
      </div>

      <div className="p-4">
        <Link to={ROUTES.BOOK_DETAIL(book.id)}>
          <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-violet-400">{book.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-gray-500">{book.authors?.[0] || 'Unknown Author'}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">{formatCurrency(book.price)}</span>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" size={10} />
            <span className="text-xs text-gray-500">{book.averageRating || 'N/A'}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); addItem(book); toast.success(`Added "${book.title}" to cart`) }}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-1.5 text-[11px] font-semibold text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-lg hover:shadow-violet-500/25 md:hidden"
        >
          <FaShoppingCart className="inline mr-1" size={10} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number,
    authors: PropTypes.arrayOf(PropTypes.string),
    averageRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  index: PropTypes.number,
}

export default memo(BookCard)
