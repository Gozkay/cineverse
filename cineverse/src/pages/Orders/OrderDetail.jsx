import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaClipboardList, FaUndo, FaDownload, FaSpinner } from 'react-icons/fa'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { getOrderById } from '@/services/orders'
import { getRefundRequests, createRefundRequest } from '@/services/refunds'
import { getProductBySlug } from '@/services/products'
import { getSignedVideoUrl } from '@/services/seller'
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

const refundStatusColors = {
  pending: 'text-yellow-400 bg-yellow-500/10',
  approved: 'text-emerald-400 bg-emerald-500/10',
  rejected: 'text-red-400 bg-red-500/10',
}

const timeline = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'paid', label: 'Payment Confirmed' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
]

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refunds, setRefunds] = useState([])
  const [showRefundForm, setShowRefundForm] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [submittingRefund, setSubmittingRefund] = useState(false)
  const [downloads, setDownloads] = useState([])
  const [downloadsLoading, setDownloadsLoading] = useState(false)

  useEffect(() => {
    getOrderById(id).then(data => {
      if (!data) { navigate(ROUTES.PROFILE, { replace: true }); return }
      setOrder(data)
      setLoading(false)
    }).catch(() => {
      navigate(ROUTES.PROFILE, { replace: true })
    })
  }, [id, navigate])

  useEffect(() => {
    if (id) getRefundRequests(id).then(setRefunds)
  }, [id])

  useEffect(() => {
    if (!order) return
    const paid = ['paid', 'processing', 'shipped', 'delivered'].includes(order.status)
    if (!paid || !order.items?.length) return

    let cancelled = false
    setDownloadsLoading(true)

    ;(async () => {
      const results = []
      for (const item of order.items) {
        const slug = item.product_slug || item.slug || item.productId
        if (!slug) continue
        try {
          const product = await getProductBySlug(slug)
          if (!product?.video_url) continue
          const url = await getSignedVideoUrl(product.video_url)
          if (url) results.push({ title: item.title, url })
        } catch {
          // skip items that fail to resolve
        }
      }
      if (!cancelled) {
        setDownloads(results)
        setDownloadsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [order])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      </MainLayout>
    )
  }

  if (!order) return null

  const currentStep = timeline.findIndex(t => t.status === order.status)
  const hasPendingRefund = refunds.some(r => r.status === 'pending')
  const canRequestRefund = !hasPendingRefund && order.status !== 'cancelled' && order.status !== 'delivered'

  const handleRefundRequest = async () => {
    if (!refundReason.trim()) return toast.error('Please provide a reason')
    setSubmittingRefund(true)
    try {
      await createRefundRequest(id, refundReason.trim())
      toast.success('Refund request submitted')
      setShowRefundForm(false)
      setRefundReason('')
      const updated = await getRefundRequests(id)
      setRefunds(updated)
    } catch {
      toast.error('Failed to submit refund request')
    }
    setSubmittingRefund(false)
  }

  return (
    <MainLayout>
      <Seo title={`Order #${order.id?.slice(0, 8)}`} noIndex />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link to={ROUTES.PROFILE} className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400 hover:underline">
            <FaArrowLeft size={12} /> Back to Profile
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Order <span className="font-mono text-violet-400">#{order.id?.slice(0, 8)}</span></h1>
            <p className="mt-1 text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[order.status] || 'text-gray-400'}`}>{order.status}</span>
              <span className="text-lg font-bold text-violet-400">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Order Timeline</h2>
            <div className="space-y-0">
              {timeline.map((step, i) => {
                const done = i <= currentStep
                const isLast = i === timeline.length - 1
                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-violet-600 text-white' : 'bg-slate-800 text-gray-500'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      {!isLast && <div className={`mt-0 h-8 w-0.5 ${done ? 'bg-violet-600' : 'bg-slate-800'}`} />}
                    </div>
                    <div className={`pb-6 text-sm ${done ? 'text-white' : 'text-gray-600'}`}>{step.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.title} className="h-12 w-9 rounded object-cover ring-1 ring-slate-700" />}
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-violet-400">{formatCurrency(item.price * item.quantity)}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {order.shipping_info && (
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Shipping</h2>
              <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <p className="text-sm text-gray-300">{order.shipping_info.fullName || order.shipping_info.name}</p>
                <p className="text-sm text-gray-400">{order.shipping_info.address}</p>
                <p className="text-sm text-gray-400">{order.shipping_info.city}, {order.shipping_info.state} {order.shipping_info.zip}</p>
                <p className="text-sm text-gray-400">{order.shipping_info.country}</p>
                <p className="text-sm text-gray-400">{order.shipping_info.phone}</p>
              </div>
            </div>
          )}

          {(downloadsLoading || downloads.length > 0) && (
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Digital Downloads</h2>
              <div className="space-y-3">
                {downloadsLoading && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-900/50 p-4 text-sm text-gray-400 ring-1 ring-slate-800">
                    <FaSpinner className="animate-spin text-violet-400" size={14} /> Preparing your downloads...
                  </div>
                )}
                {downloads.map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-4 ring-1 ring-emerald-500/20">
                    <div>
                      <p className="text-sm font-medium text-white">{d.title}</p>
                      <p className="text-xs text-gray-500">Digital movie — link valid for 1 hour</p>
                    </div>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      <FaDownload size={12} /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-gray-300">{formatCurrency(order.total_amount)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-emerald-400">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-gray-300">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">Total</span>
                <span className="text-violet-400">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-gray-500">Ref: {order.payment_ref || '—'}</span>
              </div>
            </div>
          </div>

          {refunds.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Refund Requests</h2>
              <div className="space-y-3">
                {refunds.map(r => (
                  <div key={r.id} className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${refundStatusColors[r.status]}`}>{r.status}</span>
                      <span className="text-xs text-gray-500">{formatDateTime(r.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-300">{r.reason}</p>
                    {r.admin_note && <p className="mt-2 text-xs text-gray-500">Admin note: {r.admin_note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {canRequestRefund && (
            <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              {showRefundForm ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-red-400"><FaUndo className="mr-1.5 inline" size={12} />Request Refund</h3>
                  <textarea value={refundReason} onChange={e => setRefundReason(e.target.value)} className="w-full rounded-lg bg-slate-800 p-3 text-sm text-white ring-1 ring-slate-700 outline-none focus:ring-violet-500" rows={3} placeholder="Tell us why you'd like a refund..." />
                  <div className="flex gap-2">
                    <button onClick={handleRefundRequest} disabled={submittingRefund} className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50">{submittingRefund ? 'Submitting...' : 'Submit Request'}</button>
                    <button onClick={() => { setShowRefundForm(false); setRefundReason('') }} className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-gray-400 hover:text-white">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowRefundForm(true)} className="flex items-center gap-2 text-sm text-red-400 hover:underline">
                  <FaUndo size={12} /> Request Refund
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default OrderDetail
