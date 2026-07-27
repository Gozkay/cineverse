import { useState, useEffect } from 'react'
import { FaUserTie, FaBan, FaCheck, FaPause, FaPlay, FaTrash, FaUserPlus } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { getUsers, banUser, unbanUser, suspendUser, unsuspendUser, removeStaff } from '@/services/auth'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

function StaffManagement() {
  const [staff, setStaff] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newStaff, setNewStaff] = useState(() => ({
    name: '', email: '', password: Math.random().toString(36).slice(-10)
  }))

  const loadStaff = async () => {
    const data = await getUsers()
    setStaff((data || []).filter(u => u.role === 'staff'))
  }

  useEffect(() => { getUsers().then(data => setStaff((data || []).filter(u => u.role === 'staff'))) }, [])

  const handleBan = async (id, isBanned) => {
    if (isBanned) await unbanUser(id)
    else await banUser(id)
    await loadStaff()
    toast.success(isBanned ? 'Staff unbanned' : 'Staff banned')
  }

  const handleSuspend = async (id, isSuspended) => {
    if (isSuspended) await unsuspendUser(id)
    else await suspendUser(id)
    await loadStaff()
    toast.success(isSuspended ? 'Staff unsuspended' : 'Staff suspended')
  }

  const handleRemove = async (id) => {
    if (window.confirm('Remove this staff member permanently?')) {
      await removeStaff(id)
      await loadStaff()
      toast.success('Staff removed')
    }
  }

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email) { toast.error('Name and email are required'); return }
    const { error } = await supabase.auth.signUp({
      email: newStaff.email,
      password: newStaff.password,
      options: { data: { name: newStaff.name } },
    })
    if (error) { toast.error(error.message); return }
    await loadStaff()
    setDialogOpen(false)
    setNewStaff({ name: '', email: '', password: Math.random().toString(36).slice(-10) })
    toast.success('Staff member added')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              <span className="text-white">Staff</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage staff accounts — ban, suspend, or remove access</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                <FaUserPlus className="mr-2" size={14} /> Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader><DialogTitle>Add New Staff</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Name</label>
                  <Input value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="border-slate-700 bg-slate-800 text-white" placeholder="Staff name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Email</label>
                  <Input type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="border-slate-700 bg-slate-800 text-white" placeholder="staff@cineverse.com" />
                </div>
                <Button onClick={handleAddStaff} className="w-full bg-violet-600 hover:bg-violet-500 text-white">Add Staff</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {staff.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <FaUserTie className="mb-4 text-5xl text-gray-700" />
            <h2 className="text-lg font-semibold text-white">No staff members</h2>
            <p className="text-gray-400">Add staff to manage orders and operations</p>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-gray-400">Staff</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Joined</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((user) => (
                  <TableRow key={user.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm text-white">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">{user.email}</TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : user.suspended ? (
                        <Badge variant="warning">Suspended</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDateTime(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => handleBan(user.id, user.banned)} className={user.banned ? 'text-green-400' : 'text-red-400'}>
                          {user.banned ? <FaCheck size={12} /> : <FaBan size={12} />}
                        </Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => handleSuspend(user.id, user.suspended)} className={user.suspended ? 'text-green-400' : 'text-yellow-400'}>
                          {user.suspended ? <FaPlay size={12} /> : <FaPause size={12} />}
                        </Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => handleRemove(user.id)} className="text-red-400 hover:text-red-300">
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StaffManagement
