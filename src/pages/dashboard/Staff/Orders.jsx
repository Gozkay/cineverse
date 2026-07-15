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

  useEffect(() => { setOrders(getOrders()) }, [])

  const handleStatusUpdate = (id, status) => {
    updateOrderStatus(id, status)
    setOrders(getOrders())
    toast.success(`Order ${id.slice(0, 8)}... updated`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-gray-400">View and update order statuses</p>
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
                    <TableCell className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell className="text-sm text-white">{order.shippingInfo?.fullName || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="text-sm text-white">{order.items?.length || 0}</span>
                    </TableCell>
                    <TableCell className="text-white font-medium">{formatCurrency(order.totalAmount)}</TableCell>
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
