import { useQuery } from "@tanstack/react-query";
import tmdb from "@/api/tmdb";

const fetchTrendingMovies = async () => {
  const response = await tmdb.get("/trending/movie/week");
  return response.data.results;
};

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["trending-movies"],
    queryFn: fetchTrendingMovies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}