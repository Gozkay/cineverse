import { useQuery } from '@tanstack/react-query'
import { searchBooks, getBookById, getBooksByCategory } from '@/services/books'

export function useBooks(category = 'fiction') {
  return useQuery({
    queryKey: ['books', category],
    queryFn: () => getBooksByCategory(category),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBookDetails(id) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBookSearch(query) {
  return useQuery({
    queryKey: ['bookSearch', query],
    queryFn: () => searchBooks(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}
