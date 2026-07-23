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

function SectionSkeleton({ height = "h-48" }) {
  return (
    <div className={`${height} animate-pulse rounded-2xl bg-slate-900/40 ring-1 ring-white/5 shimmer`} />
  )
}

function MovieDetails() {
  const { id } = useParams();
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  const movieQuery = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });

  const castQuery = useQuery({
    queryKey: ["movieCast", id],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });

  const similarQuery = useQuery({
    queryKey: ["similarMovies", id],
    queryFn: () => getSimilarMovies(id),
    enabled: !!id,
  });

  const videosQuery = useQuery({
    queryKey: ["movieVideos", id],
    queryFn: () => getMovieVideos(id),
    enabled: !!id,
  });

  const imagesQuery = useQuery({
    queryKey: ["movieImages", id],
    queryFn: () => getMovieImages(id),
    enabled: !!id,
  });

  const reviewsQuery = useQuery({
    queryKey: ["movieReviews", id],
    queryFn: () => getMovieReviews(id),
    enabled: !!id,
  });

  const providersQuery = useQuery({
    queryKey: ["watchProviders", id],
    queryFn: () => getWatchProviders(id),
    enabled: !!id,
  });

  if (movieQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="h-[600px] animate-pulse bg-slate-900/60" />
        <div className="mx-auto max-w-7xl px-6 py-14 space-y-8">
          <SectionSkeleton height="h-32" />
          <SectionSkeleton height="h-48" />
          <SectionSkeleton height="h-64" />
        </div>
      </div>
    );
  }

  if (movieQuery.isError || !movieQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        Failed to load movie.
      </div>
    );
  }

  const movie = movieQuery.data;
  const cast = castQuery.data;
  const similar = similarQuery.data;
  const videos = videosQuery.data;
  const images = imagesQuery.data;
  const reviews = reviewsQuery.data;
  const watchProviders = providersQuery.data;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <MovieHero movie={movie} />

      <div className="relative z-20 mx-auto -mt-44 max-w-7xl px-6 pb-20">

        <MovieInfo movie={movie} videos={videos || []} />

        {videosQuery.isLoading ? <SectionSkeleton height="h-48" /> : <MovieTrailer movie={movie} videos={videos || []} />}

        {providersQuery.isLoading ? <SectionSkeleton height="h-24" /> : <WatchProviders providers={watchProviders} />}

        {imagesQuery.isLoading ? <SectionSkeleton height="h-48" /> : <MovieGallery images={images} />}

        {reviewsQuery.isLoading ? <SectionSkeleton height="h-48" /> : <MovieReviews reviews={reviews || []} />}

        {castQuery.isLoading ? <SectionSkeleton height="h-48" /> : <MovieCast cast={cast || []} />}

        {similarQuery.isLoading ? <SectionSkeleton height="h-48" /> : <SimilarMovies movies={similar || []} />}

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