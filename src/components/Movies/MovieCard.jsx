import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";

import { IMAGE_BASE_URL } from "@/constants/tmdb";


function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
        className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg hover:shadow-violet-500/20"
      >
        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={poster}
            alt={movie.title}
            className="h-[380px] w-full object-cover transition duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 transition duration-300 group-hover:opacity-100" />

          {/* Rating */}
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-black">
            <FaStar />
            {movie.vote_average.toFixed(1)}
          </div>

          {/* Hover Buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => e.preventDefault()}
              className="rounded-full bg-red-500 p-3 text-white transition hover:scale-110"
            >
              <FaHeart />
            </button>

            <button
              onClick={(e) => e.preventDefault()}
              className="rounded-full bg-violet-600 p-3 text-white transition hover:scale-110 hover:bg-violet-700"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-5">
          <h3 className="line-clamp-1 text-lg font-bold text-white">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>
                {movie.release_date
                  ? movie.release_date.split("-")[0]
                  : "N/A"}
              </span>
            </div>

            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400">
              Movie
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-violet-400">
              ₦3,500
            </span>

            <button
              onClick={(e) => e.preventDefault()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default MovieCard;