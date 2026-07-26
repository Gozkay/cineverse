import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function CategoryCard({ category, index = 0 }) {
  const IconComponent = category.icon

  const routeMap = {
    movies: '/movies',
    books: '/books',
    manga: '/manga',
    comics: '/comics',
  }

  const glowColors = {
    movies: 'rgba(239, 68, 68, 0.2)',
    books: 'rgba(59, 130, 246, 0.2)',
    manga: 'rgba(236, 72, 153, 0.2)',
    comics: 'rgba(16, 185, 129, 0.2)',
  }

  const iconGradients = {
    movies: 'from-red-500 to-orange-500',
    books: 'from-blue-500 to-cyan-500',
    manga: 'from-pink-500 to-purple-500',
    comics: 'from-green-500 to-emerald-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={routeMap[category.id] || '/products'}>
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-slate-900/80 p-6 md:p-8 transition-all duration-300 hover:border-transparent"
          style={{
            boxShadow: `0 0 0px ${glowColors[category.id] || 'transparent'}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 30px ${glowColors[category.id] || 'transparent'}` }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0px transparent` }}
        >
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${glowColors[category.id]?.replace('0.2', '0.4') || 'transparent'}, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 md:p-4 text-2xl md:text-3xl text-white shadow-lg ${iconGradients[category.id]}`}>
              <IconComponent />
            </div>

            <h3 className="mb-2 text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
              {category.title}
            </h3>
            <p className="text-sm text-gray-400">{category.count} items</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default CategoryCard
