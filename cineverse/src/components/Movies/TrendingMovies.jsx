import MovieCard from "./MovieCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useTrendingMovies } from "@/hooks/useTrendingMovies";

function TrendingMovies() {
  const { data, isLoading, isError } = useTrendingMovies();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Popular Right Now" eyebrowClass="from-violet-400 to-fuchsia-400" title="Trending" accent="Movies" accentClass="text-gradient-red" viewAll={ROUTES.MOVIES} />
          <ProductSkeleton count={10} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 text-center">
        <p className="text-lg text-red-400">Failed to load movies.</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2 text-sm text-white shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-orange-500 transition-all">Retry</button>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Popular Right Now" eyebrowClass="from-violet-400 to-fuchsia-400" title="Trending" accent="Movies" accentClass="text-gradient-red" viewAll={ROUTES.MOVIES} />

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
