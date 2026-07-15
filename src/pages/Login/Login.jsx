import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ROUTES.HOME

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`)
      navigate(from, { replace: true })
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
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="mt-2 text-gray-400">Sign in to your CineVerse account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-10 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <span className="text-gray-500">Demo: </span>
              <button onClick={() => { setEmail('admin@cineverse.com'); setPassword('admin123') }} className="text-violet-400 hover:underline mx-1">Admin</button>
              <button onClick={() => { setEmail('manager@cineverse.com'); setPassword('manager123') }} className="text-violet-400 hover:underline mx-1">Manager</button>
              <button onClick={() => { setEmail('staff1@cineverse.com'); setPassword('staff123') }} className="text-violet-400 hover:underline mx-1">Staff</button>
              <button onClick={() => { setEmail('john@example.com'); setPassword('customer123') }} className="text-violet-400 hover:underline mx-1">Customer</button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account? <Link to={ROUTES.REGISTER} className="text-violet-400 hover:underline">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default Login
