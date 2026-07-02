const omdbApiUrl = process.env.NEXT_PUBLIC_OMDB_API_URL ?? "https://www.omdbapi.com/";

export const config = {
  omdb: {
    baseUrl: omdbApiUrl,
    apiKey: process.env.OMDB_API_KEY ?? "",
  },
  app: {
    name: "Movie Finder",
    description: "Search movies and browse details powered by OMDb API",
  },
  pagination: {
    defaultPageSize: 16,
    omdbPageSize: 10,
    maxPage: 100,
  },
} as const;

export function assertOmdbApiKey(): string {
  if (!config.omdb.apiKey) {
    throw new Error(
      "OMDB_API_KEY is not set. Copy .env.example to .env.local and add your key from https://www.omdbapi.com/apikey.aspx",
    );
  }

  return config.omdb.apiKey;
}
