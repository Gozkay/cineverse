import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaRobot, FaPaperPlane, FaSpinner } from 'react-icons/fa'
import { aiChat } from '@/services/ai'

const quickPrompts = [
  'Recommend a movie',
  'Best fantasy books',
  'What is CineVerse?',
  'Cheapest comics',
  'Top manga to read',
]

function ChatDialog({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi! I'm your CineVerse assistant. Ask me about movies, books, manga, comics, orders, or anything store-related. " },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    const history = [...messages, { role: 'user', content }]
    setMessages(history)
    setLoading(true)
    try {
      const reply = await aiChat(history)
      setMessages((m) => [...m, { role: 'model', content: reply }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'model', content: `Sorry, I couldn't reach the AI service right now. ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-24 left-6 z-50 flex h-[480px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <FaRobot className="text-white" size={15} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">CineVerse Assistant</p>
            <p className="flex items-center gap-1.5 text-[11px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <FaTimes size={14} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                  : 'rounded-bl-sm bg-slate-800/80 text-gray-200 ring-1 ring-white/5'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-800/80 px-4 py-3 ring-1 ring-white/5">
              <FaSpinner className="animate-spin text-violet-400" size={13} />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pb-2">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={loading}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/30 transition-all disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send() }}
        className="flex items-center gap-2 border-t border-white/5 bg-slate-950/50 p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="h-10 flex-1 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-40"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </motion.div>
  )
}

function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {open && <ChatDialog onClose={() => setOpen(false)} />}
      </AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 animate-pulse-glow cursor-pointer"
        aria-label="AI Assistant"
      >
        {open ? <FaTimes size={18} /> : <FaRobot size={20} />}
      </motion.button>
    </>
  )
}

export default ChatWidget
