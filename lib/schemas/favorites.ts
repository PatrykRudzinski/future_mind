import { z } from "zod";

import { movieSummarySchema } from "@/lib/schemas/movie";

export const favoritesStorageSchema = z.array(movieSummarySchema);

export type FavoriteMovie = z.infer<typeof movieSummarySchema>;
export type FavoritesStorage = z.infer<typeof favoritesStorageSchema>;

export const FAVORITES_STORAGE_KEY = "movie-finder:favorites";
