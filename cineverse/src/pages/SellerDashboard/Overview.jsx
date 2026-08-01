import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFilm, FaShoppingCart, FaWallet, FaHourglassHalf, FaArrowRight, FaPlus } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CountUp from '@/components/ui/CountUp'
import { useAuth } from '@/context/AuthContext'
import { getSellerStats } from '@/services/seller'
import { ROUTES } from '@/constants/routes'

function SellerOverview() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getSellerStats(user.id)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const cards = [
    {
      label: 'Available Balance',
      value: stats?.availableBalance || 0,
      prefix: '₦',
      icon: FaWallet,
      color: 'emerald',
      to: ROUTES.DASHBOARD_SELLER_PAYOUTS,
    },
    {
      label: 'Products Listed',
      value: stats?.productCount || 0,
      icon: FaFilm,
      color: 'violet',
      to: ROUTES.DASHBOARD_SELLER_PRODUCTS,
    },
    {
      label: 'Total Sales',
      value: stats?.salesCount || 0,
      icon: FaShoppingCart,
      color: 'amber',
      to: ROUTES.DASHBOARD_SELLER_PRODUCTS,
    },
    {
      label: 'Pending Payouts',
      value: stats?.pendingPayout || 0,
      prefix: '₦',
      icon: FaHourglassHalf,
      color: 'sky',
      to: ROUTES.DASHBOARD_SELLER_PAYOUTS,
    },
  ]

  const colorClasses = {
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 ring-emerald-500/20',
    violet: 'from-violet-500/20 to-fuchsia-500/5 text-violet-400 ring-violet-500/20',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 ring-amber-500/20',
    sky: 'from-sky-500/20 to-cyan-500/5 text-sky-400 ring-sky-500/20',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              <span className="text-white">Welcome back,</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{profile?.name?.split(' ')[0] || 'Seller'}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Sell your local movies and products — 5% platform commission per sale</p>
          </div>
          <Link to={ROUTES.DASHBOARD_SELLER_PRODUCTS} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-90 transition-opacity">
            <FaPlus size={13} /> Post a Movie
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link key={card.label} to={card.to} className="group rounded-2xl bg-slate-900/50 p-5 ring-1 ring-slate-800 transition-all hover:ring-slate-600">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${colorClasses[card.color]}`}>
                <card.icon size={18} />
              </div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-black text-white">
                {card.prefix || ''}<CountUp end={card.value} />
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-white transition-colors">
                View <FaArrowRight size={9} />
              </span>
            </Link>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-900/40 shimmer" />)}
          </div>
        )}

        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/50 to-orange-500/5 p-6 ring-1 ring-amber-500/20">
          <h2 className="text-lg font-bold text-white">How selling works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-gray-400">
            <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              <p className="font-semibold text-amber-400">1. Post your movie</p>
              <p className="mt-1 text-xs">Add a title, price, cover image, and your movie file. It goes to review first.</p>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              <p className="font-semibold text-amber-400">2. Get paid</p>
              <p className="mt-1 text-xs">When a customer pays, 95% of the price lands in your earnings.</p>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              <p className="font-semibold text-amber-400">3. Withdraw</p>
              <p className="mt-1 text-xs">Request a payout with your bank details — transfers are sent to your account.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SellerOverview
