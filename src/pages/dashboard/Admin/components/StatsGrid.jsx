import { motion } from 'framer-motion'
import { FaUsers, FaShoppingBag, FaMoneyBillWave, FaBox } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import PropTypes from 'prop-types'

const cards = [
  { label: 'Total Users', key: 'users', icon: FaUsers, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', route: ROUTES.DASHBOARD_ADMIN_USERS },
  { label: 'Total Orders', key: 'orders', icon: FaShoppingBag, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400', route: ROUTES.DASHBOARD_ADMIN_ORDERS },
  { label: 'Revenue', key: 'revenue', icon: FaMoneyBillWave, iconBg: 'bg-green-500/10', iconColor: 'text-green-400', route: '#' },
  { label: 'Pending', key: 'pending', icon: FaBox, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400', route: ROUTES.DASHBOARD_ADMIN_ORDERS },
]

function StatsGrid({ stats, loading }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.button
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => card.route !== '#' && navigate(card.route)}
          className="rounded-2xl bg-slate-900/50 p-5 ring-1 ring-white/5 text-left hover:ring-violet-500/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className={`rounded-xl ${card.iconBg} p-2.5 ring-1 ring-white/5`}>
              <card.icon className={card.iconColor} size={20} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-slate-800" />
          ) : (
            <p className="text-2xl font-bold text-white">
              {card.key === 'revenue' ? `₦${(stats[card.key] || 0).toLocaleString()}` : stats[card.key] || 0}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-400">{card.label}</p>
        </motion.button>
      ))}
    </div>
  )
}

StatsGrid.propTypes = {
  stats: PropTypes.shape({
    users: PropTypes.number,
    orders: PropTypes.number,
    revenue: PropTypes.number,
    pending: PropTypes.number,
  }),
  loading: PropTypes.bool,
}

export default StatsGrid
