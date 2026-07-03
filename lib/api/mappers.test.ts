import { describe, expect, it } from "vitest";

import {
  createEmptySearchResults,
  isOmdbError,
  isOmdbSearchNotFound,
  mapOmdbDetailToMovieDetail,
  mapOmdbSearchItemToSummary,
  mapOmdbSearchToPaginated,
} from "@/lib/api/mappers";
import type { OmdbMovieDetail, OmdbSearchItem, OmdbSearchSuccess } from "@/lib/schemas";

const searchItem: OmdbSearchItem = {
  Title: "Inception",
  Year: "2010",
  imdbID: "tt1375666",
  Type: "movie",
  Poster: "https://example.com/inception.jpg",
};

const searchSuccess: OmdbSearchSuccess = {
  Search: [searchItem],
  totalResults: "25",
  Response: "True",
};

const movieDetail: OmdbMovieDetail = {
  Title: "Inception",
  Year: "2010",
  imdbID: "tt1375666",
  Type: "movie",
  Poster: "N/A",
  Plot: "A thief who steals corporate secrets...",
  Genre: "Action, Sci-Fi",
  Director: "Christopher Nolan",
  Actors: "Leonardo DiCaprio",
  Runtime: "148 min",
  Rated: "PG-13",
  imdbRating: "8.8",
  imdbVotes: "2,500,000",
  Awards: "Won 4 Oscars",
  Response: "True",
};

describe("mapOmdbSearchItemToSummary", () => {
  it("maps OMDb search items to app summaries", () => {
    expect(mapOmdbSearchItemToSummary(searchItem)).toEqual({
      id: "tt1375666",
      title: "Inception",
      year: "2010",
      type: "movie",
      posterUrl: "https://example.com/inception.jpg",
    });
  });

  it("normalizes missing posters to an empty string", () => {
    expect(
      mapOmdbSearchItemToSummary({
        ...searchItem,
        Poster: "N/A",
      }),
    ).toEqual({
      id: "tt1375666",
      title: "Inception",
      year: "2010",
      type: "movie",
      posterUrl: "",
    });
  });
});

describe("mapOmdbSearchToPaginated", () => {
  it("maps search responses with pagination metadata", () => {
    expect(mapOmdbSearchToPaginated(searchSuccess, 1)).toEqual({
      items: [mapOmdbSearchItemToSummary(searchItem)],
      totalResults: 25,
      page: 1,
      hasMore: true,
    });
  });

  it("handles invalid totalResults values", () => {
    expect(
      mapOmdbSearchToPaginated(
        {
          ...searchSuccess,
          totalResults: "invalid",
        },
        1,
      ),
    ).toEqual({
      items: [mapOmdbSearchItemToSummary(searchItem)],
      totalResults: 0,
      page: 1,
      hasMore: false,
    });
  });
});

describe("mapOmdbDetailToMovieDetail", () => {
  it("maps OMDb detail responses to app DTOs", () => {
    expect(mapOmdbDetailToMovieDetail(movieDetail)).toEqual({
      id: "tt1375666",
      title: "Inception",
      year: "2010",
      type: "movie",
      posterUrl: "",
      plot: "A thief who steals corporate secrets...",
      genre: "Action, Sci-Fi",
      director: "Christopher Nolan",
      actors: "Leonardo DiCaprio",
      runtime: "148 min",
      rated: "PG-13",
      imdbRating: "8.8",
      imdbVotes: "2,500,000",
      awards: "Won 4 Oscars",
    });
  });
});

describe("OMDb helpers", () => {
  it("detects OMDb error responses", () => {
    expect(isOmdbError({ Response: "False", Error: "Movie not found!" })).toBe(true);
    expect(isOmdbError({ Response: "True" })).toBe(false);
  });

  it("detects not-found search errors", () => {
    expect(isOmdbSearchNotFound("Movie not found!")).toBe(true);
    expect(isOmdbSearchNotFound("Too many results.")).toBe(false);
  });

  it("creates empty paginated results", () => {
    expect(createEmptySearchResults(2)).toEqual({
      items: [],
      totalResults: 0,
      page: 2,
      hasMore: false,
    });
  });
});
