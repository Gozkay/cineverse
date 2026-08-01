import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaFilm, FaBook, FaDragon } from 'react-icons/fa'
import { FaMasksTheater, FaWandMagicSparkles } from 'react-icons/fa6'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import EmptyState from '@/components/ui/EmptyState'
import { aiSearchQuery } from '@/services/ai'
import { useMovieSearch } from '@/hooks/useSearch'
import { useBookSearch } from '@/hooks/useBooks'
import { useMangaSearch } from '@/hooks/useManga'
import { useComicSearch } from '@/hooks/useComics'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { IMAGE_BASE_URL } from '@/constants/tmdb'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: movies, isLoading: moviesLoading } = useMovieSearch(query)
  const { data: books, isLoading: booksLoading } = useBookSearch(query)
  const { data: manga, isLoading: mangaLoading } = useMangaSearch(query)
  const { data: comics, isLoading: comicsLoading } = useComicSearch(query)

  const isLoading = moviesLoading || booksLoading || mangaLoading || comicsLoading
  const isEmpty = query && !isLoading && !movies?.length && !books?.length && !manga?.length && !comics?.length

  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(false)

  const runAiSearch = useCallback(async () => {
    if (!query) return
    setAiLoading(true)
    setAiError(false)
    try {
      const data = await aiSearchQuery(query)
      setAiResult(data)
    } catch {
      setAiError(true)
    } finally {
      setAiLoading(false)
    }
  }, [query])

  useEffect(() => {
    setAiResult(null)
    if (isEmpty) runAiSearch()
  }, [query, isEmpty, runAiSearch])

  const applyKeyword = (keyword) => setSearchParams({ q: keyword })

  const categoryRoutes = { movie: ROUTES.MOVIES, book: ROUTES.BOOKS, manga: ROUTES.MANGA, comic: ROUTES.COMICS }

  return (
    <MainLayout>
      <Seo title="Search" noIndex />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="text-white">Search</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Results</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">{query ? `Showing results for "${query}"` : 'Enter a search term to find products'}</p>
          </div>

          {(aiLoading || aiResult || aiError) && query && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-900/50 to-fuchsia-500/10 p-5">
              <div className="flex items-center gap-2">
                <FaWandMagicSparkles className="text-violet-400" />
                <span className="text-sm font-semibold text-white">AI Search Assistant</span>
              </div>
              {aiLoading ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  Interpreting your query...
                </div>
              ) : aiError ? (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-400">AI search is unavailable right now.</p>
                  <button onClick={runAiSearch} className="text-xs font-medium text-violet-400 hover:text-violet-300">Retry</button>
                </div>
              ) : aiResult ? (
                <>
                  {aiResult.explanation && <p className="mt-3 text-sm text-gray-300">{aiResult.explanation}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {aiResult.keywords?.filter(Boolean).map((k) => (
                      <button key={k} onClick={() => applyKeyword(k)} className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-300 ring-1 ring-violet-500/30 hover:bg-violet-500/25 transition-colors">
                        {k}
                      </button>
                    ))}
                    {aiResult.category && categoryRoutes[aiResult.category] && (
                      <Link
                        to={categoryRoutes[aiResult.category]}
                        className="ml-auto rounded-full bg-slate-800 px-3 py-1 text-xs text-gray-400 ring-1 ring-slate-700 hover:text-white transition-colors"
                      >
                        Browse {aiResult.category}s
                      </Link>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-900/40 ring-1 ring-white/5">
                  <div className="aspect-[3/4] rounded-t-2xl bg-slate-800/80 shimmer" />
                  <div className="space-y-2 p-4"><div className="h-3 w-3/4 rounded-full bg-slate-800/80 shimmer" /><div className="h-2 w-1/2 rounded-full bg-slate-800/80 shimmer" /></div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <EmptyState type="search" title="No results found" message="Try a different search term" />
          ) : (
            <motion.div initial={{ opacity: 1 }} className="space-y-12">
              {movies?.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 ring-1 ring-red-500/20">
                      <FaFilm className="text-sm text-red-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Movies</h2>
                    <span className="text-xs text-gray-600">{movies.length} results</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {movies.slice(0, 10).map((movie, i) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link to={ROUTES.MOVIE_DETAIL(movie.id)} className="group block overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-red-500/40 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1">
                          <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                            <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                            <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x400?text=No'} alt={movie.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-medium text-white">{movie.title}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{movie.release_date?.slice(0, 4)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
              {books?.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 ring-1 ring-violet-500/20">
                      <FaBook className="text-sm text-violet-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Books</h2>
                    <span className="text-xs text-gray-600">{books.length} results</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {books.slice(0, 10).map((book, i) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link to={ROUTES.BOOK_DETAIL(book.id)} className="group block overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1">
                          <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                            <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                            <img src={book.image} alt={book.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-medium text-white">{book.title}</p>
                            <p className="mt-0.5 text-xs font-medium text-violet-400">{formatCurrency(book.price)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
              {manga?.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 ring-1 ring-pink-500/20">
                      <FaDragon className="text-sm text-pink-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Manga</h2>
                    <span className="text-xs text-gray-600">{manga.length} results</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {manga.slice(0, 10).map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link to={ROUTES.MANGA_DETAIL(m.id)} className="group block overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1">
                          <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                            <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                            <img src={m.image} alt={m.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-medium text-white">{m.title}</p>
                            <p className="mt-0.5 text-xs font-medium text-pink-400">{formatCurrency(m.price)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
              {comics?.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-1 ring-emerald-500/20">
                      <FaMasksTheater className="text-sm text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Comics</h2>
                    <span className="text-xs text-gray-600">{comics.length} results</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {comics.slice(0, 10).map((comic, i) => (
                      <motion.div
                        key={comic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link to={ROUTES.COMIC_DETAIL(comic.id)} className="group block overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
                          <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                            <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
                            <img src={comic.image} alt={comic.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-medium text-white">{comic.title}</p>
                            <p className="mt-0.5 text-xs font-medium text-emerald-400">{formatCurrency(comic.price)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Search
