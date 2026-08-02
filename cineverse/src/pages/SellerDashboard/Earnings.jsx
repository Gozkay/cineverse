import { useState, useEffect } from 'react'
import { FaWallet, FaCoins, FaPiggyBank } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import CountUp from '@/components/ui/CountUp'
import { useAuth } from '@/context/AuthContext'
import { getEarnings, getAvailableBalance } from '@/services/seller'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'

const statusBadge = {
  available: <Badge variant="success">Available</Badge>,
  pending_transfer: <Badge variant="warning">In Payout</Badge>,
  paid: <Badge variant="info">Paid</Badge>,
  failed: <Badge variant="destructive">Failed</Badge>,
}

function SellerEarnings() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getEarnings(user.id),
      getAvailableBalance(user.id),
    ])
      .then(([e, b]) => {
        setEarnings(e)
        setBalance(b)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const totals = earnings.reduce(
    (acc, e) => {
      acc.gross += Number(e.gross) || 0
      acc.commission += Number(e.commission) || 0
      acc.net += Number(e.net) || 0
      return acc
    },
    { gross: 0, commission: 0, net: 0 }
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            <span className="text-white">My</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Earnings</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">You earn 95% of every sale — 5% platform commission</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <FaWallet className="mb-3 text-emerald-400" size={20} />
            <p className="text-xs text-gray-500">Available Balance</p>
            <p className="mt-1 text-2xl font-black text-white">₦<CountUp end={balance} /></p>
          </div>
          <div className="rounded-2xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <FaCoins className="mb-3 text-amber-400" size={20} />
            <p className="text-xs text-gray-500">Total Gross Sales</p>
            <p className="mt-1 text-2xl font-black text-white">{formatCurrency(totals.gross)}</p>
          </div>
          <div className="rounded-2xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <FaPiggyBank className="mb-3 text-violet-400" size={20} />
            <p className="text-xs text-gray-500">Platform Commission</p>
            <p className="mt-1 text-2xl font-black text-white">{formatCurrency(totals.commission)}</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800/50 shimmer" />)}
            </div>
          ) : earnings.length === 0 ? (
            <div className="p-12 text-center">
              <FaCoins className="mx-auto mb-3 text-4xl text-amber-400/60" />
              <p className="text-gray-400">No earnings yet. Sales from your products will show up here.</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">Gross</TableHead>
                <TableHead className="text-gray-400">Commission (5%)</TableHead>
                <TableHead className="text-gray-400">You Earn</TableHead>
                <TableHead className="text-right text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((e) => (
                <TableRow key={e.id} className="border-slate-800">
                  <TableCell className="text-xs text-gray-500">{formatDateTime(e.created_at)}</TableCell>
                  <TableCell className="text-sm text-white line-clamp-1 max-w-[180px]">{e.title}</TableCell>
                  <TableCell className="text-sm text-gray-300">{formatCurrency(e.gross)}</TableCell>
                  <TableCell className="text-sm text-gray-500">{formatCurrency(e.commission)}</TableCell>
                  <TableCell className="text-sm font-semibold text-emerald-400">{formatCurrency(e.net)}</TableCell>
                  <TableCell className="text-right">{statusBadge[e.status] || <Badge>{e.status}</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SellerEarnings
