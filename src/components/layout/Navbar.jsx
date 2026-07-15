import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaShoppingCart, FaUser, FaSearch, FaTimes, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, role, isStaffOrAbove } = useAuth()
  const { itemCount } = useCart()

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Movies', path: ROUTES.MOVIES },
    { name: 'Books', path: ROUTES.BOOKS },
    { name: 'Manga', path: ROUTES.MANGA },
    { name: 'Comics', path: ROUTES.COMICS },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const getDashboardLink = () => {
    if (role === 'admin') return ROUTES.DASHBOARD_ADMIN
    if (role === 'manager') return ROUTES.DASHBOARD_MANAGER
    if (role === 'staff') return ROUTES.DASHBOARD_STAFF
    return ROUTES.PROFILE
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold text-violet-500">
          CineVerse
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-violet-500 font-semibold'
                    : 'text-gray-300 hover:text-violet-400 transition'
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-8 w-48 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500"
                autoFocus
              />
              <button type="submit" className="text-violet-400 hover:text-violet-300">
                <FaSearch />
              </button>
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-gray-300 hover:text-violet-500 transition-colors">
              <FaSearch size={18} />
            </button>
          )}

          <Link to={ROUTES.CART} className="relative text-gray-300 hover:text-violet-500 transition-colors">
            <FaShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-gray-300 hover:text-violet-500 transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-violet-600 text-white text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700 text-white">
                <div className="px-2 py-1.5 text-sm text-gray-400">{user?.name}</div>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)} className="hover:bg-slate-800">
                  <FaUser className="mr-2" size={14} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.WISHLIST)} className="hover:bg-slate-800">
                  <FaSearch className="mr-2" size={14} /> Wishlist
                </DropdownMenuItem>
                {isStaffOrAbove && (
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())} className="hover:bg-slate-800">
                    <FaTachometerAlt className="mr-2" size={14} /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={logout} className="hover:bg-slate-800 text-red-400">
                  <FaSignOutAlt className="mr-2" size={14} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={ROUTES.LOGIN} className="text-gray-300 hover:text-violet-500 transition-colors">
              <FaUser size={18} />
            </Link>
          )}
        </div>

        <button className="text-2xl text-white md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-slate-800 text-violet-400' : 'text-gray-300 hover:bg-slate-800'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <hr className="border-slate-800 my-2" />
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.PROFILE} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-slate-800">Profile</Link>
                <Link to={ROUTES.CART} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-slate-800">Cart ({itemCount})</Link>
                {isStaffOrAbove && (
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-slate-800">Dashboard</Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false) }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-800">Logout</button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-slate-800">Login</Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-slate-800">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
