import { useState } from "react";
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
import ReviewForm from "@/components/Reviews/ReviewForm";
import ReviewList from "@/components/Reviews/ReviewList";
import { WatchProviders } from "@/components/Movies";

function MovieDetails() {
  const { id } = useParams();
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

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

        <MovieInfo movie={data.movie} videos={data.videos} />

        <MovieTrailer
            movie={data.movie}
            videos={data.videos} />
        
        <WatchProviders providers={data.watchProviders} />

        <MovieGallery images={data.images} />

        <MovieReviews reviews={data.reviews} />

        <MovieCast cast={data.cast} />

        <SimilarMovies movies={data.similar} />

        <section className="mt-16 border-t border-slate-900 pt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Reviews</h2>
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <ReviewList productId={id} refreshKey={reviewRefreshKey} />
            <ReviewForm productId={id} onReviewAdded={() => setReviewRefreshKey(k => k + 1)} />
          </div>
        </section>

      </div>

    </div>
  );
}

export default MovieDetails;