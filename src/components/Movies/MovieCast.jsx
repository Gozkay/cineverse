import { IMAGE_BASE_URL } from "@/constants/tmdb";

function MovieCast({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      <h2 className="mb-8 text-2xl font-black">
        <span className="text-white">Top Billed</span>{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Cast</span>
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {cast.slice(0, 10).map((member) => (
          <div
            key={member.id}
            className="w-32 shrink-0 rounded-2xl bg-slate-900/40 ring-1 ring-white/5 p-2.5 text-center transition-all duration-300 hover:ring-violet-500/40 hover:-translate-y-1"
          >
            <div className="w-full aspect-[2/3] overflow-hidden rounded-xl mb-2 bg-slate-800">
              <img
                src={member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : "https://placehold.co/150x225?text=No+Image"}
                alt={member.name}
                className="w-full h-full object-cover transition duration-500 hover:scale-110"
              />
            </div>
            <h4 className="text-sm font-bold truncate text-slate-200" title={member.name}>
              {member.name}
            </h4>
            <p className="text-xs text-slate-500 truncate" title={member.character}>
              {member.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCast;
