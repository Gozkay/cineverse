import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMovieVideos(id) {
  return useQuery({
    queryKey: ["movieVideos", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        }
      );

      return response.data.results;
    },
    enabled: !!id,
  });
}