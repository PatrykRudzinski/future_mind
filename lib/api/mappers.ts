import type {
  MovieDetail,
  MovieSummary,
  OmdbMovieDetail,
  OmdbSearchItem,
  OmdbSearchSuccess,
  PaginatedMovieSearch,
} from "@/lib/schemas";
import { config } from "@/lib/config";

const NO_POSTER = "N/A";

function normalizePosterUrl(poster: string): string {
  return poster === NO_POSTER ? "" : poster;
}

export function mapOmdbSearchItemToSummary(item: OmdbSearchItem): MovieSummary {
  return {
    id: item.imdbID,
    title: item.Title,
    year: item.Year,
    type: item.Type,
    posterUrl: normalizePosterUrl(item.Poster),
  };
}

export function mapOmdbSearchToPaginated(
  data: OmdbSearchSuccess,
  page: number,
): PaginatedMovieSearch {
  const totalResults = Number.parseInt(data.totalResults, 10);
  const items = data.Search.map(mapOmdbSearchItemToSummary);

  return {
    items,
    totalResults: Number.isNaN(totalResults) ? 0 : totalResults,
    page,
    hasMore: page * config.pagination.defaultPageSize < totalResults,
  };
}

export function mapOmdbDetailToMovieDetail(data: OmdbMovieDetail): MovieDetail {
  return {
    id: data.imdbID,
    title: data.Title,
    year: data.Year,
    type: data.Type,
    posterUrl: normalizePosterUrl(data.Poster),
    plot: data.Plot,
    genre: data.Genre,
    director: data.Director,
    actors: data.Actors,
    runtime: data.Runtime,
    rated: data.Rated,
    imdbRating: data.imdbRating,
    imdbVotes: data.imdbVotes,
    awards: data.Awards,
  };
}

export function isOmdbError(
  response: { Response: string; Error?: string },
): response is { Response: "False"; Error: string } {
  return response.Response === "False";
}

export function isOmdbSearchNotFound(error: string): boolean {
  return error.toLowerCase().includes("not found");
}

export function createEmptySearchResults(page: number): PaginatedMovieSearch {
  return {
    items: [],
    totalResults: 0,
    page,
    hasMore: false,
  };
}
