import { z } from "zod";

import { omdbMediaTypeSchema } from "@/lib/schemas/omdb";

export const movieSearchParamsSchema = z.object({
  query: z.string().trim().min(1, "Search query is required"),
  type: omdbMediaTypeSchema.optional(),
  year: z.coerce.number().int().min(1888).max(2100).optional(),
  page: z.coerce.number().int().min(1).max(100).default(1),
});

export const movieSearchFormSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Enter a movie title to search")
    .max(100, "Search term is too long — try something shorter"),
  year: z
    .string()
    .trim()
    .superRefine((value, context) => {
      if (value === "") {
        return;
      }

      if (!/^\d{4}$/.test(value)) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid 4-digit year (e.g. 2010)",
        });
        return;
      }

      const year = Number(value);

      if (year < 1888 || year > 2100) {
        context.addIssue({
          code: "custom",
          message: "Year must be between 1888 and 2100",
        });
      }
    }),
  type: z.enum(["all", "movie", "series", "episode", "game"]),
});

export type MovieSearchFormValues = z.infer<typeof movieSearchFormSchema>;

export const movieDetailParamsSchema = z.object({
  imdbId: z.string().regex(/^tt\d+$/, "Invalid IMDb ID format"),
  plot: z.enum(["short", "full"]).default("full"),
});

export const movieSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  type: omdbMediaTypeSchema,
  posterUrl: z.string(),
});

export const movieDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  type: omdbMediaTypeSchema,
  posterUrl: z.string(),
  plot: z.string().optional(),
  genre: z.string().optional(),
  director: z.string().optional(),
  actors: z.string().optional(),
  runtime: z.string().optional(),
  rated: z.string().optional(),
  imdbRating: z.string().optional(),
  imdbVotes: z.string().optional(),
  awards: z.string().optional(),
});

export const paginatedMovieSearchSchema = z.object({
  items: z.array(movieSummarySchema),
  totalResults: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  hasMore: z.boolean(),
});

export type MovieSearchParams = z.infer<typeof movieSearchParamsSchema>;
export type MovieDetailParams = z.infer<typeof movieDetailParamsSchema>;
export type MovieSummary = z.infer<typeof movieSummarySchema>;
export type MovieDetail = z.infer<typeof movieDetailSchema>;
export type PaginatedMovieSearch = z.infer<typeof paginatedMovieSearchSchema>;
