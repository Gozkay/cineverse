import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  sellerType: z.enum(['none', 'seller', 'producer']).default('none'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [sellerType, setSellerType] = useState('none')
  const [resending, setResending] = useState(false)
  const { register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && registered) {
      navigate(ROUTES.HOME, { replace: true })
    }
  }, [isAuthenticated, registered, navigate])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async ({ name, email, password, sellerType }) => {
    const result = await registerUser({ name, email, password, sellerType })
    if (result.success) {
      setRegistered(true)
      setRegisteredEmail(email)
      toast.success('Account created! Check your email to verify.')
    } else {
      toast.error(result.error)
    }
  }

  const handleResend = async () => {
    if (!registeredEmail) return
    setResending(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email: registeredEmail })
    setResending(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Confirmation email sent! Check your inbox.')
    }
  }

  return (
    <MainLayout>
      <Seo title="Create Account" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-2xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="text-white">Create</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Account</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500">Join CineVerse today</p>
            </div>

            {registered ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                  <FaEnvelope className="text-2xl text-violet-400" />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-white">Check your email</h2>
                <p className="mb-6 text-sm text-gray-400">
                  We sent a verification link to                   <span className="text-violet-400">{registeredEmail}</span>. Click the link to activate your account.
                </p>
                {sellerType !== 'none' && (
                  <p className="mb-6 rounded-xl bg-violet-500/10 p-3 text-xs text-violet-300 ring-1 ring-violet-500/20">
                    You applied as a {sellerType === 'producer' ? 'movie producer' : 'seller'}. Once your account is verified, our team will review your application.
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Didn't receive it? Check your spam folder or try signing up again.
                </p>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/20 disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend confirmation email'}
                </button>
                <p className="mt-3 text-xs text-gray-600">Links expire after a while — if the old link says it failed, resend and use the newest email.</p>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account? <Link to={ROUTES.LOGIN} className="text-violet-400 hover:underline">Sign in</Link>
                </p>
              </div>
            ) : (
            <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type="text" {...register('name')} placeholder="John Doe" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

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

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="••••••••" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Are you a seller or movie producer?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'none', label: 'No, just shopping' },
                    { value: 'seller', label: "I'm a seller" },
                    { value: 'producer', label: "I'm a movie producer" },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-center text-xs transition-colors ${sellerType === opt.value ? 'border-violet-500 bg-violet-500/15 text-violet-300' : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600'}`}
                    >
                      <input type="radio" className="sr-only" {...register('sellerType')} value={opt.value} onChange={() => setSellerType(opt.value)} checked={sellerType === opt.value} />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {sellerType !== 'none' && (
                  <p className="mt-2 text-xs text-gray-500">
                    Your seller application will be reviewed by our team after you sign up.
                  </p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors">
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <Link to={ROUTES.LOGIN} className="text-violet-400 hover:underline">Sign in</Link>
            </p>
            </>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default Register
