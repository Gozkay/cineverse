import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    const result = await register({ name: form.name, email: form.email, password: form.password })
    setLoading(false)
    if (result.success) {
      toast.success('Account created successfully!')
      navigate(ROUTES.HOME)
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
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
              <p className="mt-2 text-gray-400">Join CineVerse today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type="text" value={form.name} onChange={handleChange('name')} placeholder="John Doe" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="••••••••" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-10 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="••••••••" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <Link to={ROUTES.LOGIN} className="text-violet-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default Register
