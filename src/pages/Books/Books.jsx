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
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/20 to-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-4 inline-flex rounded-2xl bg-blue-500/10 p-4">
                <FaBook className="text-4xl text-blue-400" />
              </div>
              <h1 className="mb-3 text-5xl font-black text-white">Books Collection</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-400">Discover thousands of books across every genre imaginable.</p>
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
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-slate-800/50">
                  <div className="aspect-[3/4] rounded-t-xl bg-slate-700" />
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-3/4 rounded bg-slate-700" />
                    <div className="h-2 w-1/2 rounded bg-slate-700" />
                    <div className="h-3 w-1/3 rounded bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-lg text-red-400">Failed to load books.</p>
              <button onClick={() => setCategory(category)} className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white">Retry</button>
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
