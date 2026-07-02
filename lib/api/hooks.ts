"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchMovieDetail, fetchMovieSearch, queryKeys } from "@/lib/api";
import type { MovieDetailParams, MovieSearchParams } from "@/lib/schemas";

export function useSearchMovies(params: MovieSearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.movies.search(params),
    queryFn: () => fetchMovieSearch(params),
    enabled: enabled && params.query.trim().length > 0,
  });
}

export function useMovieDetail(params: MovieDetailParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.movies.detail(params),
    queryFn: () => fetchMovieDetail(params),
    enabled: enabled && params.imdbId.length > 0,
  });
}
