import BookCard from "./BookCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";

function TrendingBooks() {
  const { data, isLoading, error } = useBooks("fiction");

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Top Picks" eyebrowClass="from-violet-400 to-fuchsia-400" title="Trending" accent="Books" accentClass="text-gradient-violet" viewAll={ROUTES.BOOKS} />
          <ProductSkeleton count={10} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-lg text-red-400">Failed to load books.</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500 transition-all">Retry</button>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Top Picks" eyebrowClass="from-violet-400 to-fuchsia-400" title="Trending" accent="Books" accentClass="text-gradient-violet" viewAll={ROUTES.BOOKS} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data?.slice(0, 10).map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingBooks;
