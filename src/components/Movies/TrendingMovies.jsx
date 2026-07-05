import { useTrendingMovies } from "@/hooks/useTrendingMovies";
import MovieCard from "./MovieCard";

function TrendingMovies() {

  const {
    data: movies,
    isLoading,
    isError,
  } = useTrendingMovies();

  if (isLoading)
    return <h2 className="text-center py-20">Loading...</h2>;

  if (isError)
    return <h2 className="text-center py-20">Something went wrong.</h2>;

  return (
    <section className="py-20 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-10 text-5xl font-black">
          Trending Movies
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">

          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}

        </div>

      </div>
    </section>
  );
}

export default TrendingMovies;