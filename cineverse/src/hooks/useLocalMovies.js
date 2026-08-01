import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useLocalMovies(limit = 12) {
  return useQuery({
    queryKey: ['local-movies', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles(name)')
        .eq('category', 'movie')
        .not('seller_id', 'is', null)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw new Error(error.message)
      return data || []
    },
  })
}
