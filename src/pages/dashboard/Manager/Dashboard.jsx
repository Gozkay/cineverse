import { useState, useEffect } from 'react'
import { FaUserTie, FaShoppingBag, FaBox, FaExclamationTriangle } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getAll } from '@/lib/storage'
import { formatCurrency } from '@/utils/formatCurrency'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function ManagerDashboard() {
  const [stats, setStats] = useState({ staff: 0, orders: 0, pending: 0, revenue: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const users = getAll('users')
    const orders = getAll('orders')
    setStats({
      staff: users.filter(u => u.role === 'staff').length,
      orders: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            <span className="text-white">Manager</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Staff & order oversight</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Staff Members', value: stats.staff, icon: FaUserTie, color: 'violet' },
            { label: 'Total Orders', value: stats.orders, icon: FaShoppingBag, color: 'blue' },
            { label: 'Pending Orders', value: stats.pending, icon: FaExclamationTriangle, color: 'amber' },
            { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: FaBox, color: 'green' },
          ].map((card, i) => (
            <div key={card.label} className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
              <div className="mb-3 rounded-lg bg-violet-500/10 p-2.5 w-fit">
                <card.icon className="text-violet-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-sm text-gray-400">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <button onClick={() => navigate(ROUTES.DASHBOARD_MANAGER_STAFF)} className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800 text-left hover:ring-violet-500/30 transition-all">
            <h2 className="mb-2 text-lg font-semibold text-white">Staff Management</h2>
            <p className="text-sm text-gray-400">Manage staff accounts, permissions, and access</p>
          </button>
          <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_ORDERS)} className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800 text-left hover:ring-violet-500/30 transition-all">
            <h2 className="mb-2 text-lg font-semibold text-white">Order Oversight</h2>
            <p className="text-sm text-gray-400">Monitor all orders across the platform</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManagerDashboard
