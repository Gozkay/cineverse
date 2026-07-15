import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaEye } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { getOrders, updateOrderStatus } from '@/services/orders'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => { setOrders(getOrders()) }, [])

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    setOrders(getOrders())
    toast.success(`Order ${orderId.slice(0, 8)}... updated to ${newStatus}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400">Manage all customer orders</p>
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Order ID</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Items</TableHead>
                <TableHead className="text-gray-400">Total</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={6} className="text-center text-gray-500 py-10">No orders found</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="border-slate-800">
                    <TableCell className="font-mono text-xs text-gray-400">#{order.id.slice(0, 10)}</TableCell>
                    <TableCell className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-white">{order.items?.length || 0} items</span>
                      <div className="text-[10px] text-gray-500">{order.items?.map(i => i.title).join(', ').slice(0, 40)}</div>
                    </TableCell>
                    <TableCell className="text-white font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[order.status] || 'default'} className="capitalize">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="h-8 rounded-lg border border-slate-700 bg-slate-800 px-2 text-xs text-white outline-none focus:border-violet-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button variant="ghost" size="icon-sm" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="text-gray-400 hover:text-white">
                          <FaEye size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selectedOrder && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <h3 className="mb-4 text-lg font-semibold text-white">Order Details #{selectedOrder.id.slice(0, 10)}</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-400">Shipping Info</h4>
                <div className="space-y-1 text-sm text-white">
                  <p>{selectedOrder.shippingInfo?.fullName}</p>
                  <p className="text-gray-400">{selectedOrder.shippingInfo?.address}</p>
                  <p className="text-gray-400">{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state}</p>
                  <p className="text-gray-400">{selectedOrder.shippingInfo?.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-400">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white">{item.title} <span className="text-gray-500">×{item.quantity}</span></span>
                      <span className="text-gray-300">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <hr className="my-2 border-slate-700" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-violet-400">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminOrders
