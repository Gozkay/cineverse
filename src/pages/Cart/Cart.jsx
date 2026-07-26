import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaTrash, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa'
import MainLayout from '@/components/layout/MainLayout'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'

function Cart() {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart()

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="text-white">Shopping</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Cart</span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            <Link to={ROUTES.MOVIES} className="group flex items-center gap-2 text-sm text-gray-400 hover:text-violet-400 transition-colors">
              <FaArrowLeft className="transition-transform group-hover:-translate-x-0.5" /> Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaShoppingCart className="mb-4 text-6xl text-gray-700" />
              <h2 className="mb-2 text-xl font-semibold text-white">Your cart is empty</h2>
              <p className="mb-6 text-gray-500">Looks like you haven't added anything yet.</p>
              <Link to={ROUTES.MOVIES} className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">Start Shopping</Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800"
                  >
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120?text=No' }} />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link to={item.category === 'movie' ? ROUTES.MOVIE_DETAIL(item.id) : item.category === 'book' ? ROUTES.BOOK_DETAIL(item.id) : item.category === 'manga' ? ROUTES.MANGA_DETAIL(item.id) : '#'} className="font-semibold text-white hover:text-violet-400 transition-colors">
                          {item.title}
                        </Link>
                        <p className="text-xs capitalize text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs text-white hover:bg-slate-700">
                            <FaMinus size={10} />
                          </button>
                          <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs text-white hover:bg-slate-700">
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-violet-400">{formatCurrency(item.price * item.quantity)}</span>
                          <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-400 transition-colors">Clear Cart</button>
              </div>

              <div className="h-fit rounded-xl bg-slate-900/50 p-6 ring-1 ring-slate-800">
                <h2 className="mb-4 text-lg font-semibold text-white">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <hr className="border-slate-700" />
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span className="text-violet-400">{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                <Link
                  to={ROUTES.CHECKOUT}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Cart
