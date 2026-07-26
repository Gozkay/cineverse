import tmdb from "./tmdb";

export const getTrendingMovies = async () => {
  const { data } = await tmdb.get("/trending/movie/week");
  return data.results;
};

export const getMovieDetails = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}`);
  return data;
};

export const getMovieCredits = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/credits`);
  return data.cast;
};

export const getSimilarMovies = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/similar`);
  return data.results;
};

export const getMovieVideos = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/videos`);
  return data.results;
};

export const getMovieImages = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/images`);
  return {
    backdrops: data.backdrops,
    posters: data.posters,
  };
};

export const getMovieReviews = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/reviews`);
  return data.results;
};

export const getWatchProviders = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/watch/providers`);
  return data.results;
};