import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { BACKDROP_BASE_URL, IMAGE_BASE_URL } from "@/constants/tmdb";
import heroBg from "@/assets/images/hero-bg.png";

function MovieHero({ movie }) {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background */}
      <img
        src={
          movie.backdrop_path
            ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
            : heroBg
        }
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.target.src = heroBg;
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end gap-10 px-6 pb-16">

        {/* Poster */}
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : heroBg
          }
          alt={movie.title}
          className="hidden h-[420px] w-[280px] rounded-xl object-cover shadow-2xl md:block"
        />

        {/* Movie Info */}
        <div className="max-w-3xl">

          <h1 className="text-5xl font-black">
            {movie.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-slate-300">

            <span className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </span>

            <span>
              {movie.release_date?.split("-")[0]}
            </span>

            <span>
              {movie.runtime} min
            </span>

          </div>

          {/* Genres */}
          <div className="mt-6 flex flex-wrap gap-3">

            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-violet-700/30 px-4 py-2 text-sm"
              >
                {genre.name}
              </span>
            ))}

          </div>

          {/* Overview */}
          <p className="mt-8 text-lg leading-8 text-slate-300">
            {movie.overview}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">

            <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-700">
              <FaShoppingCart />
              Buy Movie
            </button>

            <button className="flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 transition hover:bg-slate-800">
              <FaHeart />
              Wishlist
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default MovieHero;