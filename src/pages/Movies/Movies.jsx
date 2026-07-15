import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaFilm, FaSearch, FaTimes } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { TrendingMovies } from '@/components/Movies'
import { useTrendingMovies } from '@/hooks/useTrendingMovies'
import { useMovieSearch } from '@/hooks/useSearch'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { IMAGE_BASE_URL } from '@/constants/tmdb'

function Movies() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const { data: searchResults, isLoading: searchLoading } = useMovieSearch(searchQuery)
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-slate-950">
        <div className="relative overflow-hidden bg-gradient-to-b from-red-900/20 to-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-4 inline-flex rounded-2xl bg-red-500/10 p-4">
                <FaFilm className="text-4xl text-red-400" />
              </div>
              <h1 className="mb-3 text-5xl font-black text-white">Movies Collection</h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">Discover trending movies and search through thousands of titles.</p>
              
              <div className="mx-auto max-w-xl">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true) }}
                    placeholder="Search movies..."
                    className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-12 pr-10 text-sm text-white outline-none focus:border-red-500 transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setShowSearch(false) }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {showSearch && searchQuery ? (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">Search Results for "{searchQuery}"</h2>
              {searchLoading ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-slate-800/50">
                      <div className="aspect-[3/4] rounded-t-xl bg-slate-700" />
                      <div className="space-y-2 p-4"><div className="h-3 w-3/4 rounded bg-slate-700" /><div className="h-2 w-1/2 rounded bg-slate-700" /></div>
                    </div>
                  ))}
                </div>
              ) : searchResults?.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {searchResults.map((movie, i) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(ROUTES.MOVIE_DETAIL(movie.id))}
                      className="group cursor-pointer overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 transition-all duration-300 hover:ring-red-500/50"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                        <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x400?text=No+Poster'} alt={movie.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                      </div>
                      <div className="p-3">
                        <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
                        <p className="mt-1 text-xs text-gray-500">{movie.release_date?.slice(0, 4) || 'N/A'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No movies found for "{searchQuery}"</p>
              )}
            </div>
          ) : (
            <TrendingMovies />
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Movies
