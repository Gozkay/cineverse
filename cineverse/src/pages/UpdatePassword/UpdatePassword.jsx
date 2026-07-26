import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { updatePassword } from '@/services/auth'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash || !hash.includes('access_token')) {
      toast.error('Invalid or expired reset link')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    const result = await updatePassword(password)
    setLoading(false)
    if (result.success) {
      toast.success('Password updated!')
      navigate(ROUTES.LOGIN)
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
                <span className="text-white">New</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Password</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500">Choose a new password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-10 text-sm text-white outline-none focus:border-violet-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {show ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type={show ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default UpdatePassword
