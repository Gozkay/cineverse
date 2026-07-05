import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import MovieHero from "@/components/Movies/MovieHero";
import MovieInfo from "@/components/Movies/MovieInfo"; // Fixed: Updated path from MovieHero to MovieInfo
import MovieCast from "@/components/Movies/MovieCast";
import SimilarMovies from "@/components/Movies/SimilarMovies";

function MovieDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const [movie, credits, similar] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          }
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          }
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          }
        ),
      ]);

      return {
        movie: movie.data,
        cast: credits.data.cast,
        similar: similar.data.results,
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        Something went wrong.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 1. Backdrop Image & Gradient Header Background */}
      <MovieHero movie={data.movie} />

      {/* 2. Poster, Meta Info, Description, and Actions */}
      <div className="mx-auto max-w-7xl px-6 relative z-20 -mt-44">
        <MovieInfo movie={data.movie} />

        {/* 3. Cast Carousel (Fixed: Un-commented and hooked up) */}
        <MovieCast cast={data.cast} />

        {/* 4. Similar Movies Grid (Fixed: Un-commented and hooked up) */}
        <SimilarMovies movies={data.similar} />
      </div>
    </div>
  );
}

export default MovieDetails;