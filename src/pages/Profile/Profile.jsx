import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaShoppingBag, FaSignOutAlt, FaClipboardList, FaTachometerAlt } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { getOrdersByUser } from '@/services/orders'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import { ROUTES } from '@/constants/routes'

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-500/10',
  processing: 'text-blue-400 bg-blue-500/10',
  shipped: 'text-purple-400 bg-purple-500/10',
  delivered: 'text-green-400 bg-green-500/10',
  cancelled: 'text-red-400 bg-red-500/10',
}

const tabs = [
  { id: 'orders', label: 'My Orders', icon: FaShoppingBag },
  { id: 'profile', label: 'Profile', icon: FaUser },
]

function Profile() {
  const { user, profile, isStaffOrAbove, role, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (user) getOrdersByUser(user.id).then(data => setOrders(data || []))
  }, [user])

  const getDashboardLink = () => {
    if (role === 'admin') return ROUTES.DASHBOARD_ADMIN
    if (role === 'manager') return ROUTES.DASHBOARD_MANAGER
    if (role === 'staff') return ROUTES.DASHBOARD_STAFF
    return '#'
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl font-bold text-white shadow-lg shadow-violet-500/25">
              {(profile?.name || user?.user_metadata?.name || 'U')?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {profile?.name || user?.user_metadata?.name || 'User'}
              </h1>
              <p className="text-sm capitalize text-gray-500">{role} &bull; {profile?.email || user?.email}</p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4 border-b border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-violet-500 text-violet-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
            {isStaffOrAbove && (
              <Link to={getDashboardLink()} className="ml-auto flex items-center gap-2 text-sm text-violet-400 hover:underline">
                <FaTachometerAlt size={14} /> Dashboard
              </Link>
            )}
            <button onClick={logout} className="flex items-center gap-2 text-sm text-red-400 hover:underline">
              <FaSignOutAlt size={14} /> Logout
            </button>
          </div>

          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <FaClipboardList className="mb-4 text-5xl text-gray-700" />
                  <h2 className="mb-2 text-lg font-semibold text-white">No orders yet</h2>
                  <Link to={ROUTES.MOVIES} className="text-violet-400 hover:underline">Start shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs text-gray-500">#{order.id}</span>
                          <span className="ml-3 text-xs text-gray-500">{formatDateTime(order.createdAt)}</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusColors[order.status] || 'text-gray-400'}`}>{order.status}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{item.title} <span className="text-gray-500">×{item.quantity}</span></span>
                            <span className="text-gray-400">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                        <span className="text-xs text-gray-500">{order.shippingInfo?.address}, {order.shippingInfo?.city}</span>
                        <span className="text-sm font-bold text-violet-400">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-md space-y-4">
              <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Name</span>
                  <span className="text-sm text-white">{profile?.name || user?.user_metadata?.name}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Email</span>
                  <span className="text-sm text-white">{profile?.email || user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Role</span>
                  <span className="text-sm capitalize text-violet-400">{role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Profile
