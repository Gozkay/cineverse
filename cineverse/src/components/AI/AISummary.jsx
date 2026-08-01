import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWandMagicSparkles } from 'react-icons/fa6'
import { FaSpinner } from 'react-icons/fa'
import { aiSummarize } from '@/services/ai'

function AISummary({ item, title = 'AI Summary', className = '' }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generate = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const text = await aiSummarize(item)
      setSummary(text)
    } catch (e) {
      setError("Couldn't generate a summary right now. Try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${className}`}>
      <AnimatePresence>
        {!summary && !error && (
          <button
            onClick={generate}
            disabled={loading}
            className="group flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/20 hover:text-violet-200 disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" size={13} /> : <FaWandMagicSparkles className="transition-transform group-hover:scale-110" size={13} />}
            {loading ? 'Writing...' : title}
          </button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FaSpinner className="animate-spin text-violet-400" size={12} />
              Generating AI summary...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative mt-4 overflow-hidden rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-5"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
            <div className="mb-2 flex items-center gap-2">
              <FaWandMagicSparkles className="text-violet-400" size={12} />
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">AI Summary</span>
              <button onClick={() => setSummary(null)} className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors">Hide</button>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">{summary}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4"
          >
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="text-xs text-gray-500 hover:text-gray-300">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AISummary
