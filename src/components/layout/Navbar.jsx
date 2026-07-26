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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text hover:from-violet-300 hover:to-fuchsia-300 transition-all duration-300">
          CineVerse
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-violet-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="h-9 w-52 rounded-xl border border-slate-700/50 bg-slate-800/50 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  autoFocus
                />
              </div>
              <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <FaTimes size={14} />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <FaSearch size={16} />
            </button>
          )}

          <Link to={ROUTES.CART} className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <FaShoppingCart size={16} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white shadow-lg shadow-violet-500/25">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-violet-500/30 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-900/95 backdrop-blur-xl border-slate-800 text-white">
                <div className="px-2 py-1.5 text-sm text-gray-400">{user?.name}</div>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                  <FaUser className="mr-2" size={14} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.WISHLIST)} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                  <FaSearch className="mr-2" size={14} /> Wishlist
                </DropdownMenuItem>
                {isStaffOrAbove && (
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                    <FaTachometerAlt className="mr-2" size={14} /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={logout} className="hover:bg-white/5 focus:bg-white/5 text-red-400 cursor-pointer">
                  <FaSignOutAlt className="mr-2" size={14} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={ROUTES.LOGIN} className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <FaUser size={16} />
            </Link>
          )}
        </div>

        <button className="text-xl text-white md:hidden hover:text-violet-400 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setMobileOpen(false); setSearchQuery(''); } }} className="relative mb-3">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-10 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 pl-9 pr-3 text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </form>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive ? 'bg-violet-500/10 text-violet-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <hr className="border-white/5 my-2" />
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.PROFILE} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">Profile</Link>
                <Link to={ROUTES.WISHLIST} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">Wishlist</Link>
                <Link to={ROUTES.CART} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">Cart ({itemCount})</Link>
                {isStaffOrAbove && (
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">Dashboard</Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false) }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-400 hover:bg-white/5 transition-all">Logout</button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">Login</Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
