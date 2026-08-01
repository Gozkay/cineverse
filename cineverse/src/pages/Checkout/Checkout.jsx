import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaArrowLeft, FaCheck, FaCreditCard, FaTruck, FaShoppingBag, FaTag, FaTimes } from 'react-icons/fa'
import Seo from '@/components/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import { usePaystack } from '@/hooks/usePaystack'
import { createOrder } from '@/services/orders'
import { getCouponByCode, validateCoupon, incrementCouponUsage } from '@/services/coupons'
import toast from 'react-hot-toast'

const steps = ['Review Cart', 'Shipping Info', 'Payment', 'Confirmation']

const shippingSchema = z.object({
  fullName: z.string().min(1, 'Required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().optional(),
  phone: z.string().min(1, 'Required'),
})

function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user, profile, isAuthenticated } = useAuth()
  const { initializePayment } = usePaystack()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [paying, setPaying] = useState(false)
  const [payment, setPayment] = useState({ method: 'card' })
  const [shippingData, setShippingData] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const total = subtotal - discount

  const stepsIcons = [FaShoppingBag, FaTruck, FaCreditCard, FaCheck]

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: profile?.name || user?.user_metadata?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
    },
    resolver: zodResolver(shippingSchema),
  })

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: { pathname: ROUTES.CHECKOUT } }} replace />
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Enter a coupon code')
    setApplyingCoupon(true)
    const c = await getCouponByCode(couponCode.trim())
    const result = validateCoupon(c, subtotal)
    if (result.valid) {
      setCoupon(c)
      setDiscount(result.discount)
      toast.success(`Coupon applied! You save ${formatCurrency(result.discount)}`)
    } else {
      toast.error(result.reason)
    }
    setApplyingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    setCoupon(null)
    setDiscount(0)
    setCouponCode('')
  }

  const placeOrder = async (paymentRef) => {
    const orderData = {
      user_id: user.id,
      items: items.map(item => ({
        product_slug: item.product_slug || item.id,
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
      })),
      total_amount: total,
      discount,
      coupon_code: coupon?.code || null,
      status: 'pending',
      shipping_info: shippingData,
      payment_method: payment.method,
      payment_ref: paymentRef || null,
    }
    try {
      if (coupon) await incrementCouponUsage(coupon.id)
      const order = await createOrder(orderData)
      setOrderId(order.id)
      setOrderPlaced(true)
      clearCart()
      setStep(4)
      toast.success('Order placed successfully!')
    } catch {
      toast.error('Failed to place order. Please try again.')
    }
  }

  const handlePayWithPaystack = () => {
    setPaying(true)
    initializePayment({
      email: shippingData?.email || user?.email || 'customer@cineverse.com',
      amount: total,
      onSuccess: (ref) => {
        setPaying(false)
        placeOrder(ref)
      },
      onClose: () => {
        setPaying(false)
        toast.error('Payment cancelled')
      },
    })
  }

  const handlePlaceOrder = async () => {
    if (payment.method === 'card') {
      handlePayWithPaystack()
    } else {
      await placeOrder(null)
    }
  }

  const onShippingSubmit = (data) => {
    setShippingData(data)
    setStep(3)
  }

  const renderStepIndicator = () => (
    <div className="mb-10 flex items-center justify-center">
      {steps.map((s, i) => {
        const Icon = stepsIcons[i]
        const active = step >= i + 1
        return (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${active ? 'text-violet-400' : 'text-gray-600'}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${active ? 'bg-violet-600 text-white' : 'bg-slate-800 text-gray-500'}`}>
                {step > i + 1 ? <FaCheck size={14} /> : <Icon size={14} />}
              </div>
              <span className={`hidden text-sm font-medium sm:inline ${active ? 'text-white' : 'text-gray-500'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`mx-3 h-px w-12 transition-all ${step > i + 1 ? 'bg-violet-500' : 'bg-slate-700'}`} />}
          </div>
        )
      })}
    </div>
  )

  if (items.length === 0 && !orderPlaced) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="text-center">
            <FaShoppingBag className="mx-auto mb-4 text-6xl text-gray-700" />
            <h2 className="mb-2 text-xl font-semibold text-white">Your cart is empty</h2>
            <Link to={ROUTES.MOVIES} className="text-violet-400 hover:underline">Start Shopping</Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Seo title="Checkout" noIndex />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link to={ROUTES.CART} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-violet-400 transition-colors">
            <FaArrowLeft /> Back to Cart
          </Link>

          <h1 className="mb-8 text-3xl sm:text-4xl font-black">
            <span className="text-white">Complete</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Checkout</span>
          </h1>
          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Review Your Items</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120?text=No' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.category} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-violet-400">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}

                <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800 space-y-3">
                  <h3 className="text-sm font-semibold text-violet-400"><FaTag className="mr-1.5 inline" size={12} />Coupon</h3>
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-sm">
                      <span className="font-mono text-emerald-400">{coupon.code}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-emerald-400">-{formatCurrency(discount)}</span>
                        <button onClick={handleRemoveCoupon} className="text-gray-500 hover:text-white"><FaTimes size={12} /></button>
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        className="h-9 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white uppercase outline-none focus:border-violet-500"
                        placeholder="Enter coupon code"
                      />
                      <button onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode.trim()} className="h-9 rounded-lg bg-violet-600 px-4 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50">
                        {applyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-emerald-400">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-violet-400">{formatCurrency(total)}</span>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">Continue to Shipping</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Shipping Information</h2>
                <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-gray-400">Full Name</label>
                      <input {...register('fullName')} className={`h-10 w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                      {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-gray-400">Email</label>
                      <input {...register('email')} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-gray-400">Address</label>
                      <input {...register('address')} className={`h-10 w-full rounded-lg border ${errors.address ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                      {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">City</label>
                      <input {...register('city')} className={`h-10 w-full rounded-lg border ${errors.city ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                      {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">State</label>
                      <input {...register('state')} className={`h-10 w-full rounded-lg border ${errors.state ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                      {errors.state && <p className="mt-1 text-xs text-red-400">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">ZIP Code</label>
                      <input {...register('zip')} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Phone</label>
                      <input {...register('phone')} className={`h-10 w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                      {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-medium text-gray-300 hover:bg-slate-800 transition-colors">Back</button>
                    <button type="submit" className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">Continue to Payment</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  {['card', 'transfer', 'cash'].map((method) => (
                    <button key={method} onClick={() => setPayment({ ...payment, method })} className={`flex-1 rounded-xl border py-3 text-sm font-medium capitalize transition-all ${payment.method === method ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-slate-700 text-gray-400 hover:bg-slate-800'}`}>
                      {method === 'card' ? <><FaCreditCard className="mr-2 inline" /> Card</> : method === 'transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                    </button>
                  ))}
                </div>
                {payment.method === 'card' && (
                  <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800 text-sm text-gray-400">
                    Pay <span className="font-semibold text-white">{formatCurrency(total)}</span> securely via <span className="font-medium text-violet-400">Paystack</span>.
                    <p className="mt-2 text-xs text-gray-500">You&apos;ll be redirected to Paystack&apos;s secure checkout. We support cards, bank transfer, USSD, and mobile money.</p>
                  </div>
                )}
                {payment.method === 'transfer' && (
                  <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800 text-sm text-gray-400">
                    Transfer the total amount of <span className="font-semibold text-white">{formatCurrency(total)}</span> to:<br />
                    <span className="mt-2 block font-mono text-white">CineVerse Bank<br />Account: 0123456789<br />Sort Code: 01-02-03</span>
                  </div>
                )}
                {payment.method === 'cash' && (
                  <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800 text-sm text-gray-400">
                    Pay <span className="font-semibold text-white">{formatCurrency(total)}</span> upon delivery. No extra fees.
                  </div>
                )}
                <div className="space-y-2 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-emerald-400">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-violet-400">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-medium text-gray-300 hover:bg-slate-800 transition-colors">Back</button>
                  <button onClick={handlePlaceOrder} disabled={paying} className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors">{paying ? 'Processing...' : `Place Order — ${formatCurrency(total)}`}</button>
                </div>
              </motion.div>
            )}

            {step === 4 && orderPlaced && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                  <FaCheck className="text-4xl text-green-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Order Placed!</h2>
                <p className="mb-2 text-gray-400">Your order has been placed successfully.</p>
                {discount > 0 && <p className="mb-2 text-sm text-emerald-400">You saved {formatCurrency(discount)} with coupon!</p>}
                <p className="mb-8 text-sm text-gray-500">Order ID: <span className="font-mono text-violet-400">{orderId}</span></p>
                <div className="flex gap-4">
                  <Link to={ROUTES.HOME} className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500">Continue Shopping</Link>
                  <Link to={ROUTES.PROFILE} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-slate-800">View Orders</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  )
}

export default Checkout
