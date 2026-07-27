import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaHeart, FaSearch, FaBook, FaDragon, FaBoxOpen } from 'react-icons/fa'
import { FaMasksTheater } from 'react-icons/fa6'

const iconMap = {
  cart: { icon: FaShoppingCart, gradient: 'from-violet-500 to-fuchsia-500' },
  wishlist: { icon: FaHeart, gradient: 'from-pink-500 to-rose-500' },
  search: { icon: FaSearch, gradient: 'from-blue-500 to-cyan-500' },
  books: { icon: FaBook, gradient: 'from-violet-500 to-fuchsia-500' },
  manga: { icon: FaDragon, gradient: 'from-pink-500 to-rose-500' },
  comics: { icon: FaMasksTheater, gradient: 'from-emerald-500 to-teal-500' },
  default: { icon: FaBoxOpen, gradient: 'from-gray-500 to-slate-500' },
}

function EmptyState({ type = 'default', title, message, actionLabel, actionLink }) {
  const config = iconMap[type] || iconMap.default
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${config.gradient}/10 p-6 ring-1 ring-white/10`}
      >
        <Icon className={`text-4xl text-transparent bg-clip-text bg-gradient-to-br ${config.gradient}`} />
      </motion.div>
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      <p className="mb-6 text-gray-500 max-w-sm">{message}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className={`rounded-xl bg-gradient-to-r ${config.gradient} px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  )
}

export default EmptyState
