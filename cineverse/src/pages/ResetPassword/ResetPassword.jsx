import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { resetPassword } from '@/services/auth'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Enter your email'); return }
    setLoading(true)
    const result = await resetPassword(email)
    setLoading(false)
    if (result.success) {
      setSent(true)
      toast.success('Check your email for the reset link')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-2xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="text-white">Reset</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Password</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {sent ? 'Check your inbox for the reset link' : "Enter your email and we'll send you a reset link"}
              </p>
            </div>

            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                  <FaEnvelope className="text-2xl text-violet-400" />
                </div>
                <p className="mb-6 text-sm text-gray-400">
                  If an account exists with that email, you'll receive a password reset link shortly.
                </p>
                <Link to={ROUTES.LOGIN} className="text-sm text-violet-400 hover:underline">Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
                  <FaArrowLeft size={12} /> Back to Sign In
                </Link>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default ResetPassword
