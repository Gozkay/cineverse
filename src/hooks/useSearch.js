import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_BASE_URL, IMAGE_BASE_URL } from '@/constants/tmdb'

async function searchMovies(query, page = 1) {
  if (!query || query.length < 2) return { results: [], totalPages: 0 }
  const { data } = await axios.get(`${API_BASE_URL}/search/movie`, {
    params: { query, language: 'en-US', page },
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
  })
  return {
    results: data.results.map(movie => ({
      ...movie,
      poster_url: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
      category: 'movie',
      price: (parseInt(movie.id?.toString().slice(-8) || '0', 36) % 2000) + 2000,
    })),
    totalPages: data.total_pages || 0,
  }
}

export function useMovieSearch(query, page = 1) {
  return useQuery({
    queryKey: ['movieSearch', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}
