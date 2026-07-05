import { motion } from "framer-motion";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl bg-slate-900"
    >
      <img
        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title}
        className="h-96 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold line-clamp-1">
          {movie.title}
        </h3>

        <p className="mt-2 text-yellow-400">
            ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </motion.div>
  );
}

export default MovieCard;