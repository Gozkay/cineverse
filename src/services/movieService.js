import axios from "axios";

const API = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export const getTrendingMovies = async () => {
  const { data } = await API.get("/trending/movie/week");
  return data.results;
};

export const getMovieDetails = async (id) => {
  const { data } = await API.get(`/movie/${id}`);
  return data;
};

export const getMovieCredits = async (id) => {
  const { data } = await API.get(`/movie/${id}/credits`);
  return data.cast;
};

export const getSimilarMovies = async (id) => {
  const { data } = await API.get(`/movie/${id}/similar`);
  return data.results;
};

export const getMovieVideos = async (id) => {
  const { data } = await API.get(`/movie/${id}/videos`);
  return data.results;
};
export const getMovieImages = async (id) => {
  const { data } = await API.get(`/movie/${id}/images`);

  return {
    backdrops: data.backdrops,
    posters: data.posters,
  };
};
export const getMovieReviews = async (id) => {
  const { data } = await API.get(`/movie/${id}/reviews`);
  return data.results;
};
export const getWatchProviders = async (id) => {
  const { data } = await API.get(`/movie/${id}/watch/providers`);

  return data.results;
};

export default API;