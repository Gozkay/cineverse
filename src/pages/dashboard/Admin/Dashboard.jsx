import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBox, FaShoppingBag, FaUsers, FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getAll } from '@/lib/storage'
import { formatCurrency } from '@/utils/formatCurrency'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, pending: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const users = getAll('users')
    const orders = getAll('orders')
    setStats({
      users: users.length,
      orders: orders.length,
      revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      pending: orders.filter(o => o.status === 'pending').length,
    })
  }, [])

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: FaUsers, color: 'blue', route: ROUTES.DASHBOARD_ADMIN_USERS },
    { label: 'Total Orders', value: stats.orders, icon: FaShoppingBag, color: 'violet', route: ROUTES.DASHBOARD_ADMIN_ORDERS },
    { label: 'Revenue', value: formatCurrency(stats.revenue), icon: FaMoneyBillWave, color: 'green', route: '#' },
    { label: 'Pending Orders', value: stats.pending, icon: FaBox, color: 'amber', route: ROUTES.DASHBOARD_ADMIN_ORDERS },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
          <p className="text-gray-400">Manage your marketplace</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => card.route !== '#' && navigate(card.route)}
              className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800 text-left hover:ring-violet-500/30 transition-all"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-lg bg-${card.color}-500/10 p-2.5`}>
                  <card.icon className={`text-${card.color}-400`} size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-sm text-gray-400">{card.label}</p>
            </motion.button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_PRODUCTS)} className="flex w-full items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 transition-colors">
                <FaBox className="text-violet-400" /> Manage Products
              </button>
              <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_ORDERS)} className="flex w-full items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 transition-colors">
                <FaShoppingBag className="text-blue-400" /> View Orders
              </button>
              <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_USERS)} className="flex w-full items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 transition-colors">
                <FaUsers className="text-green-400" /> Manage Users
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
            {stats.orders > 0 ? (
              <p className="text-sm text-gray-400">{stats.orders} orders placed • {stats.pending} pending • {stats.users} registered users</p>
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
