import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/utils/formatCurrency";
import toast from "react-hot-toast";

function MovieCard({ movie, index = 0 }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();

  const price = movie.price || (parseInt(String(movie.id).slice(-8), 36) % 2000) + 2000;
  const movieProduct = {
    id: movie.id,
    title: movie.title,
    price,
    image: poster,
    category: 'movie',
    rating: movie.vote_average,
  };

  const inWishlist = isInWishlist(movie.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-red-500/40 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
    >
      <Link to={ROUTES.MOVIE_DETAIL(movie.id)} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
          <img
            src={poster}
            alt={movie.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[1deg]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 px-2 py-0.5 text-xs font-bold text-black shadow-lg">
            <FaStar size={10} />
            {movie.vote_average?.toFixed(1)}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 md:translate-x-4 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); inWishlist ? removeWishlist(movie.id) : addWishlist(movieProduct); }}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all backdrop-blur-sm ${
            inWishlist
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'bg-white/10 text-white hover:bg-red-500/80 hover:shadow-lg hover:shadow-red-500/25'
          }`}
        >
          <FaHeart />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(movieProduct); toast.success(`Added "${movie.title}" to cart`); }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-red-500/80 hover:shadow-lg hover:shadow-red-500/25 backdrop-blur-sm"
        >
          <FaShoppingCart />
        </button>
      </div>

      <div className="p-4">
        <Link to={ROUTES.MOVIE_DETAIL(movie.id)}>
          <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-red-400">{movie.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-gray-500">
          {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">{formatCurrency(price)}</span>
          <button
            onClick={(e) => { e.preventDefault(); addItem(movieProduct); toast.success(`Added "${movie.title}" to cart`); }}
            className="rounded-lg bg-red-600/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer md:hidden"
          >
            <FaShoppingCart className="inline mr-1" size={10} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;
