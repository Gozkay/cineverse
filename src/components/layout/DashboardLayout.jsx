import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaUserTie, FaSignOutAlt, FaBars, FaTimes, FaHome } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile, logout } = useAuth()
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

  const role = user?.role || profile?.role || 'customer'
  const links = role === 'admin' ? adminLinks : role === 'manager' ? managerLinks : staffLinks
  const userName = profile?.name || user?.user_metadata?.name || user?.email || 'User'

  return (
    <div className="flex min-h-screen bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-16'}`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link to="/" className="text-lg font-bold text-violet-500 whitespace-nowrap md:block" style={sidebarOpen ? {} : { display: 'none' }}>CineVerse</Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors md:hidden">
            <FaTimes size={16} />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          <NavLink
            to={ROUTES.HOME}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FaHome size={16} />
            <span>Home</span>
          </NavLink>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === (role === 'admin' ? ROUTES.DASHBOARD_ADMIN : role === 'manager' ? ROUTES.DASHBOARD_MANAGER : ROUTES.DASHBOARD_STAFF)}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-violet-600/20 text-violet-400' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`
              }
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-3">
          <button onClick={() => { logout(); navigate(ROUTES.LOGIN) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors">
            <FaSignOutAlt size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-16">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white md:hidden">
              <FaBars size={18} />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white hidden md:block">
              <FaBars size={16} />
            </button>
            <h2 className="text-base md:text-lg font-semibold text-white capitalize">{role} Dashboard</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-gray-400 truncate max-w-[100px] md:max-w-none">{userName}</span>
            <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] md:text-sm font-semibold text-white">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
