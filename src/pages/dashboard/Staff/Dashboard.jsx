import { useState, useEffect } from 'react'
import { FaShoppingBag, FaBox, FaClock, FaCheckCircle } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getAll } from '@/lib/storage'
import { formatCurrency } from '@/utils/formatCurrency'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function StaffDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, delivered: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const orders = getAll('orders')
    setStats({
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
          <p className="text-gray-400">View and manage customer orders</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Orders', value: stats.total, icon: FaShoppingBag, color: 'violet' },
            { label: 'Pending', value: stats.pending, icon: FaClock, color: 'amber' },
            { label: 'Processing', value: stats.processing, icon: FaBox, color: 'blue' },
            { label: 'Delivered', value: stats.delivered, icon: FaCheckCircle, color: 'green' },
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

        <button onClick={() => navigate(ROUTES.DASHBOARD_STAFF_ORDERS)} className="w-full rounded-xl bg-slate-900/50 p-6 ring-1 ring-slate-800 text-left hover:ring-violet-500/30 transition-all">
          <h2 className="mb-2 text-lg font-semibold text-white">View All Orders</h2>
          <p className="text-sm text-gray-400">Manage order status and customer requests</p>
        </button>
      </div>
    </DashboardLayout>
  )
}

export default StaffDashboard
