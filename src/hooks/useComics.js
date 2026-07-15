import { useQuery } from '@tanstack/react-query'
import { getComicsBySubject, searchComics } from '@/services/comics'

export function useComics(subject = 'comics') {
  return useQuery({
    queryKey: ['comics', subject],
    queryFn: () => getComicsBySubject(subject),
    staleTime: 5 * 60 * 1000,
  })
}

export function useComicSearch(query) {
  return useQuery({
    queryKey: ['comicSearch', query],
    queryFn: () => searchComics(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}
