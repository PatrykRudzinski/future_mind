import { z } from "zod";

export const omdbMediaTypeSchema = z.enum(["movie", "series", "episode", "game"]);

export const omdbPlotSchema = z.enum(["short", "full"]);

export const omdbResponseStatusSchema = z.enum(["True", "False"]);

export const omdbErrorResponseSchema = z.object({
  Response: z.literal("False"),
  Error: z.string(),
});

export const omdbSearchItemSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: omdbMediaTypeSchema,
  Poster: z.string(),
});

export const omdbSearchSuccessSchema = z.object({
  Search: z.array(omdbSearchItemSchema),
  totalResults: z.string(),
  Response: z.literal("True"),
});

export const omdbSearchResponseSchema = z.union([
  omdbSearchSuccessSchema,
  omdbErrorResponseSchema,
]);

export const omdbMovieDetailSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Rated: z.string().optional(),
  Released: z.string().optional(),
  Runtime: z.string().optional(),
  Genre: z.string().optional(),
  Director: z.string().optional(),
  Writer: z.string().optional(),
  Actors: z.string().optional(),
  Plot: z.string().optional(),
  Language: z.string().optional(),
  Country: z.string().optional(),
  Awards: z.string().optional(),
  Poster: z.string(),
  Ratings: z
    .array(
      z.object({
        Source: z.string(),
        Value: z.string(),
      }),
    )
    .optional(),
  Metascore: z.string().optional(),
  imdbRating: z.string().optional(),
  imdbVotes: z.string().optional(),
  imdbID: z.string(),
  Type: omdbMediaTypeSchema,
  DVD: z.string().optional(),
  BoxOffice: z.string().optional(),
  Production: z.string().optional(),
  Website: z.string().optional(),
  Response: z.literal("True"),
});

export const omdbMovieDetailResponseSchema = z.union([
  omdbMovieDetailSchema,
  omdbErrorResponseSchema,
]);

export type OmdbMediaType = z.infer<typeof omdbMediaTypeSchema>;
export type OmdbSearchItem = z.infer<typeof omdbSearchItemSchema>;
export type OmdbSearchSuccess = z.infer<typeof omdbSearchSuccessSchema>;
export type OmdbSearchResponse = z.infer<typeof omdbSearchResponseSchema>;
export type OmdbMovieDetail = z.infer<typeof omdbMovieDetailSchema>;
export type OmdbMovieDetailResponse = z.infer<typeof omdbMovieDetailResponseSchema>;
export type OmdbErrorResponse = z.infer<typeof omdbErrorResponseSchema>;
