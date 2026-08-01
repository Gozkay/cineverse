import ComicCard from "./ComicCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useComics } from "@/hooks/useComics";

function TrendingComics() {
  const { data: comics, isLoading, error } = useComics("comics");

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Popular Now" eyebrowClass="from-emerald-400 to-teal-400" title="Trending" accent="Comics" accentClass="text-gradient-emerald" viewAll={ROUTES.COMICS} />
          <ProductSkeleton count={10} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-lg text-red-400">Failed to load comics.</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 transition-all">Retry</button>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Popular Now" eyebrowClass="from-emerald-400 to-teal-400" title="Trending" accent="Comics" accentClass="text-gradient-emerald" viewAll={ROUTES.COMICS} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {comics?.slice(0, 10).map((comic, i) => (
            <ComicCard key={comic.id} comic={comic} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingComics;
