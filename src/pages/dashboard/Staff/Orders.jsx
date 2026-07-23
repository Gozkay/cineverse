import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { getOrders, updateOrderStatus } from '@/services/orders'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

function StaffOrders() {
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    const data = await getOrders()
    setOrders(data || [])
  }

  useEffect(() => { getOrders().then(data => setOrders(data || [])) }, [])

  const handleStatusUpdate = async (id, status) => {
    await updateOrderStatus(id, status)
    await loadOrders()
    toast.success(`Order updated`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            <span className="text-white">Order</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">View and update order statuses</p>
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Order ID</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Customer</TableHead>
                <TableHead className="text-gray-400">Items</TableHead>
                <TableHead className="text-gray-400">Total</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={7} className="text-center text-gray-500 py-10">No orders available</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="border-slate-800">
                    <TableCell className="font-mono text-xs text-gray-400">#{order.id.slice(0, 10)}</TableCell>
                    <TableCell className="text-xs text-gray-400">{formatDateTime(order.created_at)}</TableCell>
                    <TableCell className="text-sm text-white">{order.shipping_info?.fullName || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="text-sm text-white">{order.items?.length || 0}</span>
                    </TableCell>
                    <TableCell className="text-white font-medium">{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'destructive' : order.status === 'processing' ? 'info' : 'warning'} className="capitalize">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="h-8 rounded-lg border border-slate-700 bg-slate-800 px-2 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StaffOrders
