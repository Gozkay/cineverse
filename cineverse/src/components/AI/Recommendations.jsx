import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFilm, FaBook, FaDragon, FaSpinner } from 'react-icons/fa'
import { FaMasksTheater, FaWandMagicSparkles } from 'react-icons/fa6'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useTrendingMovies } from '@/hooks/useTrendingMovies'
import { useBooks } from '@/hooks/useBooks'
import { useManga } from '@/hooks/useManga'
import { useComics } from '@/hooks/useComics'
import { aiRecommend } from '@/services/ai'
import MovieCard from '@/components/Movies/MovieCard'
import BookCard from '@/components/Books/BookCard'
import MangaCard from '@/components/Manga/MangaCard'
import ComicCard from '@/components/Comics/ComicCard'

const categoryIcons = {
  movie: <FaFilm className="text-red-400" size={16} />,
  book: <FaBook className="text-violet-400" size={16} />,
  manga: <FaDragon className="text-pink-400" size={16} />,
  comic: <FaMasksTheater className="text-emerald-400" size={16} />,
}

const categoryGradients = {
  movie: 'from-red-500 to-orange-500',
  book: 'from-violet-500 to-fuchsia-500',
  manga: 'from-pink-500 to-rose-500',
  comic: 'from-emerald-500 to-teal-500',
}

function matchItem(item, catalog) {
  if (!item || !catalog) return null
  const title = String(item.title || '').toLowerCase()
  if (!title) return null
  return catalog.find((c) => String(c.title || '').toLowerCase().includes(title))
}

function Recommendations() {
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [picks, setPicks] = useState(null)
  const [loading, setLoading] = useState(false)

  const { data: movies } = useTrendingMovies()
  const { data: books } = useBooks('fiction')
  const { data: manga } = useManga(1)
  const { data: comics } = useComics('comics')

  const interests = useMemo(() => {
    const seen = new Set()
    return [...wishlistItems, ...cartItems]
      .filter((i) => i?.title && !seen.has(i.title))
      .map((i) => ({ title: i.title, category: i.category }))
      .slice(0, 5)
  }, [cartItems, wishlistItems])

  if (!interests.length) return null

  const runRecommendations = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await aiRecommend(interests)
      setPicks(result)
    } catch {
      setPicks([])
    } finally {
      setLoading(false)
    }
  }

  const catalogByCategory = { movie: movies, book: books, manga, comic: comics }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">Powered by AI</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-1">
              <span className="text-white">For</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">You</span>
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Based on your {interests.length === 1 ? 'interest' : 'interests'}: {interests.map((i) => i.title).join(', ')}
            </p>
          </div>
          {!picks && (
            <button
              onClick={runRecommendations}
              disabled={loading}
              className="group flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/20 hover:text-violet-200 disabled:opacity-60"
            >
              {loading ? <FaSpinner className="animate-spin" size={13} /> : <FaWandMagicSparkles size={13} />}
              {loading ? 'Generating...' : 'Generate with AI'}
            </button>
          )}
        </div>

        {!picks ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 ring-1 ring-violet-500/20">
              <FaWandMagicSparkles className="text-2xl text-violet-400" />
            </div>
            <p className="max-w-sm text-sm text-gray-500">
              Let AI pick your next favorite. We'll use your saved items to recommend movies, books, manga, and comics you'll love.
            </p>
          </div>
        ) : picks.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-10 text-center text-sm text-gray-400">
            Couldn't generate recommendations right now — try again in a moment.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {picks.map((pick, i) => {
              const matched = matchItem(pick, catalogByCategory[pick.category] || [])
              const Icon = categoryIcons[pick.category] || categoryIcons.movie
              const gradient = categoryGradients[pick.category] || categoryGradients.movie

              if (matched && pick.category === 'movie') return <MovieCard key={pick.title + i} movie={matched} />
              if (matched && pick.category === 'book') return <BookCard key={pick.title + i} book={matched} index={i} />
              if (matched && pick.category === 'manga') return <MangaCard key={pick.title + i} manga={matched} index={i} />
              if (matched && pick.category === 'comic') return <ComicCard key={pick.title + i} comic={matched} index={i} />

              return (
                <motion.div
                  key={pick.title + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    to={`/search?q=${encodeURIComponent(pick.title)}`}
                    className="group flex h-full flex-col rounded-2xl bg-slate-900/40 p-5 ring-1 ring-white/5 transition-all duration-500 hover:-translate-y-1 hover:ring-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10"
                  >
                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}/20 ring-1 ring-white/10`}>
                      {Icon}
                    </div>
                    <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-violet-400">
                      {pick.title}
                    </h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500">{pick.reason}</p>
                    <span className="mt-4 text-xs font-medium capitalize text-violet-400">
                      {pick.category} &rarr;
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Recommendations
