import { useState, useEffect } from 'react'
import { FaWallet, FaUniversity } from 'react-icons/fa'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useAuth } from '@/context/AuthContext'
import { getSellerPayouts, getAvailableBalance, requestPayout, getBanks } from '@/services/seller'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const statusBadge = {
  pending: <Badge variant="warning">Pending</Badge>,
  processing: <Badge variant="info">Processing</Badge>,
  paid: <Badge variant="success">Paid</Badge>,
  failed: <Badge variant="destructive">Failed</Badge>,
  cancelled: <Badge variant="secondary">Cancelled</Badge>,
}

function SellerPayouts() {
  const { user } = useAuth()
  const [payouts, setPayouts] = useState([])
  const [balance, setBalance] = useState(0)
  const [banks, setBanks] = useState([])
  const [banksError, setBanksError] = useState(null)
  const [amount, setAmount] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!user) return
    Promise.all([getSellerPayouts(user.id), getAvailableBalance(user.id)])
      .then(([p, b]) => { setPayouts(p); setBalance(b) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    getBanks()
      .then((data) => setBanks(data?.banks || []))
      .catch(() => setBanksError('Could not load bank list. Try again later.'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleRequest = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return toast.error('Enter a valid amount')
    if (amt > balance) return toast.error('Amount exceeds your available balance')
    if (!bankCode) return toast.error('Select your bank')
    if (!/^\d{10}$/.test(accountNumber)) return toast.error('Enter a valid 10-digit account number')

    setSubmitting(true)
    try {
      const bank = banks.find(b => b.code === bankCode)
      const result = await requestPayout({
        amount: amt,
        bank_details: { account_number: accountNumber, bank_code: bankCode, bank_name: bank?.name || '' },
      })
      if (result?.account_name) {
        toast.success(`Payout requested for ${result.account_name}!`)
      } else {
        toast.success('Payout requested!')
      }
      setAmount('')
      setAccountNumber('')
      load()
    } catch (e) {
      toast.error(e.message || 'Failed to request payout')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            <span className="text-white">Withdraw</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Earnings</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Request a payout — transfers are sent to your bank account</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl bg-slate-900/50 p-6 ring-1 ring-slate-800 h-fit">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
                <FaWallet className="text-emerald-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Available balance</p>
                <p className="text-xl font-black text-white">{formatCurrency(balance)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Amount (NGN)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Bank</label>
                {banksError ? (
                  <p className="text-xs text-red-400">{banksError}</p>
                ) : (
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-amber-500"
                  >
                    <option value="">Select your bank</option>
                    {banks.map((b) => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Account number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit account number"
                  className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={handleRequest}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-semibold text-slate-950 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <FaMoneyBillTransfer size={14} /> {submitting ? 'Requesting...' : 'Request Payout'}
              </button>
              <p className="text-[10px] text-gray-600">Minimum payout is ₦100. Your account name is verified with Paystack before the transfer.</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800/50 shimmer" />)}
              </div>
            ) : payouts.length === 0 ? (
              <div className="p-12 text-center">
                <FaUniversity className="mx-auto mb-3 text-4xl text-amber-400/60" />
                <p className="text-gray-400">No payout requests yet.</p>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Bank</TableHead>
                  <TableHead className="text-right text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((p) => (
                  <TableRow key={p.id} className="border-slate-800">
                    <TableCell className="text-xs text-gray-500">{formatDateTime(p.created_at)}</TableCell>
                    <TableCell className="text-sm font-semibold text-white">{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="text-xs text-gray-400">
                      {p.bank_details?.bank_name || ''} ••••{p.bank_details?.account_number?.slice(-4) || ''}
                    </TableCell>
                    <TableCell className="text-right">{statusBadge[p.status] || <Badge>{p.status}</Badge>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SellerPayouts
