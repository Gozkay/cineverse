import LocalMovieCard from "@/components/Seller/LocalMovieCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useLocalMovies } from "@/hooks/useLocalMovies";

function LocalMoviesSection() {
  const { data, isLoading, isError } = useLocalMovies(10);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="From Local Creators" eyebrowClass="from-amber-400 to-orange-400" title="Local" accent="Movies" accentClass="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400" />
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
        <SectionHeader eyebrow="From Local Creators" eyebrowClass="from-amber-400 to-orange-400" title="Local" accent="Movies" accentClass="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400" subtitle="Original films from local filmmakers and producers." viewAll={ROUTES.LOCAL_MOVIES} />

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
