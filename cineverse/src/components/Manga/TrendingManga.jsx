import MangaCard from "./MangaCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useManga } from "@/hooks/useManga";

function TrendingManga() {
  const { data: mangaList, isLoading, error } = useManga(1);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Top Rated" eyebrowClass="from-pink-400 to-rose-400" title="Trending" accent="Manga" accentClass="text-gradient-pink" viewAll={ROUTES.MANGA} />
          <ProductSkeleton count={10} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-lg text-red-400">Failed to load manga.</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2 text-sm text-white shadow-lg shadow-pink-500/25 hover:from-pink-500 hover:to-rose-500 transition-all">Retry</button>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Top Rated" eyebrowClass="from-pink-400 to-rose-400" title="Trending" accent="Manga" accentClass="text-gradient-pink" viewAll={ROUTES.MANGA} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {mangaList?.slice(0, 10).map((manga, i) => (
            <MangaCard key={manga.id} manga={manga} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingManga;
