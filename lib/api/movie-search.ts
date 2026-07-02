import {
  createEmptySearchResults,
  isOmdbError,
  isOmdbSearchNotFound,
  mapOmdbSearchItemToSummary,
} from "@/lib/api/mappers";
import { OmdbApiError, searchMovies } from "@/lib/api/omdb-client";
import { config } from "@/lib/config";
import type { MovieSearchParams, PaginatedMovieSearch } from "@/lib/schemas";

const { defaultPageSize: pageSize, omdbPageSize } = config.pagination;

function getOmdbPageRange(appPage: number) {
  const globalStart = (appPage - 1) * pageSize;
  const globalEnd = appPage * pageSize;

  return {
    globalStart,
    globalEnd,
    firstOmdbPage: Math.floor(globalStart / omdbPageSize) + 1,
    lastOmdbPage: Math.ceil(globalEnd / omdbPageSize),
  };
}

export async function searchMoviesPaginated(
  params: MovieSearchParams,
): Promise<PaginatedMovieSearch> {
  const appPage = params.page;
  const { globalStart, firstOmdbPage, lastOmdbPage } = getOmdbPageRange(appPage);

  const firstResponse = await searchMovies({ ...params, page: firstOmdbPage });

  if (isOmdbError(firstResponse)) {
    if (isOmdbSearchNotFound(firstResponse.Error)) {
      return createEmptySearchResults(appPage);
    }

    throw new OmdbApiError(firstResponse.Error);
  }

  const totalResults = Number.parseInt(firstResponse.totalResults, 10) || 0;

  if (totalResults === 0 || globalStart >= totalResults) {
    return createEmptySearchResults(appPage);
  }

  const omdbPages = Array.from(
    { length: lastOmdbPage - firstOmdbPage + 1 },
    (_, index) => firstOmdbPage + index,
  );

  const responses = await Promise.all(
    omdbPages.map((page) =>
      page === firstOmdbPage
        ? Promise.resolve(firstResponse)
        : searchMovies({ ...params, page }),
    ),
  );

  const concatenated = responses.flatMap((response) => {
    if (isOmdbError(response)) {
      return [];
    }

    return response.Search;
  });

  const localStart = globalStart - (firstOmdbPage - 1) * omdbPageSize;
  const items = concatenated
    .slice(localStart, localStart + pageSize)
    .map(mapOmdbSearchItemToSummary);

  return {
    items,
    totalResults,
    page: appPage,
    hasMore: appPage * pageSize < totalResults,
  };
}
