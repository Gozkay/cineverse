import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKDROP_BASE_URL } from "@/constants/tmdb";

// 1. Import your local asset image at the top
import Herobg from "@/assets/images/hero-bg.png"; 

function MovieDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        }
      );
      return response.data;
    },
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;
  if (isError) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">Error...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Cinematic Hero Backdrop Banner */}
      <div className="relative h-[500px] w-full overflow-hidden bg-slate-900">
        <img
          src={
            data.backdrop_path
              ? `${BACKDROP_BASE_URL}${data.backdrop_path}`
              : Herobg // 2. Use the imported variable name here
          }
          alt={data.title}
          className="h-full w-full object-cover object-center opacity-45"
          onError={(e) => {
            // 3. Set the fallback variable here as well if the API returns a broken link
            e.target.src = Herobg; 
          }}
        />

        {/* Gradient Overlay Layer */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(to top, #020617 0%, rgba(2, 6, 23, 0.4) 60%, transparent 100%)' 
          }}
        />
      </div>

      {/* Movie Meta Details Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 relative z-10 -mt-20">
        <h1 className="text-5xl font-black text-white drop-shadow-md">
          {data.title}
        </h1>
        <p className="mt-4 text-sm font-semibold text-violet-400 uppercase tracking-wider">
          {data.release_date ? data.release_date.split("-")[0] : "N/A"}
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {data.overview || "No description available for this title."}
        </p>
      </div>
    </div>
  );
}

export default MovieDetails;