import { useQuery } from '@tanstack/react-query'
import { getTopManga, getMangaById, searchManga } from '@/services/manga'

export function useManga(page = 1) {
  return useQuery({
    queryKey: ['manga', page],
    queryFn: () => getTopManga(page),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMangaDetails(id) {
  return useQuery({
    queryKey: ['manga', id],
    queryFn: () => getMangaById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useMangaSearch(query) {
  return useQuery({
    queryKey: ['mangaSearch', query],
    queryFn: () => searchManga(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}
