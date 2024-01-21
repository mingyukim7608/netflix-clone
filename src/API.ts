import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  IMovie,
  IMovieDetails,
  IMoviesData,
  ITVSeries,
  ITVSeriesData,
  ITVSeriesDetails,
  TMovieState,
  TTVSeriesState,
  IMovieSearchResult,
  ITVSeriesSearchResult,
  IPersonSearchResult,
} from "./types";

const ACCESS_TOKEN_AUTH =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YWY0OTQ1ODVkNTNkNWZlZTc4M2NiOWRkYTRiOTFkMiIsInN1YiI6IjY1OWNjZjgwMjMxNjhjMDFhNTRhNjJmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yH37h5Q2SXTD11IP8UzkBiOGEPbFtdGUinqWdf0aOtY";

const fetchWithError = async (
  resource: RequestInfo | URL,
  options?: RequestInit
) => {
  const response = await fetch(resource, options);
  if (response.status !== 200) {
    throw new Error("Unable to load the data.");
  }

  return response.json();
};

export const useMoviesQuery = (movieState: TMovieState) => {
  return useQuery<IMoviesData>({
    queryKey: ["movies", movieState],
    queryFn: () => {
      return fetchWithError(
        `https://api.themoviedb.org/3/movie/${movieState}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
          },
        }
      );
    },
  });
};

export const useMovieDetailsQuery = (movieId: string) => {
  return useQuery<IMovieDetails>({
    queryKey: ["movies", "details", movieId],
    queryFn: () => {
      return fetchWithError(`https://api.themoviedb.org/3/movie/${movieId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
        },
      });
    },
  });
};

export const fetchMovieDetail = async (movieId: number) => {
  return (await fetchWithError(
    `https://api.themoviedb.org/3/movie/${movieId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
      },
    }
  )) as IMovieDetails;
};

export const useTVSeriesQuery = (tvSeriesState: TTVSeriesState) => {
  return useQuery<ITVSeriesData>({
    queryKey: ["tvSeries", tvSeriesState],
    queryFn: () => {
      return fetchWithError(
        `https://api.themoviedb.org/3/tv/${tvSeriesState}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
          },
        }
      );
    },
  });
};

export const useTVSeriesDetailsQuery = (tvSeriesId: string) => {
  return useQuery<ITVSeriesDetails>({
    queryKey: ["tvSeries", "details", tvSeriesId],
    queryFn: () => {
      return fetchWithError(`https://api.themoviedb.org/3/tv/${tvSeriesId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
        },
      });
    },
  });
};

export const fetchTVSeriesDetail = async (tvSeriesId: number) => {
  return (await fetchWithError(
    `https://api.themoviedb.org/3/tv/${tvSeriesId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
      },
    }
  )) as ITVSeriesDetails;
};

export const useSearchQuery = (query: string | null) => {
  return useQuery<(IMovieSearchResult | ITVSeriesSearchResult)[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      const searchResults = (
        await fetchWithError(
          `https://api.themoviedb.org/3/search/multi?query=${query}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
            },
          }
        )
      ).results as (
        | IMovieSearchResult
        | ITVSeriesSearchResult
        | IPersonSearchResult
      )[];
      const moviesOrTVSeries = searchResults.filter(
        (item) => item["media_type"] !== "person"
      );
      return moviesOrTVSeries as (IMovieSearchResult | ITVSeriesSearchResult)[];
    },
  });
};

export const useInfiniteSearchQuery = (query: string | null) => {
  return useInfiniteQuery<{
    results: (
      | IMovieSearchResult
      | ITVSeriesSearchResult
      | IPersonSearchResult
    )[];
    total_pages: number;
  }>({
    queryKey: ["search", query],
    queryFn: async ({ pageParam }) => {
      const searchResultPage = await fetchWithError(
        `https://api.themoviedb.org/3/search/multi?query=${query}&page=${pageParam}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`,
          },
        }
      );
      return searchResultPage;
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      if (lastPage.total_pages === currentPage) return;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};
