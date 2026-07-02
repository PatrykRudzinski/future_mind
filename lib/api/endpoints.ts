/**
 * Internal BFF endpoints consumed by React Query hooks.
 * These proxy requests to OMDb so the API key stays server-side.
 */
export const apiEndpoints = {
  movies: {
    /** GET /api/movies/search?query=&type=&year=&page= */
    search: "/api/movies/search",
    /** GET /api/movies/[imdbId]?plot=full|short */
    detail: (imdbId: string) => `/api/movies/${imdbId}`,
  },
} as const;

/**
 * OMDb upstream endpoints (server-side only).
 *
 * | Operation       | OMDb params              | Used for                          |
 * |-----------------|--------------------------|-----------------------------------|
 * | Search          | s, type?, y?, page?      | Home page search + filters        |
 * | Detail by ID    | i, plot?                 | Movie details page                |
 * | Detail by title | t, plot?                 | Optional fallback lookup          |
 *
 * @see https://www.omdbapi.com/
 */
export const omdbEndpoints = {
  search: "GET /?s={query}&type={type}&y={year}&page={page}&apikey=***",
  detailById: "GET /?i={imdbId}&plot={plot}&apikey=***",
  detailByTitle: "GET /?t={title}&plot={plot}&apikey=***",
} as const;
