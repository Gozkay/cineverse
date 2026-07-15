import { FaPlay } from "react-icons/fa";

function MovieInfo({ movie, videos }) {
  const trailer = videos?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-3xl font-black">
            <span className="text-white">About</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">this movie</span>
          </h2>

          <p className="leading-8 text-slate-400">
            {movie.overview}
          </p>

          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-rose-500 transition-all duration-300"
            >
              <FaPlay className="transition-transform group-hover:scale-110" />
              Watch Trailer
            </a>
          )}
        </div>

        <div className="space-y-5 rounded-2xl bg-slate-900/50 ring-1 ring-white/5 p-6">
          <div>
            <h3 className="text-sm text-slate-500">Original Language</h3>
            <p className="text-lg font-semibold text-white">{movie.original_language.toUpperCase()}</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Status</h3>
            <p className="text-lg font-semibold text-white">{movie.status}</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Runtime</h3>
            <p className="text-lg font-semibold text-white">{movie.runtime} mins</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Budget</h3>
            <p className="text-lg font-semibold text-white">${movie.budget.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Revenue</h3>
            <p className="text-lg font-semibold text-white">${movie.revenue.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Genres</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-sm text-violet-300">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm text-slate-500">Rating</h3>
            <p className="text-lg font-semibold text-yellow-400">&#11088; {movie.vote_average.toFixed(1)} / 10</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieInfo;
