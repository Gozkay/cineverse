import { useState, useEffect } from 'react'
import { FaStore, FaMoneyBillWave, FaCheck, FaTimes, FaPaperPlane, FaBan } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { getSellerRequests, approveSellerRequest, rejectSellerRequest } from '@/services/auth'
import { getAllPayouts, adminTransferPayout, adminCancelPayout } from '@/services/seller'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const payoutStatus = {
  pending: <Badge variant="warning">Pending</Badge>,
  processing: <Badge variant="info">Processing</Badge>,
  paid: <Badge variant="success">Paid</Badge>,
  failed: <Badge variant="destructive">Failed</Badge>,
  cancelled: <Badge variant="secondary">Cancelled</Badge>,
}

function AdminSellers() {
  const [tab, setTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [transferringId, setTransferringId] = useState(null)

  const loadRequests = async () => {
    try {
      setRequests(await getSellerRequests())
    } catch {
      toast.error('Failed to load seller requests')
    }
  }

  const loadPayouts = async () => {
    try {
      setPayouts(await getAllPayouts())
    } catch {
      toast.error('Failed to load payouts')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial mount fetch
    Promise.all([loadRequests(), loadPayouts()]).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (request) => {
    try {
      await approveSellerRequest(request.user_id, request.id)
      toast.success(`${request.user?.name || 'User'} is now a seller`)
      loadRequests()
    } catch {
      toast.error('Failed to approve request')
    }
  }

  const handleReject = async (request) => {
    try {
      await rejectSellerRequest(request.id)
      toast.success('Request rejected')
      loadRequests()
    } catch {
      toast.error('Failed to reject request')
    }
  }

  const handleTransfer = async (payout) => {
    if (!confirm(`Transfer ${formatCurrency(payout.amount)} to ${payout.seller?.name || 'seller'}?`)) return
    setTransferringId(payout.id)
    try {
      await adminTransferPayout(payout.id)
      toast.success('Transfer initiated!')
      loadPayouts()
    } catch (e) {
      toast.error(e.message || 'Transfer failed')
    } finally {
      setTransferringId(null)
    }
  }

  const handleCancel = async (payout) => {
    if (!confirm('Cancel this payout? Earnings go back to available.')) return
    try {
      await adminCancelPayout(payout.id)
      toast.success('Payout cancelled')
      loadPayouts()
    } catch {
      toast.error('Failed to cancel payout')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            <span className="text-white">Seller</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Approve seller applications and process payouts</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTab('requests')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${tab === 'requests' ? 'bg-violet-600 text-white' : 'bg-slate-900/50 text-gray-400 ring-1 ring-slate-800 hover:text-white'}`}
          >
            <FaStore size={13} /> Seller Requests {requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 text-[10px] text-white">{requests.filter(r => r.status === 'pending').length}</span>
            )}
          </button>
          <button
            onClick={() => setTab('payouts')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${tab === 'payouts' ? 'bg-violet-600 text-white' : 'bg-slate-900/50 text-gray-400 ring-1 ring-slate-800 hover:text-white'}`}
          >
            <FaMoneyBillWave size={13} /> Payouts {payouts.filter(p => p.status === 'pending').length > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 text-[10px] text-white">{payouts.filter(p => p.status === 'pending').length}</span>
            )}
          </button>
        </div>

        {tab === 'requests' ? (
          <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800/50 shimmer" />)}
              </div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No seller requests</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-gray-400">Applicant</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Reason</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                          {req.user?.name?.charAt(0)?.toUpperCase() || req.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm text-white">{req.user?.name}</p>
                          <p className="text-xs text-gray-500">{req.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={req.type === 'producer' ? 'warning' : 'info'} className="capitalize">
                        {req.type === 'producer' ? '🎬 Producer' : '🛍️ Seller'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-400 max-w-[220px] line-clamp-2">{req.reason || '—'}</TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDateTime(req.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'destructive'} className="capitalize">
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleApprove(req)} className="text-emerald-400 hover:text-emerald-300">
                              <FaCheck size={14} />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleReject(req)} className="text-red-400 hover:text-red-300">
                              <FaTimes size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800/50 shimmer" />)}
              </div>
            ) : payouts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No payout requests yet</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-gray-400">Seller</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Bank Details</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((p) => (
                  <TableRow key={p.id} className="border-slate-800">
                    <TableCell>
                      <p className="text-sm text-white">{p.seller?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{p.seller?.email}</p>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-white">{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="text-xs text-gray-400 max-w-[220px]">
                      <p>{p.bank_details?.bank_name || '—'}</p>
                      <p>{p.bank_details?.account_name || ''} · {p.bank_details?.account_number || ''}</p>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDateTime(p.created_at)}</TableCell>
                    <TableCell>{payoutStatus[p.status] || <Badge>{p.status}</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleTransfer(p)} disabled={transferringId === p.id} className="text-emerald-400 hover:text-emerald-300">
                              {transferringId === p.id ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" /> : <FaPaperPlane size={13} />}
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleCancel(p)} className="text-red-400 hover:text-red-300">
                              <FaBan size={13} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminSellers
