import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaFilm, FaBook, FaDragon } from 'react-icons/fa'
import { FaMasksTheater } from 'react-icons/fa6'
import MainLayout from '@/components/layout/MainLayout'
import { useMovieSearch } from '@/hooks/useSearch'
import { useBookSearch } from '@/hooks/useBooks'
import { useMangaSearch } from '@/hooks/useManga'
import { useComicSearch } from '@/hooks/useComics'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { IMAGE_BASE_URL } from '@/constants/tmdb'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: movies, isLoading: moviesLoading } = useMovieSearch(query)
  const { data: books, isLoading: booksLoading } = useBookSearch(query)
  const { data: manga, isLoading: mangaLoading } = useMangaSearch(query)
  const { data: comics, isLoading: comicsLoading } = useComicSearch(query)

  const isLoading = moviesLoading || booksLoading || mangaLoading || comicsLoading
  const isEmpty = query && !isLoading && !movies?.length && !books?.length && !manga?.length && !comics?.length

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Search Results</h1>
            <p className="mt-1 text-gray-400">{query ? `Showing results for "${query}"` : 'Enter a search term to find products'}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-slate-800/50">
                  <div className="aspect-[3/4] rounded-t-xl bg-slate-700" />
                  <div className="space-y-2 p-4"><div className="h-3 w-3/4 rounded bg-slate-700" /><div className="h-2 w-1/2 rounded bg-slate-700" /></div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FaSearch className="mb-4 text-5xl text-gray-700" />
              <h2 className="mb-2 text-xl font-semibold text-white">No results found</h2>
              <p className="text-gray-400">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-10">
              {movies?.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaFilm className="text-red-400" /><h2 className="text-lg font-semibold text-white">Movies</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {movies.slice(0, 10).map((movie) => (
                      <Link key={movie.id} to={ROUTES.MOVIE_DETAIL(movie.id)} className="group overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 hover:ring-red-500/50 transition-all">
                        <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                          <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x400?text=No'} alt={movie.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="p-2"><p className="line-clamp-1 text-xs font-medium text-white">{movie.title}</p><p className="text-[10px] text-gray-500">{movie.release_date?.slice(0, 4)}</p></div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              {books?.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaBook className="text-blue-400" /><h2 className="text-lg font-semibold text-white">Books</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {books.slice(0, 10).map((book) => (
                      <Link key={book.id} to={ROUTES.BOOK_DETAIL(book.id)} className="group overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 hover:ring-blue-500/50 transition-all">
                        <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                          <img src={book.image} alt={book.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                        </div>
                        <div className="p-2"><p className="line-clamp-1 text-xs font-medium text-white">{book.title}</p><p className="text-[10px] text-gray-500">{formatCurrency(book.price)}</p></div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              {manga?.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaDragon className="text-pink-400" /><h2 className="text-lg font-semibold text-white">Manga</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {manga.slice(0, 10).map((m) => (
                      <Link key={m.id} to={ROUTES.MANGA_DETAIL(m.id)} className="group overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 hover:ring-pink-500/50 transition-all">
                        <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                          <img src={m.image} alt={m.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                        </div>
                        <div className="p-2"><p className="line-clamp-1 text-xs font-medium text-white">{m.title}</p><p className="text-[10px] text-gray-500">{formatCurrency(m.price)}</p></div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              {comics?.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaMasksTheater className="text-emerald-400" /><h2 className="text-lg font-semibold text-white">Comics</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {comics.slice(0, 10).map((comic) => (
                      <Link key={comic.id} to={ROUTES.COMIC_DETAIL(comic.id)} className="group overflow-hidden rounded-xl bg-slate-900/50 ring-1 ring-slate-800 hover:ring-emerald-500/50 transition-all">
                        <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                          <img src={comic.image} alt={comic.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No' }} />
                        </div>
                        <div className="p-2"><p className="line-clamp-1 text-xs font-medium text-white">{comic.title}</p><p className="text-[10px] text-gray-500">{formatCurrency(comic.price)}</p></div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Search
