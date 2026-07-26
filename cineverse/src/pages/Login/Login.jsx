import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ROUTES.HOME

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async ({ email, password }) => {
    const result = await login(email, password)
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
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="text-white">Welcome</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Back</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500">Sign in to your CineVerse account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type="email" {...register('email')} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="••••••••" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-10 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

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
