import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import ComicCard from '@/components/Comics/ComicCard'
import { useComics } from '@/hooks/useComics'
import { FaMasksTheater } from 'react-icons/fa6'

const subjects = ['comics', 'graphic_novels', 'superheroes', 'comic_strips', 'webcomics', 'manga_style']

function Comics() {
  const [subject, setSubject] = useState('comics')
  const { data: comics, isLoading, error } = useComics(subject)

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-slate-950">
        <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900/20 to-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-500/10 p-4">
                <FaMasksTheater className="text-4xl text-emerald-400" />
              </div>
              <h1 className="mb-3 text-5xl font-black text-white">Comics Collection</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-400">From superhero epics to indie graphic novels — find your next favorite comic.</p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubject(sub)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${subject === sub ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
              >
                {sub.replace(/_/g, ' ')}
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
              <p className="text-lg text-red-400">Failed to load comics.</p>
              <button onClick={() => setSubject(subject)} className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm text-white">Retry</button>
            </div>
          ) : comics?.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FaMasksTheater className="mb-4 text-5xl text-gray-600" />
              <p className="text-lg text-gray-400">No comics found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {comics?.map((comic, i) => (
                <ComicCard key={comic.id} comic={comic} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Comics
