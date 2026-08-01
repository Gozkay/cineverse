import { Link } from "react-router-dom";
import LocalMovieCard from "@/components/Seller/LocalMovieCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { ROUTES } from "@/constants/routes";
import { useLocalMovies } from "@/hooks/useLocalMovies";

function LocalMoviesSection() {
  const { data, isLoading, isError } = useLocalMovies(10);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">From Local Creators</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Local Movies</h2>
            </div>
          </div>
          <ProductSkeleton count={10} />
        </div>
      </section>
    );
  }

  if (isError || !data?.length) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">From Local Creators</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-1">
              <span className="text-white">Local</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Movies</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md">Original films from local filmmakers and producers.</p>
          </div>
          <Link to={ROUTES.LOCAL_MOVIES} className="group rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm">
            View All
            <span className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data.map((movie, i) => (
            <LocalMovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LocalMoviesSection;
