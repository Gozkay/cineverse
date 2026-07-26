import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaStore, FaCheck, FaTimes, FaHourglassHalf } from 'react-icons/fa'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

function BecomeSeller() {
  const { user, isAuthenticated, role } = useAuth()
  const [request, setRequest] = useState(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase.from('seller_requests').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      setRequest(data)
      setLoading(false)
    })
  }, [user])

  const handleSubmit = async () => {
    if (!reason.trim()) return toast.error('Please tell us why you want to become a seller')
    setSubmitting(true)
    const { error } = await supabase.from('seller_requests').insert({ user_id: user.id, reason: reason.trim() })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Request submitted! An admin will review it.')
      setRequest({ status: 'pending', reason: reason.trim() })
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      </MainLayout>
    )
  }

  if (role === 'admin' || role === 'manager' || role === 'staff') {
    return (
      <MainLayout>
        <Seo title="Become a Seller" noIndex />
        <div className="min-h-screen bg-slate-950">
          <div className="mx-auto max-w-xl px-6 py-16 text-center">
            <FaStore className="mx-auto mb-6 text-6xl text-violet-400" />
            <h1 className="mb-2 text-2xl font-bold text-white">You are already a seller</h1>
            <p className="text-gray-500">Your account has seller/staff privileges.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Seo title="Become a Seller" noIndex />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-xl px-6 py-16">
          <div className="text-center mb-8">
            <FaStore className="mx-auto mb-4 text-5xl text-violet-400" />
            <h1 className="text-3xl font-black">
              <span className="text-white">Become a</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Seller</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">Sell your products on CineVerse marketplace</p>
          </div>

          {!isAuthenticated ? (
            <div className="rounded-xl bg-slate-900/50 p-6 text-center ring-1 ring-slate-800">
              <p className="mb-4 text-gray-400">Sign in or create an account to apply.</p>
              <Link to={ROUTES.REGISTER} className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500">Get Started</Link>
            </div>
          ) : request?.status === 'pending' ? (
            <div className="rounded-xl bg-slate-900/50 p-8 text-center ring-1 ring-slate-800">
              <FaHourglassHalf className="mx-auto mb-4 text-4xl text-yellow-400" />
              <h2 className="mb-2 text-lg font-semibold text-white">Request Pending</h2>
              <p className="text-sm text-gray-400">Your application is being reviewed by our team.</p>
            </div>
          ) : request?.status === 'approved' ? (
            <div className="rounded-xl bg-slate-900/50 p-8 text-center ring-1 ring-slate-800">
              <FaCheck className="mx-auto mb-4 text-4xl text-emerald-400" />
              <h2 className="mb-2 text-lg font-semibold text-white">Approved!</h2>
              <p className="text-sm text-gray-400">You are now a seller. Start listing your products.</p>
            </div>
          ) : request?.status === 'rejected' ? (
            <div className="rounded-xl bg-slate-900/50 p-8 text-center ring-1 ring-slate-800">
              <FaTimes className="mx-auto mb-4 text-4xl text-red-400" />
              <h2 className="mb-2 text-lg font-semibold text-white">Not Approved</h2>
              <p className="text-sm text-gray-400">Your request was not approved at this time.</p>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl bg-slate-900/50 p-6 ring-1 ring-slate-800">
              <h2 className="text-lg font-semibold text-white">Apply to Sell</h2>
              <p className="text-sm text-gray-400">Tell us why you'd like to become a seller on CineVerse.</p>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 text-sm text-white ring-1 ring-slate-700 outline-none focus:ring-violet-500"
                rows={4}
                placeholder="I have a collection of rare manga and comics I'd like to sell..."
              />
              <button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default BecomeSeller
