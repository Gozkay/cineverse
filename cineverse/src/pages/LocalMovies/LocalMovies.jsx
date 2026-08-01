import { Link } from 'react-router-dom'
import { FaClapperboard } from 'react-icons/fa6'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import LocalMovieCard from '@/components/Seller/LocalMovieCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useLocalMovies } from '@/hooks/useLocalMovies'
import { ROUTES } from '@/constants/routes'

function LocalMovies() {
  const { data: movies, isLoading, error } = useLocalMovies(50)

  return (
    <MainLayout>
      <Seo title="Local Movies" description="Discover and buy local movies directly from Nigerian filmmakers and producers." />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 text-center">
            <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
              <FaClapperboard className="text-4xl text-amber-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black">
              <span className="text-white">Local</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Movies</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              Original films from local filmmakers and producers — buy a copy and support creators directly.
            </p>
            <Link to={ROUTES.BECOME_SELLER} className="mt-6 inline-block rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:opacity-90 transition-opacity">
              Are you a filmmaker? Sell your movie
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-slate-900/40 ring-1 ring-white/5">
                  <div className="aspect-[3/4] rounded-t-2xl bg-slate-800/80 shimmer" />
                  <div className="space-y-2 p-4"><div className="h-3 w-3/4 rounded-full bg-slate-800/80 shimmer" /><div className="h-2 w-1/2 rounded-full bg-slate-800/80 shimmer" /></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-gray-500">Could not load local movies. Please try again.</p>
          ) : movies.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500">No local movies yet — be the first creator to sell on CineVerse!</p>
            </div>
          ) : (
            <ScrollReveal>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {movies.map((movie, i) => (
                  <LocalMovieCard key={movie.id} movie={movie} index={i} />
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default LocalMovies
