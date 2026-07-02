import type { MovieDetailParams, MovieSearchParams } from "@/lib/schemas";

export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    search: (params: MovieSearchParams) =>
      [...queryKeys.movies.all, "search", params] as const,
    detail: (params: MovieDetailParams) =>
      [...queryKeys.movies.all, "detail", params] as const,
  },
  favorites: {
    all: ["favorites"] as const,
  },
} as const;
