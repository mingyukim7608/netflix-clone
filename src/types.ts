export interface IMovie {
  backdrop_path: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export type TMovieState = "now_playing" | "popular" | "top_rated" | "upcoming";
export type TTVSeriesState =
  | "airing_today"
  | "on_the_air"
  | "popular"
  | "top_rated";

export interface IMoviesData {
  results: IMovie[];
}

export interface IMovieDetails {
  budget: number;
  genres: { id: number; name: string }[];
  poster_path: string;
  production_companies: { name: string; logo_path: string }[];
  production_countries: { name: string }[];
  release_date: string;
  runtime: number;
  spoken_languages: { english_name: string }[];
  status: string;
  tagline: string;
  overview: string;
  title: string;
  backdrop_path: string;
}

export interface ISearchFormData {
  keyword: string;
}

export interface ITVSeries {
  backdrop_path: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
}

export interface ITVSeriesData {
  results: ITVSeries[];
}

export interface ITVSeriesDetails {
  backdrop_path: string;
  created_by: { name: string }[];
  first_air_date: string;
  genres: { name: string }[];
  id: number;
  in_production: boolean;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  overview: string;
  poster_path: string;
  production_companies: { name: string }[];
  status: string;
  tagline: string;
}

export interface IMovieSearchResult extends IMovie {
  media_type: "movie";
}

export interface ITVSeriesSearchResult extends ITVSeries {
  media_type: "tv";
}

export interface IPersonSearchResult {
  media_type: "person";
}
