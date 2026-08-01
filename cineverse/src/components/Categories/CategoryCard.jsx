import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

function CategoryCard({ category, index = 0 }) {
  const cardRef = useRef(null)
  const IconComponent = category.icon

  const routeMap = {
    movies: '/movies',
    books: '/books',
    manga: '/manga',
    comics: '/comics',
  }

  const glowColors = {
    movies: 'rgba(239, 68, 68, 0.25)',
    books: 'rgba(139, 92, 246, 0.25)',
    manga: 'rgba(236, 72, 153, 0.25)',
    comics: 'rgba(16, 185, 129, 0.25)',
  }

  const iconGradients = {
    movies: 'from-red-500 to-orange-500',
    books: 'from-violet-500 to-fuchsia-500',
    manga: 'from-pink-500 to-purple-500',
    comics: 'from-emerald-500 to-teal-500',
  }

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
    cardRef.current.style.boxShadow = `0 0 40px ${glowColors[category.id] || 'transparent'}`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.boxShadow = '0 0 0px transparent'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={routeMap[category.id] || '/products'}>
        <motion.div
          ref={cardRef}
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-slate-900/80 p-6 md:p-8 transition-all duration-300 hover:border-transparent"
        >
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 0%), ${glowColors[category.id]?.replace('0.25', '0.15') || 'transparent'}, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${glowColors[category.id]?.replace('0.25', '0.4') || 'transparent'}, transparent 70%)`,
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

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    count: PropTypes.number,
  }).isRequired,
  index: PropTypes.number,
}

export default CategoryCard
