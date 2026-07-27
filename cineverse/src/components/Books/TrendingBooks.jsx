import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";

function TrendingBooks() {
  const { data, isLoading, error } = useBooks("fiction");

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">Top Picks</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Trending Books</h2>
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
        <p className="text-lg text-red-400">Failed to load books.</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500 transition-all">Retry</button>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-semibold uppercase tracking-wider text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">Top Picks</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-1">
              <span className="text-white">Trending</span>{" "}
              <span className="text-gradient-violet">Books</span>
            </h2>
          </div>
          <Link to={ROUTES.BOOKS} className="group rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm">
            View All
            <span className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

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
