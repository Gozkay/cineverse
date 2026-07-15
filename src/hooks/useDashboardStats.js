import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { data: orders } = await supabase.from('orders').select('total_amount, status, created_at')
      const ordersList = orders || []
      const totalRevenue = ordersList.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      const pendingCount = ordersList.filter(o => o.status === 'pending').length
      return {
        users: userCount || 0,
        orders: ordersList.length,
        revenue: totalRevenue,
        pending: pendingCount,
      }
    },
    staleTime: 60 * 1000,
  })
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['revenueData'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .in('status', ['delivered', 'shipped', 'processing'])

      const dailyMap = {}
      for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (29 - i))
        dailyMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0
      }

      ;(data || []).forEach((order) => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (dailyMap[date] !== undefined) {
          dailyMap[date] += order.total_amount || 0
        }
      })

      return {
        labels: Object.keys(dailyMap),
        values: Object.values(dailyMap),
      }
    },
    staleTime: 60 * 1000,
  })
}

export function useOrderVolume() {
  return useQuery({
    queryKey: ['orderVolume'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data } = await supabase
        .from('orders')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())

      const dailyMap = {}
      for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (29 - i))
        dailyMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0
      }

      ;(data || []).forEach((order) => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (dailyMap[date] !== undefined) {
          dailyMap[date]++
        }
      })

      return {
        labels: Object.keys(dailyMap),
        values: Object.values(dailyMap),
      }
    },
    staleTime: 60 * 1000,
  })
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ['categoryBreakdown'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('items')
      const categoryTotals = { movie: 0, book: 0, manga: 0, comic: 0 }

      ;(data || []).forEach((order) => {
        (order.items || []).forEach((item) => {
          const cat = item.category
          if (categoryTotals[cat] !== undefined) {
            categoryTotals[cat] += (item.price || 0) * (item.quantity || 1)
          }
        })
      })

      return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
    },
    staleTime: 60 * 1000,
  })
}
