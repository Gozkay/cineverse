import { IMAGE_BASE_URL } from "@/constants/tmdb";

function MovieCast({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-900 pt-12">
      <h2 className="text-2xl font-black text-white tracking-tight mb-6">
        Top Billed Cast
      </h2>
      
      {/* Smooth horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {cast.slice(0, 10).map((member) => (
          <div 
            key={member.id} 
            className="w-32 shrink-0 bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl text-center shadow-sm"
          >
            {/* Cast Profile Image */}
            <div className="w-full h-36 overflow-hidden rounded-lg mb-2 bg-slate-800">
              <img
                src={
                  member.profile_path 
                    ? `${IMAGE_BASE_URL}${member.profile_path}` 
                    : "https://placehold.co/150x225?text=No+Image"
                }
                alt={member.name}
                className="w-full h-full object-cover transition duration-300 hover:scale-105"
              />
            </div>

            {/* Names & Characters */}
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