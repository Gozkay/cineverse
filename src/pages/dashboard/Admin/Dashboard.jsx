import { FaBox, FaShoppingBag, FaUsers } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'
import { useDashboardStats, useRevenueData, useOrderVolume, useCategoryBreakdown } from '@/hooks/useDashboardStats'
import StatsGrid from './components/StatsGrid'
import RevenueChart from './components/RevenueChart'
import OrderVolumeChart from './components/OrderVolumeChart'
import CategoryPieChart from './components/CategoryPieChart'

function AdminDashboard() {
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData()
  const { data: orderData, isLoading: orderLoading } = useOrderVolume()
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBreakdown()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
          <p className="text-gray-400">Manage your marketplace</p>
        </div>

        <StatsGrid stats={stats || {}} loading={statsLoading} />

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={revenueData} loading={revenueLoading} />
          <OrderVolumeChart data={orderData} loading={orderLoading} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryPieChart data={categoryData} loading={categoryLoading} />

          <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_PRODUCTS)} className="flex w-full items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 transition-colors">
                <FaBox className="text-violet-400" /> Manage Products
              </button>
              <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_ORDERS)} className="flex w-full items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 transition-colors">
                <FaShoppingBag className="text-blue-400" /> View Orders
              </button>
              <button onClick={() => navigate(ROUTES.DASHBOARD_ADMIN_USERS)} className="flex w-full items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 transition-colors">
                <FaUsers className="text-green-400" /> Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
