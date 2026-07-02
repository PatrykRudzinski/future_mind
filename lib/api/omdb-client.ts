import { assertOmdbApiKey, config } from "@/lib/config";
import {
  omdbMovieDetailResponseSchema,
  omdbSearchResponseSchema,
  type MovieDetailParams,
  type MovieSearchParams,
  type OmdbMovieDetailResponse,
  type OmdbSearchResponse,
} from "@/lib/schemas";

export class OmdbApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "OmdbApiError";
  }
}

type OmdbQueryParams = Record<string, string | number | undefined>;

function buildOmdbUrl(params: OmdbQueryParams): string {
  const apiKey = assertOmdbApiKey();
  const url = new URL(config.omdb.baseUrl);

  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("r", "json");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function fetchOmdb<T>(
  params: OmdbQueryParams,
  schema: { parse: (data: unknown) => T },
): Promise<T> {
  const response = await fetch(buildOmdbUrl(params), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed with status ${response.status}`, response.status);
  }

  const json: unknown = await response.json();
  return schema.parse(json);
}

/**
 * OMDb search endpoint — `GET /?s={query}&type=&y=&page=`
 * Returns up to 10 results per page.
 */
export async function searchMovies(
  params: MovieSearchParams,
): Promise<OmdbSearchResponse> {
  return fetchOmdb(
    {
      s: params.query,
      type: params.type,
      y: params.year,
      page: params.page,
    },
    omdbSearchResponseSchema,
  );
}

/**
 * OMDb title lookup by IMDb ID — `GET /?i={imdbId}&plot=`
 */
export async function getMovieByImdbId(
  params: MovieDetailParams,
): Promise<OmdbMovieDetailResponse> {
  return fetchOmdb(
    {
      i: params.imdbId,
      plot: params.plot,
    },
    omdbMovieDetailResponseSchema,
  );
}

/**
 * OMDb title lookup by exact title — `GET /?t={title}&plot=`
 * Optional fallback when only a title string is available.
 */
export async function getMovieByTitle(
  title: string,
  plot: MovieDetailParams["plot"] = "full",
): Promise<OmdbMovieDetailResponse> {
  return fetchOmdb(
    {
      t: title,
      plot,
    },
    omdbMovieDetailResponseSchema,
  );
}
