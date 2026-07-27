import { Link } from "react-router-dom";
import MangaCard from "./MangaCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { ROUTES } from "@/constants/routes";
import { useManga } from "@/hooks/useManga";

function TrendingManga() {
  const { data: mangaList, isLoading, error } = useManga(1);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">Top Rated</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Trending Manga</h2>
            </div>
          </div>
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
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">Top Rated</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-1">
              <span className="text-white">Trending</span>{" "}
              <span className="text-gradient-pink">Manga</span>
            </h2>
          </div>
          <Link to={ROUTES.MANGA} className="group rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm">
            View All
            <span className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

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
