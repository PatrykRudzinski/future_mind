import type {
  MovieDetail,
  MovieDetailParams,
  MovieSearchParams,
  PaginatedMovieSearch,
} from "@/lib/schemas";
import { movieDetailSchema, paginatedMovieSearchSchema } from "@/lib/schemas";

import { apiEndpoints } from "@/lib/api/endpoints";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function buildSearchUrl(params: MovieSearchParams): string {
  const url = new URL(apiEndpoints.movies.search, window.location.origin);

  url.searchParams.set("query", params.query);
  url.searchParams.set("page", String(params.page));

  if (params.type) {
    url.searchParams.set("type", params.type);
  }

  if (params.year) {
    url.searchParams.set("year", String(params.year));
  }

  return url.toString();
}

async function parseJsonResponse<T>(
  response: Response,
  schema: { parse: (payload: unknown) => T },
): Promise<T> {
  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Request failed";

    throw new ApiClientError(message, response.status);
  }

  return schema.parse(payload);
}

export async function fetchMovieSearch(
  params: MovieSearchParams,
): Promise<PaginatedMovieSearch> {
  const response = await fetch(buildSearchUrl(params));
  return parseJsonResponse(response, paginatedMovieSearchSchema);
}

export async function fetchMovieDetail(params: MovieDetailParams): Promise<MovieDetail> {
  const url = new URL(apiEndpoints.movies.detail(params.imdbId), window.location.origin);
  url.searchParams.set("plot", params.plot);

  const response = await fetch(url.toString());
  return parseJsonResponse(response, movieDetailSchema);
}
