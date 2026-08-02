import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { BACKDROP_BASE_URL, IMAGE_BASE_URL } from "@/constants/tmdb";
import heroBg from "@/assets/images/hero-bg.png";
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatCurrency } from '@/utils/formatCurrency'
import PropTypes from 'prop-types';
import toast from 'react-hot-toast'

function MovieHero({ movie }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()
  const price = (parseInt(String(movie.id).slice(-8), 36) % 2500) + 1500
  const movieWithPrice = { ...movie, price, category: 'movie', image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null }
  const inWishlist = isInWishlist(movie.id)

  return (
    <section className="relative min-h-[500px] w-full overflow-hidden sm:h-[600px]">
      <img
        src={movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : heroBg}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => { e.target.src = heroBg; }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end gap-10 px-6 pb-16">
        <img
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : heroBg}
          alt={movie.title}
          className="hidden h-[420px] w-[280px] rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 md:block"
        />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-black text-white sm:text-5xl">
            {movie.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-400">
            <span className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-3 py-1 font-medium text-yellow-400">
              <FaStar className="text-yellow-400" size={14} />
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-slate-500">{movie.release_date?.split("-")[0]}</span>
            <span className="text-slate-500">{movie.runtime} min</span>
            <span className="rounded-lg bg-violet-500/10 px-3 py-1 font-medium text-violet-400">
              {formatCurrency(price)}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-sm">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-6 line-clamp-2 max-w-2xl text-base leading-7 text-slate-400 sm:mt-8 sm:line-clamp-3 sm:leading-8">
            {movie.overview}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-10">
            <button onClick={() => { addItem(movieWithPrice); toast.success('Added to cart') }} className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:from-violet-500 hover:to-fuchsia-500 overflow-hidden">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                <FaShoppingCart /> Buy Movie
              </span>
            </button>
            <button onClick={() => inWishlist ? removeWishlist(movie.id) : addWishlist(movieWithPrice)} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition-all duration-300 ${inWishlist ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-slate-300 backdrop-blur-sm hover:bg-white/10 hover:text-white'}`}>
              <FaHeart /> {inWishlist ? 'Saved' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

MovieHero.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
    backdrop_path: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number.isRequired,
    release_date: PropTypes.string,
    runtime: PropTypes.number,
    overview: PropTypes.string,
    genres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      })
    ),
  }),
};

export default MovieHero;
