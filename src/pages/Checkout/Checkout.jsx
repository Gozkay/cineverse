import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaCheck, FaCreditCard, FaTruck, FaClipboardList, FaShoppingBag } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import { createOrder } from '@/services/orders'
import toast from 'react-hot-toast'

const steps = ['Review Cart', 'Shipping Info', 'Payment', 'Confirmation']

function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  })
  const [payment, setPayment] = useState({ method: 'card', cardNumber: '', cardName: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})

  const stepsIcons = [FaShoppingBag, FaTruck, FaCreditCard, FaCheck]

  const validateShipping = () => {
    const errs = {}
    if (!shipping.fullName.trim()) errs.fullName = 'Required'
    if (!shipping.address.trim()) errs.address = 'Required'
    if (!shipping.city.trim()) errs.city = 'Required'
    if (!shipping.state.trim()) errs.state = 'Required'
    if (!shipping.phone.trim()) errs.phone = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePlaceOrder = () => {
    const orderData = {
      userId: user?.id || 'guest',
      items: items.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
      })),
      totalAmount: subtotal,
      status: 'pending',
      shippingInfo: shipping,
      paymentMethod: payment.method,
    }
    const order = createOrder(orderData)
    setOrderId(order.id)
    setOrderPlaced(true)
    clearCart()
    setStep(4)
    toast.success('Order placed successfully!')
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
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link to={ROUTES.CART} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-violet-400 transition-colors">
            <FaArrowLeft /> Back to Cart
          </Link>

          <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
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
                <div className="flex justify-between rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-violet-400">{formatCurrency(subtotal)}</span>
                </div>
                <button onClick={() => setStep(2)} className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">Continue to Shipping</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Shipping Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-gray-400">Full Name</label>
                    <input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className={`h-10 w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                    {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-gray-400">Email</label>
                    <input value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-gray-400">Address</label>
                    <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className={`h-10 w-full rounded-lg border ${errors.address ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                    {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-400">City</label>
                    <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className={`h-10 w-full rounded-lg border ${errors.city ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                    {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-400">State</label>
                    <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className={`h-10 w-full rounded-lg border ${errors.state ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                    {errors.state && <p className="mt-1 text-xs text-red-400">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-400">ZIP Code</label>
                    <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-400">Phone</label>
                    <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className={`h-10 w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-700'} bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500`} />
                    {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-medium text-gray-300 hover:bg-slate-800 transition-colors">Back</button>
                  <button onClick={() => { if (validateShipping()) setStep(3) }} className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">Continue to Payment</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                <div className="flex gap-3">
                  {['card', 'transfer', 'cash'].map((method) => (
                    <button key={method} onClick={() => setPayment({ ...payment, method })} className={`flex-1 rounded-xl border py-3 text-sm font-medium capitalize transition-all ${payment.method === method ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-slate-700 text-gray-400 hover:bg-slate-800'}`}>
                      {method === 'card' ? <><FaCreditCard className="mr-2 inline" /> Card</> : method === 'transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                    </button>
                  ))}
                </div>
                {payment.method === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Card Number</label>
                      <input placeholder="4242 4242 4242 4242" value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Cardholder Name</label>
                      <input placeholder="John Doe" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs text-gray-400">Expiry</label>
                        <input placeholder="MM/YY" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-400">CVV</label>
                        <input placeholder="123" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white outline-none focus:border-violet-500" />
                      </div>
                    </div>
                  </div>
                )}
                {payment.method === 'transfer' && (
                  <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800 text-sm text-gray-400">
                    Transfer the total amount of <span className="font-semibold text-white">{formatCurrency(subtotal)}</span> to:<br />
                    <span className="mt-2 block font-mono text-white">CineVerse Bank<br />Account: 0123456789<br />Sort Code: 01-02-03</span>
                  </div>
                )}
                {payment.method === 'cash' && (
                  <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800 text-sm text-gray-400">
                    Pay <span className="font-semibold text-white">{formatCurrency(subtotal)}</span> upon delivery. No extra fees.
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-medium text-gray-300 hover:bg-slate-800 transition-colors">Back</button>
                  <button onClick={handlePlaceOrder} className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-500 transition-colors">Place Order — {formatCurrency(subtotal)}</button>
                </div>
              </motion.div>
            )}

            {step === 4 && orderPlaced && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                  <FaCheck className="text-4xl text-green-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Order Placed! 🎉</h2>
                <p className="mb-2 text-gray-400">Your order has been placed successfully.</p>
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
