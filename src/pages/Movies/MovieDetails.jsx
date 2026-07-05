import { useParams } from "react-router-dom";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from "@/constants/tmdb";
import { 
  FaStar, 
  FaClock, 
  FaCalendarAlt, 
  FaGlobe, 
  FaPlay, 
  FaHeart, 
  FaShoppingCart, 
  FaStore 
} from "react-icons/fa";

// Import your local fallback image asset
import Herobg from "@/assets/images/hero-bg.png";

function MovieDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useMovieDetails(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto"></div>
          <p className="text-slate-400 font-medium">Loading movie specs...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500 font-semibold">
        Something went wrong. Could not resolve movie data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      
      {/* 1. Cinematic Hero Backdrop Banner */}
      <div className="relative h-[480px] w-full overflow-hidden bg-slate-900">
        <img
          src={data.backdrop_path ? `${BACKDROP_BASE_URL}${data.backdrop_path}` : Herobg}
          alt={data.title}
          className="h-full w-full object-cover object-center opacity-40"
          onError={(e) => { e.target.src = Herobg; }}
        />
        {/* Tailwind v4 Solid Linear Gradient Layer */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(to top, #020617 0%, rgba(2, 6, 23, 0.4) 70%, transparent 100%)' 
          }}
        />
      </div>

      {/* 2. Main Presentational Details Block Wrapper */}
      <div className="mx-auto max-w-7xl px-6 relative z-20 -mt-44">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          {/* Movie Poster Cover */}
          <div className="w-64 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
            <img
              src={data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : "https://placehold.co/500x750?text=No+Poster"}
              alt={`${data.title} Poster`}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Movie Meta Content & Actions */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {data.title}
              </h1>
              
              {/* API Info Row */}
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm font-medium text-slate-300">
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <FaStar /> {data.vote_average ? data.vote_average.toFixed(1) : "0.0"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock /> {data.runtime ? `${data.runtime} min` : "N/A"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt /> {data.release_date ? data.release_date.split("-")[0] : "N/A"}
                </span>
                <span className="flex items-center gap-1.5 uppercase tracking-wider bg-slate-800/60 px-2 py-0.5 rounded text-xs text-slate-400">
                  <FaGlobe className="inline mr-0.5" /> {data.original_language}
                </span>
              </div>
            </div>

            {/* Genres Badges */}
            {data.genres && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                {data.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3.5 py-1 text-xs font-semibold text-violet-400 tracking-wide"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview / Summary Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-200">Overview</h3>
              <p className="max-w-3xl text-base leading-relaxed text-slate-400 font-normal">
                {data.overview || "No description available for this title."}
              </p>
            </div>

            {/* Action Buttons Hub */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200 shadow-md cursor-pointer">
                <FaPlay /> Watch Trailer
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white backdrop-blur-sm cursor-pointer">
                <FaHeart className="text-red-500" /> Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* 3. CineVerse Marketplace: Available From Sellers Section */}
        <div className="mt-16 border-t border-slate-900 pt-12">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-6">
            <FaStore className="text-violet-500" /> Available From Sellers
          </h2>
          
          <div className="grid gap-4 max-w-3xl">
            {/* Seller Option 1 - Official */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-violet-500/20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-600/20 text-violet-400 rounded-lg">
                  <FaStore />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base">CineVerse Store</h4>
                  <p className="text-xs text-violet-400/80 font-medium">Official Digital Copy</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-extrabold text-violet-400">₦8,500</span>
                <button className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-700 cursor-pointer">
                  <FaShoppingCart /> Buy Now
                </button>
              </div>
            </div>

            {/* Seller Option 2 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-800 text-slate-400 rounded-lg">
                  <FaStore />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm md:text-base">MovieHub Nigeria</h4>
                  <p className="text-xs text-slate-500 font-medium">Verified Merchant</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-extrabold text-slate-300">₦7,900</span>
                <button className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white cursor-pointer">
                  <FaShoppingCart /> Buy Now
                </button>
              </div>
            </div>

            {/* Seller Option 3 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-800 text-slate-400 rounded-lg">
                  <FaStore />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm md:text-base">Premium Seller</h4>
                  <p className="text-xs text-slate-500 font-medium">Top Rated Merchant</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-extrabold text-slate-300">₦9,000</span>
                <button className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white cursor-pointer">
                  <FaShoppingCart /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MovieDetailsPage;