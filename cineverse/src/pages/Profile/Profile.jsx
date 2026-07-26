import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaShoppingBag, FaSignOutAlt, FaClipboardList, FaTachometerAlt, FaEdit, FaKey, FaTrash, FaCheck, FaTimes, FaEye } from 'react-icons/fa'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { getOrdersByUser } from '@/services/orders'
import { updateProfile, updatePassword, deleteAccount } from '@/services/auth'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-500/10',
  paid: 'text-emerald-400 bg-emerald-500/10',
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
  const { user, profile, isStaffOrAbove, role, logout, refreshProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user) getOrdersByUser(user.id).then(data => setOrders(data || []))
  }, [user])

  const getDashboardLink = () => {
    if (role === 'admin') return ROUTES.DASHBOARD_ADMIN
    if (role === 'manager') return ROUTES.DASHBOARD_MANAGER
    if (role === 'staff') return ROUTES.DASHBOARD_STAFF
    return '#'
  }

  const handleSaveName = async () => {
    if (!name.trim()) return toast.error('Name is required')
    setSaving(true)
    const result = await updateProfile(user.id, { name: name.trim() })
    if (result.success) {
      toast.success('Name updated')
      setEditingName(false)
      refreshProfile()
    } else {
      toast.error(result.error)
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirmPassword) return toast.error('Passwords do not match')
    setSavingPassword(true)
    const result = await updatePassword(password)
    if (result.success) {
      toast.success('Password changed')
      setShowPasswordForm(false)
      setPassword('')
      setConfirmPassword('')
    } else {
      toast.error(result.error)
    }
    setSavingPassword(false)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    const result = await deleteAccount()
    if (result.success) {
      toast.success('Account deleted')
      logout()
    } else {
      toast.error(result.error || 'Could not delete account. Contact support.')
    }
    setDeleting(false)
  }

  return (
    <MainLayout>
      <Seo title="My Profile" noIndex />
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
              <p className="text-sm capitalize text-gray-500">{role} &bull; {user?.email}</p>
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
                          <span className="font-mono text-xs text-gray-500">#{order.id?.slice(0, 8)}</span>
                          <span className="ml-3 text-xs text-gray-500">{formatDateTime(order.created_at)}</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusColors[order.status] || 'text-gray-400'}`}>{order.status}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{item.title} <span className="text-gray-500">×{item.quantity}</span></span>
                            <span className="text-gray-400">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                        <Link to={`/orders/${order.id}`} className="flex items-center gap-1.5 text-xs text-violet-400 hover:underline">
                          <FaEye size={11} /> View details
                        </Link>
                        <span className="text-sm font-bold text-violet-400">{formatCurrency(order.total_amount)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-lg space-y-6">
              <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-semibold text-white">Account Info</h3>
                  {!editingName && (
                    <button onClick={() => { setName(profile?.name || user?.user_metadata?.name || ''); setEditingName(true) }} className="flex items-center gap-1.5 text-xs text-violet-400 hover:underline">
                      <FaEdit size={11} /> Edit
                    </button>
                  )}
                </div>
                <div className="space-y-3 pt-3">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white ring-1 ring-slate-700 outline-none focus:ring-violet-500" placeholder="Your name" autoFocus />
                      <button onClick={handleSaveName} disabled={saving} className="rounded-lg bg-violet-600 p-2 text-xs text-white hover:bg-violet-500 disabled:opacity-50"><FaCheck size={12} /></button>
                      <button onClick={() => setEditingName(false)} className="rounded-lg bg-slate-800 p-2 text-xs text-gray-400 hover:text-white"><FaTimes size={12} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Name</span>
                      <span className="text-sm text-white">{profile?.name || user?.user_metadata?.name || '—'}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Email</span>
                    <span className="text-sm text-white">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Role</span>
                    <span className="text-sm capitalize text-violet-400">{role}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="flex w-full items-center justify-between">
                  <h3 className="text-sm font-semibold text-white"><FaKey className="mr-2 inline" size={12} /> Change Password</h3>
                  <span className={`text-xs text-gray-500 transition-transform ${showPasswordForm ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showPasswordForm && (
                  <div className="mt-4 space-y-3">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white ring-1 ring-slate-700 outline-none focus:ring-violet-500" placeholder="New password (min 6 chars)" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white ring-1 ring-slate-700 outline-none focus:ring-violet-500" placeholder="Confirm new password" />
                    <button onClick={handleChangePassword} disabled={savingPassword} className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500 disabled:opacity-50">
                      {savingPassword ? 'Saving...' : 'Update Password'}
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-red-950/20 p-4 ring-1 ring-red-900/30">
                <button onClick={() => setConfirmDelete(!confirmDelete)} className="flex w-full items-center justify-between">
                  <h3 className="text-sm font-semibold text-red-400"><FaTrash className="mr-2 inline" size={12} /> Delete Account</h3>
                  <span className={`text-xs text-red-500 transition-transform ${confirmDelete ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {confirmDelete && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-red-400">This action is permanent and cannot be undone. All your data will be removed.</p>
                    <button onClick={handleDeleteAccount} disabled={deleting} className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50">
                      {deleting ? 'Deleting...' : 'Delete My Account'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Profile
