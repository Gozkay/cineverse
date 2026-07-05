import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "@/services/movieService";

export function useMovieDetails(id) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });
}