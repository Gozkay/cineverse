import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

const detailRoutes = {
  movie: ROUTES.MOVIE_DETAIL,
  book: ROUTES.BOOK_DETAIL,
  manga: ROUTES.MANGA_DETAIL,
  comic: ROUTES.COMIC_DETAIL,
}

function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const getRoute = (item) => {
    const routeFn = detailRoutes[item.category]
    return routeFn ? routeFn(item.id) : '#'
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="text-white">My</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Wishlist</span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
            </div>
            <div className="flex items-center gap-4">
              {items.length > 0 && (
                <button onClick={clearWishlist} className="text-sm text-gray-500 hover:text-red-400 transition-colors">Clear All</button>
              )}
              <Link to={ROUTES.MOVIES} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
                <FaArrowLeft className="transition-transform group-hover:-translate-x-0.5" /> Browse
              </Link>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 inline-flex rounded-2xl bg-slate-800/50 p-6 ring-1 ring-white/5">
                <FaHeart className="text-4xl text-gray-600" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Your wishlist is empty</h2>
              <p className="mb-6 text-gray-500">Save items you love to your wishlist.</p>
              <Link to={ROUTES.MOVIES} className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1"
                >
                  <Link to={getRoute(item)} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                      <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                    </div>
                  </Link>
                  <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 md:translate-x-4 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
                    <button onClick={() => removeItem(item.id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-500 shadow-lg shadow-red-500/25">
                      <FaTrash size={12} />
                    </button>
                    <button onClick={() => { addItem(item); removeItem(item.id); toast.success(`Moved "${item.title}" to cart`) }} className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/80 backdrop-blur-sm text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25">
                      <FaShoppingCart size={12} />
                    </button>
                  </div>
                  <div className="p-3">
                    <Link to={getRoute(item)}>
                      <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-violet-400 transition-colors">{item.title}</h3>
                    </Link>
                    <p className="mt-1 text-xs capitalize text-gray-500">{item.category}</p>
                    <p className="mt-1 text-sm font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">{formatCurrency(item.price)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Wishlist
