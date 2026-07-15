import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

function SimilarMovies({ movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      <h2 className="mb-8 text-2xl font-black">
        <span className="text-white">Similar</span>{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Movies</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.slice(0, 5).map((simMovie, i) => (
          <motion.div
            key={simMovie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={ROUTES.MOVIE_DETAIL(simMovie.id)} className="group block">
              <div className="overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 group-hover:ring-violet-500/40 group-hover:shadow-2xl group-hover:shadow-violet-500/10 group-hover:-translate-y-1">
                <div className="relative overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                  <img
                    src={simMovie.poster_path ? `${IMAGE_BASE_URL}${simMovie.poster_path}` : "https://placehold.co/500x750?text=No+Image"}
                    alt={simMovie.title}
                    className="w-full aspect-[3/4] object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
              <h4 className="mt-2.5 text-sm font-semibold text-slate-300 line-clamp-1 group-hover:text-violet-400 transition-colors">
                {simMovie.title}
              </h4>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SimilarMovies;
