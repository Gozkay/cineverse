import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_BASE_URL, IMAGE_BASE_URL } from '@/constants/tmdb'

async function searchMovies(query) {
  if (!query || query.length < 2) return []
  const { data } = await axios.get(`${API_BASE_URL}/search/movie`, {
    params: { query, language: 'en-US', page: 1 },
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
  })
  return data.results.map(movie => ({
    ...movie,
    poster_url: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    category: 'movie',
    price: Math.floor(Math.random() * 4000) + 2000,
  }))
}

export function useMovieSearch(query) {
  return useQuery({
    queryKey: ['movieSearch', query],
    queryFn: () => searchMovies(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}
