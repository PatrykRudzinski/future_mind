import { describe, expect, it } from "vitest";

import { buildMovieSearchUrl, parseMovieSearchParams } from "@/lib/utils/search-params";

describe("parseMovieSearchParams", () => {
  it("returns null when query is missing or empty", () => {
    expect(parseMovieSearchParams({})).toBeNull();
    expect(parseMovieSearchParams({ query: "   " })).toBeNull();
  });

  it("parses valid search params", () => {
    expect(
      parseMovieSearchParams({
        query: "inception",
        year: "2010",
        type: "movie",
        page: "2",
      }),
    ).toEqual({
      query: "inception",
      year: 2010,
      type: "movie",
      page: 2,
    });
  });

  it("returns null for invalid params", () => {
    expect(parseMovieSearchParams({ query: "inception", year: "abc" })).toBeNull();
    expect(parseMovieSearchParams({ query: "inception", type: "invalid" })).toBeNull();
  });
});

describe("buildMovieSearchUrl", () => {
  it("builds a query-only URL", () => {
    expect(buildMovieSearchUrl({ query: "inception" })).toBe("/?query=inception");
  });

  it("includes optional filters and page", () => {
    expect(
      buildMovieSearchUrl({
        query: "inception",
        year: "2010",
        type: "movie",
        page: 2,
      }),
    ).toBe("/?query=inception&type=movie&year=2010&page=2");
  });

  it("omits page 1 from the URL", () => {
    expect(buildMovieSearchUrl({ query: "inception", page: 1 })).toBe("/?query=inception");
  });

  it("returns home path when query is empty", () => {
    expect(buildMovieSearchUrl({ query: "   " })).toBe("/");
  });
});
