import { beforeEach, describe, expect, it, vi } from "vitest";

import type { OmdbSearchItem } from "@/lib/schemas";

vi.mock("@/lib/api/omdb-client", () => ({
  OmdbApiError: class OmdbApiError extends Error {
    name = "OmdbApiError";
  },
  searchMovies: vi.fn(),
}));

import { OmdbApiError, searchMovies } from "@/lib/api/omdb-client";
import { searchMoviesPaginated } from "@/lib/api/movie-search";

const mockedSearchMovies = vi.mocked(searchMovies);

function createSearchItem(index: number): OmdbSearchItem {
  return {
    Title: `Movie ${index}`,
    Year: "2020",
    imdbID: `tt${String(index).padStart(7, "0")}`,
    Type: "movie",
    Poster: "https://example.com/poster.jpg",
  };
}

function createSearchSuccess(items: OmdbSearchItem[], totalResults: number) {
  return {
    Search: items,
    totalResults: String(totalResults),
    Response: "True" as const,
  };
}

describe("searchMoviesPaginated", () => {
  beforeEach(() => {
    mockedSearchMovies.mockReset();
  });

  it("returns the first 16 items from aggregated OMDb pages", async () => {
    mockedSearchMovies.mockImplementation(async ({ page }) => {
      const start = (page - 1) * 10 + 1;
      const items = Array.from({ length: 10 }, (_, index) => createSearchItem(start + index));

      return createSearchSuccess(items, 25);
    });

    const result = await searchMoviesPaginated({ query: "batman", page: 1 });

    expect(mockedSearchMovies).toHaveBeenCalledTimes(2);
    expect(mockedSearchMovies).toHaveBeenNthCalledWith(1, { query: "batman", page: 1 });
    expect(mockedSearchMovies).toHaveBeenNthCalledWith(2, { query: "batman", page: 2 });
    expect(result.items).toHaveLength(16);
    expect(result.items[0]?.id).toBe("tt0000001");
    expect(result.items[15]?.id).toBe("tt0000016");
    expect(result.totalResults).toBe(25);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(true);
  });

  it("slices the correct window for later app pages", async () => {
    mockedSearchMovies.mockImplementation(async ({ page }) => {
      const start = (page - 1) * 10 + 1;
      const items = Array.from({ length: 10 }, (_, index) => createSearchItem(start + index));

      return createSearchSuccess(items, 100);
    });

    const result = await searchMoviesPaginated({ query: "batman", page: 2 });

    expect(mockedSearchMovies).toHaveBeenCalledTimes(3);
    expect(mockedSearchMovies).toHaveBeenCalledWith({ query: "batman", page: 2 });
    expect(mockedSearchMovies).toHaveBeenCalledWith({ query: "batman", page: 3 });
    expect(mockedSearchMovies).toHaveBeenCalledWith({ query: "batman", page: 4 });
    expect(result.items).toHaveLength(16);
    expect(result.items[0]?.id).toBe("tt0000017");
    expect(result.items[15]?.id).toBe("tt0000032");
    expect(result.page).toBe(2);
    expect(result.hasMore).toBe(true);
  });

  it("returns empty results when OMDb reports no matches", async () => {
    mockedSearchMovies.mockResolvedValue({
      Response: "False",
      Error: "Movie not found!",
    });

    const result = await searchMoviesPaginated({ query: "zzzznotfound", page: 1 });

    expect(result).toEqual({
      items: [],
      totalResults: 0,
      page: 1,
      hasMore: false,
    });
  });

  it("throws for non-not-found OMDb errors", async () => {
    mockedSearchMovies.mockResolvedValue({
      Response: "False",
      Error: "Too many results.",
    });

    await expect(searchMoviesPaginated({ query: "a", page: 1 })).rejects.toBeInstanceOf(
      OmdbApiError,
    );
  });

  it("returns empty results when the requested page is beyond total results", async () => {
    mockedSearchMovies.mockResolvedValue(createSearchSuccess([createSearchItem(1)], 1));

    const result = await searchMoviesPaginated({ query: "batman", page: 2 });

    expect(result).toEqual({
      items: [],
      totalResults: 0,
      page: 2,
      hasMore: false,
    });
    expect(mockedSearchMovies).toHaveBeenCalledTimes(1);
  });
});
