import { FaPlay } from "react-icons/fa";

function MovieInfo({ movie, videos }) {
  const trailer = videos?.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer"
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">

      <div className="grid gap-12 lg:grid-cols-3">

        {/* Left */}
        <div className="lg:col-span-2">

          <h2 className="mb-6 text-3xl font-bold">
            About this movie
          </h2>

          <p className="leading-8 text-slate-300">
            {movie.overview}
          </p>

          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
            >
              <FaPlay />
              Watch Trailer
            </a>
          )}

        </div>

        {/* Right */}
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
              ${movie.budget.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Revenue
            </h3>

            <p className="text-lg font-semibold">
              ${movie.revenue.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Genres
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-violet-600/20 px-3 py-1 text-sm text-violet-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-slate-400">
              Rating
            </h3>

            <p className="text-lg font-semibold text-yellow-400">
              ⭐ {movie.vote_average.toFixed(1)} / 10
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default MovieInfo;