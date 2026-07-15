import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function CategoryCard({ category }) {
  const IconComponent = category.icon

  const routeMap = {
    movies: '/movies',
    books: '/books',
    manga: '/manga',
    comics: '/comics',
  }

  return (
    <Link to={routeMap[category.id] || '/products'}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-slate-900 p-8 transition-all duration-300 hover:border-transparent hover:shadow-2xl"
        style={{ '--hover-glow': category.color }}
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
          style={{
            background: `linear-gradient(135deg, ${category.color.split(' ')[0]}, ${category.color.split(' ')[2] || category.color.split(' ')[0]})`,
          }}
        />

        <div className="relative z-10">
          <div
            className="mb-4 inline-flex rounded-xl bg-gradient-to-br p-4 text-3xl text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${category.color.replace('from-', '').split(' ')[0] || category.color})`,
            }}
          >
            <IconComponent />
          </div>

          <h3 className="mb-2 text-2xl font-bold text-white">{category.title}</h3>
          <p className="text-sm text-gray-400">{category.count} items</p>
        </div>
      </motion.div>
    </Link>
  )
}

export default CategoryCard
