import type { MovieSearchParams } from "@/lib/schemas";
import { movieSearchParamsSchema } from "@/lib/schemas";

export type MovieSearchUrlParams = {
  query?: string;
  year?: string;
  type?: string;
  page?: string;
};

export function parseMovieSearchParams(
  params: MovieSearchUrlParams,
): MovieSearchParams | null {
  const parsed = movieSearchParamsSchema.safeParse({
    query: params.query ?? "",
    type: params.type || undefined,
    year: params.year || undefined,
    page: params.page ?? 1,
  });

  if (!parsed.success || parsed.data.query.trim().length === 0) {
    return null;
  }

  return parsed.data;
}

export function buildMovieSearchUrl(params: {
  query: string;
  type?: string;
  year?: string;
  page?: number;
}): string {
  const searchParams = new URLSearchParams();
  const trimmedQuery = params.query.trim();

  if (trimmedQuery) {
    searchParams.set("query", trimmedQuery);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.year) {
    searchParams.set("year", params.year);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const queryString = searchParams.toString();
  return queryString ? `/?${queryString}` : "/";
}
