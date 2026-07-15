import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaUserTie, FaSignOutAlt, FaBars, FaTimes, FaChevronLeft, FaHome } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const adminLinks = [
    { to: ROUTES.DASHBOARD_ADMIN, label: 'Overview', icon: FaTachometerAlt },
    { to: ROUTES.DASHBOARD_ADMIN_PRODUCTS, label: 'Products', icon: FaBox },
    { to: ROUTES.DASHBOARD_ADMIN_ORDERS, label: 'Orders', icon: FaShoppingBag },
    { to: ROUTES.DASHBOARD_ADMIN_USERS, label: 'Users', icon: FaUsers },
  ]

  const managerLinks = [
    { to: ROUTES.DASHBOARD_MANAGER, label: 'Overview', icon: FaTachometerAlt },
    { to: ROUTES.DASHBOARD_MANAGER_STAFF, label: 'Staff', icon: FaUserTie },
    { to: ROUTES.DASHBOARD_ADMIN_ORDERS, label: 'Orders', icon: FaShoppingBag },
  ]

  const staffLinks = [
    { to: ROUTES.DASHBOARD_STAFF, label: 'Overview', icon: FaTachometerAlt },
    { to: ROUTES.DASHBOARD_STAFF_ORDERS, label: 'Orders', icon: FaShoppingBag },
  ]

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'manager' ? managerLinks : staffLinks

  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className={`fixed left-0 top-0 z-40 h-full border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden md:w-16'}`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          {sidebarOpen && (
            <Link to="/" className="text-lg font-bold text-violet-500 whitespace-nowrap">CineVerse</Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
            {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
        <nav className="space-y-1 p-3">
          <NavLink to={ROUTES.HOME} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-slate-800 hover:text-white transition-colors">
            <FaHome size={16} />
            {sidebarOpen && <span>Home</span>}
          </NavLink>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === (user?.role === 'admin' ? ROUTES.DASHBOARD_ADMIN : user?.role === 'manager' ? ROUTES.DASHBOARD_MANAGER : ROUTES.DASHBOARD_STAFF)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-violet-600/20 text-violet-400' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`
              }
            >
              <link.icon size={16} />
              {sidebarOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-3">
          <button onClick={() => { logout(); navigate(ROUTES.LOGIN) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors">
            <FaSignOutAlt size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0 md:ml-16'}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
                <FaBars size={16} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-white capitalize">{user?.role} Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user?.name}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
