import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import BookCard from '@/components/Books/BookCard'
import { useBooks } from '@/hooks/useBooks'
import { FaBook } from 'react-icons/fa'

const categories = ['fiction', 'science', 'history', 'fantasy', 'romance', 'thriller', 'biography', 'philosophy']

function Books() {
  const [category, setCategory] = useState('fiction')
  const { data: books, isLoading, error } = useBooks(category)

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-slate-950">
        <div className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
          />
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-4 ring-1 ring-violet-500/20 backdrop-blur-sm">
                <FaBook className="text-4xl text-violet-400" />
              </div>
              <h1 className="mb-3 text-4xl sm:text-5xl lg:text-6xl font-black">
                <span className="text-white">Books</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  Collection
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-500">
                Discover thousands of books across every genre imaginable.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-200 ring-1 ring-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-900/40 ring-1 ring-white/5">
                  <div className="aspect-[3/4] rounded-t-2xl bg-slate-800/80 shimmer" />
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-3/4 rounded-full bg-slate-800/80 shimmer" />
                    <div className="h-2 w-1/2 rounded-full bg-slate-800/80 shimmer" />
                    <div className="h-3 w-1/3 rounded-full bg-slate-800/80 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-lg text-red-400">Failed to load books.</p>
              <button onClick={() => setCategory(category)} className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm text-white shadow-lg shadow-violet-500/25">Retry</button>
            </div>
          ) : books?.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FaBook className="mb-4 text-5xl text-gray-600" />
              <p className="text-lg text-gray-400">No books found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books?.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Books
