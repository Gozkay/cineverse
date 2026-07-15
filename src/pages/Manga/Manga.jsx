import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import MangaCard from '@/components/Manga/MangaCard'
import { useManga } from '@/hooks/useManga'
import { FaDragon } from 'react-icons/fa'

function Manga() {
  const [page, setPage] = useState(1)
  const { data: mangaList, isLoading, error } = useManga(page)

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-slate-950">
        <div className="relative overflow-hidden bg-gradient-to-b from-pink-900/20 to-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-4 inline-flex rounded-2xl bg-pink-500/10 p-4">
                <FaDragon className="text-4xl text-pink-400" />
              </div>
              <h1 className="mb-3 text-5xl font-black text-white">Manga Collection</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-400">Discover top-rated manga from Japan and around the world.</p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
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
              <p className="text-lg text-red-400">Failed to load manga.</p>
              <button onClick={() => setPage(1)} className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-sm text-white">Retry</button>
            </div>
          ) : mangaList?.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FaDragon className="mb-4 text-5xl text-gray-600" />
              <p className="text-lg text-gray-400">No manga available.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mangaList?.map((manga, i) => (
                  <MangaCard key={manga.id} manga={manga} index={i} />
                ))}
              </div>
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50 hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-lg bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-500 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Manga
