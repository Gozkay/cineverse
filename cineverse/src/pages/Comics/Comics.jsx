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
        <div className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
          />
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 p-4 ring-1 ring-emerald-500/20 backdrop-blur-sm">
                <FaMasksTheater className="text-4xl text-emerald-400" />
              </div>
              <h1 className="mb-3 text-4xl sm:text-5xl lg:text-6xl font-black">
                <span className="text-white">Comics</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Collection
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-500">
                From superhero epics to indie graphic novels — find your next favorite comic.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubject(sub)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                  subject === sub
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-200 ring-1 ring-white/5'
                }`}
              >
                {sub.replace(/_/g, ' ')}
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
              <p className="text-lg text-red-400">Failed to load comics.</p>
              <button onClick={() => setSubject(subject)} className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm text-white shadow-lg shadow-emerald-500/25">Retry</button>
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
