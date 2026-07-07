import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos,
  getMovieImages,
  getMovieReviews,
  getWatchProviders,
} from "@/services/movieService";

import MovieHero from "@/components/Movies/MovieHero";
import MovieInfo from "@/components/Movies/MovieInfo";
import MovieTrailer from "@/components/Movies/MovieTrailer";
import MovieCast from "@/components/Movies/MovieCast";
import SimilarMovies from "@/components/Movies/SimilarMovies";
import MovieGallery from "@/components/Movies/MovieGallery";
import MovieReviews from "@/components/Movies/MovieReviews";
import { WatchProviders } from "@/components/Movies";

function MovieDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const [movie, cast, similar, videos, images, reviews, watchProviders] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getSimilarMovies(id),
        getMovieVideos(id),
        getMovieImages(id),
        getMovieReviews(id),
        getWatchProviders(id),
      ]);

      return {
        movie,
        cast,
        similar,
        videos,
        images,
        reviews,
        watchProviders,
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading movie...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        Failed to load movie.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <MovieHero movie={data.movie} />

      <div className="relative z-20 mx-auto -mt-44 max-w-7xl px-6 pb-20">

        <MovieInfo movie={data.movie} />

        <MovieTrailer
            movie={data.movie}
            videos={data.videos} />
        
        <WatchProviders providers={data.watchProviders} />

        <MovieGallery images={data.images} />

        <MovieReviews reviews={data.reviews} />

        <MovieCast cast={data.cast} />

        <SimilarMovies movies={data.similar} />

      </div>

    </div>
  );
}

export default MovieDetails;