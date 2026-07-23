import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaFilm, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { TrendingMovies } from '@/components/Movies'
import { useMovieSearch } from '@/hooks/useSearch'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { IMAGE_BASE_URL } from '@/constants/tmdb'

function Movies() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [page, setPage] = useState(1)
  const { data: searchData, isLoading: searchLoading } = useMovieSearch(searchQuery, page)
  const searchResults = searchData?.results || []
  const totalPages = searchData?.totalPages || 0
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-slate-950">
        <div className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
          />
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 p-4 ring-1 ring-red-500/20 backdrop-blur-sm">
                <FaFilm className="text-4xl text-red-400" />
              </div>
              <h1 className="mb-3 text-4xl sm:text-5xl lg:text-6xl font-black">
                <span className="text-white">Movies</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  Collection
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500">
                Discover trending movies and search through thousands of titles.
              </p>

              <div className="mx-auto max-w-xl">
                <div className="group relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true) }}
                    placeholder="Search movies..."
                    className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 pl-12 pr-10 text-sm text-white outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setShowSearch(false) }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
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
                    <div key={i} className="animate-pulse rounded-2xl bg-slate-900/40 ring-1 ring-white/5">
                      <div className="aspect-[3/4] rounded-t-2xl bg-slate-800/80 shimmer" />
                      <div className="space-y-2 p-4"><div className="h-3 w-3/4 rounded-full bg-slate-800/80 shimmer" /><div className="h-2 w-1/2 rounded-full bg-slate-800/80 shimmer" /></div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {searchResults.map((movie, i) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(ROUTES.MOVIE_DETAIL(movie.id))}
                        className="group cursor-pointer overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-red-500/40 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                          <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                          <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x400?text=No+Poster'} alt={movie.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" />
                        </div>
                        <div className="p-3">
                          <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
                          <p className="mt-1 text-xs text-gray-500">{movie.release_date?.slice(0, 4) || 'N/A'}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaChevronLeft size={12} /> Previous
                      </button>
                      <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next <FaChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </>
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
