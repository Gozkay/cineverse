import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import MovieCard from "./MovieCard";
import MovieSkeleton from "./MovieSkeleton";
import { ROUTES } from "@/constants/routes";

const API_URL = "https://api.themoviedb.org/3/trending/movie/week";

function TrendingMovies() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: async () => {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      });
      return response.data.results;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="font-semibold uppercase text-violet-500">Popular Right Now</p>
              <h2 className="text-5xl font-black text-white">Trending Movies</h2>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <MovieSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl text-red-500">Failed to load movies.</h2>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="font-semibold uppercase text-violet-500">Popular Right Now</p>
            <h2 className="text-5xl font-black text-white">Trending Movies</h2>
          </div>
          <Link to={ROUTES.MOVIES} className="rounded-xl border border-slate-700 px-5 py-3 text-white transition hover:bg-slate-800">
            View All
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data?.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingMovies;
