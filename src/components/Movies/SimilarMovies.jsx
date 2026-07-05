import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { Link } from "react-router-dom";

function SimilarMovies({ movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-900 pt-12">
      <h2 className="text-2xl font-black text-white tracking-tight mb-6">
        Similar Movies You Might Like
      </h2>
      
      {/* Responsive grid for movie cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.slice(0, 5).map((simMovie) => (
          <Link 
            to={`/movie/${simMovie.id}`} 
            key={simMovie.id} 
            className="group cursor-pointer space-y-2 block"
          >
            {/* Poster Wrapper with Zoom effect */}
            <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 shadow-md">
              <img
                src={
                  simMovie.poster_path 
                    ? `${IMAGE_BASE_URL}${simMovie.poster_path}` 
                    : "https://placehold.co/500x750?text=No+Image"
                }
                alt={simMovie.title}
                className="w-full h-64 object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            
            {/* Movie Title */}
            <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-violet-400 transition">
              {simMovie.title}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SimilarMovies;