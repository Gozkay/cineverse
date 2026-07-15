import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieSkeleton from "./MovieSkeleton";
import { ROUTES } from "@/constants/routes";
import { useTrendingMovies } from "@/hooks/useTrendingMovies";

function TrendingMovies() {
  const { data, isLoading, isError } = useTrendingMovies();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">Popular Right Now</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Trending Movies</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">Popular Right Now</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-1">
              <span className="text-white">Trending</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Movies</span>
            </h2>
          </div>
          <Link to={ROUTES.MOVIES} className="group rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm">
            View All
            <span className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data?.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingMovies;
