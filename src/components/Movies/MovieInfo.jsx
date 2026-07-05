function MovieInfo({ movie }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">

      <div className="grid gap-12 lg:grid-cols-3">

        {/* Left Side */}
        <div className="lg:col-span-2">

          <h2 className="mb-6 text-3xl font-bold">
            About this movie
          </h2>

          <p className="leading-8 text-slate-300">
            {movie.overview}
          </p>

        </div>

        {/* Right Side */}
        <div className="space-y-5 rounded-2xl bg-slate-900 p-6">

          <div>
            <h3 className="text-sm text-slate-400">
              Original Language
            </h3>

            <p className="text-lg font-semibold">
              {movie.original_language.toUpperCase()}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Status
            </h3>

            <p className="text-lg font-semibold">
              {movie.status}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Runtime
            </h3>

            <p className="text-lg font-semibold">
              {movie.runtime} mins
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Budget
            </h3>

            <p className="text-lg font-semibold">
              $
              {movie.budget.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Revenue
            </h3>

            <p className="text-lg font-semibold">
              $
              {movie.revenue.toLocaleString()}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default MovieInfo;