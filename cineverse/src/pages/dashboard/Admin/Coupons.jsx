import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/coupons'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ code: '', discount_percent: 10, discount_amount: 0, min_amount: 0, max_uses: 0, expires_at: '' })

  const load = async () => {
    try {
      const data = await getCoupons()
      setCoupons(data || [])
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const resetForm = () => {
    setForm({ code: '', discount_percent: 10, discount_amount: 0, min_amount: 0, max_uses: 0, expires_at: '' })
    setEditing(null)
    setShowForm(false)
  }

  const handleSave = async () => {
    if (!form.code.trim()) return toast.error('Code is required')
    const payload = {
      code: form.code.toUpperCase().replace(/\s+/g, ''),
      discount_percent: Number(form.discount_percent) || 0,
      discount_amount: Number(form.discount_amount) || 0,
      min_amount: Number(form.min_amount) || 0,
      max_uses: Number(form.max_uses) || 0,
      expires_at: form.expires_at || null,
    }
    if (payload.discount_percent <= 0 && payload.discount_amount <= 0) return toast.error('Set a discount percent or amount')
    try {
      if (editing) {
        await updateCoupon(editing.id, payload)
        toast.success('Coupon updated')
      } else {
        await createCoupon(payload)
        toast.success('Coupon created')
      }
      resetForm()
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleEdit = (coupon) => {
    setEditing(coupon)
    setForm({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      discount_amount: coupon.discount_amount,
      min_amount: coupon.min_amount,
      max_uses: coupon.max_uses,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    })
    setShowForm(true)
  }

  const handleToggle = async (coupon) => {
    try {
      await updateCoupon(coupon.id, { active: !coupon.active })
      toast.success(coupon.active ? 'Coupon deactivated' : 'Coupon activated')
      await load()
    } catch (e) {
      toast.error(e?.message || 'Action failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await deleteCoupon(id)
      toast.success('Coupon deleted')
      await load()
    } catch (e) {
      toast.error(e?.message || 'Action failed')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              <span className="text-white">Coupon</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage discount coupons</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true) }}>
            + New Coupon
          </Button>
        </div>

        {showForm && (
          <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">{editing ? 'Edit Coupon' : 'New Coupon'}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Code</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" placeholder="SAVE10" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Discount %</label>
                <input type="number" value={form.discount_percent} onChange={e => setForm({ ...form, discount_percent: e.target.value })} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Fixed Discount (₦)</label>
                <input type="number" value={form.discount_amount} onChange={e => setForm({ ...form, discount_amount: e.target.value })} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Min Order (₦)</label>
                <input type="number" value={form.min_amount} onChange={e => setForm({ ...form, min_amount: e.target.value })} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Max Uses (0 = unlimited)</label>
                <input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Expires</label>
                <input type="datetime-local" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No coupons yet</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Code</TableHead>
                <TableHead className="text-gray-400">Discount</TableHead>
                <TableHead className="text-gray-400">Min Order</TableHead>
                <TableHead className="text-gray-400">Uses</TableHead>
                <TableHead className="text-gray-400">Expires</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map(c => (
                <TableRow key={c.id} className="border-slate-800">
                  <TableCell className="font-mono text-sm font-bold text-violet-400">{c.code}</TableCell>
                  <TableCell className="text-sm text-white">
                    {c.discount_percent > 0 ? `${c.discount_percent}%` : ''}
                    {c.discount_percent > 0 && c.discount_amount > 0 ? ' + ' : ''}
                    {c.discount_amount > 0 ? `₦${c.discount_amount.toLocaleString()}` : ''}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{c.min_amount > 0 ? `₦${c.min_amount.toLocaleString()}` : '—'}</TableCell>
                  <TableCell className="text-sm text-gray-400">{c.used_count}{c.max_uses > 0 ? ` / ${c.max_uses}` : ''}</TableCell>
                  <TableCell className="text-xs text-gray-500">{c.expires_at ? formatDateTime(c.expires_at) : 'Never'}</TableCell>
                  <TableCell>
                    <Badge variant={c.active ? 'success' : 'destructive'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-xs" onClick={() => handleToggle(c)} className="text-gray-400 hover:text-white">
                        {c.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="ghost" size="icon-xs" onClick={() => handleEdit(c)} className="text-gray-400 hover:text-white">Edit</Button>
                      <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(c.id)} className="text-red-400">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminCoupons
