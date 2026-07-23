import { useState, useEffect } from 'react'
import { FaBan, FaCheck, FaPause, FaPlay, FaTrash } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { getUsers, banUser, unbanUser, suspendUser, unsuspendUser, removeStaff } from '@/services/auth'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data || [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const handleBan = async (id, isBanned) => {
    try {
      if (isBanned) await unbanUser(id)
      else await banUser(id)
      await loadUsers()
      toast.success(isBanned ? 'User unbanned' : 'User banned')
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const handleSuspend = async (id, isSuspended) => {
    try {
      if (isSuspended) await unsuspendUser(id)
      else await suspendUser(id)
      await loadUsers()
      toast.success(isSuspended ? 'User unsuspended' : 'User suspended')
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const handleRemove = async (id) => {
    try {
      await removeStaff(id)
      await loadUsers()
      toast.success('User removed')
    } catch {
      toast.error('Failed to remove user')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            <span className="text-white">User</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage registered users</p>
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="h-8 w-48 animate-pulse rounded-full bg-slate-800/80 shimmer mx-auto mb-3" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-slate-800/80 shimmer mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Role</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Joined</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm text-white">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{user.email || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'warning' : user.role === 'staff' ? 'info' : 'secondary'} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
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
                      {user.role !== 'admin' && (
                        <>
                          <Button variant="ghost" size="icon-xs" onClick={() => handleBan(user.id, user.banned)} className={user.banned ? 'text-green-400' : 'text-red-400'}>
                            {user.banned ? <FaCheck size={12} /> : <FaBan size={12} />}
                          </Button>
                          {user.role === 'staff' && (
                            <>
                              <Button variant="ghost" size="icon-xs" onClick={() => handleSuspend(user.id, user.suspended)} className={user.suspended ? 'text-green-400' : 'text-yellow-400'}>
                                {user.suspended ? <FaPlay size={12} /> : <FaPause size={12} />}
                              </Button>
                              <Button variant="ghost" size="icon-xs" onClick={() => handleRemove(user.id)} className="text-red-400">
                                <FaTrash size={12} />
                              </Button>
                            </>
                          )}
                        </>
                      )}
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

export default AdminUsers
