import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import { MovieSearchPage } from "@/components/movies/movie-search-form";
import { queryKeys, searchMoviesPaginated } from "@/lib/api";
import { config } from "@/lib/config";
import { buildMovieSearchUrl, parseMovieSearchParams, type MovieSearchUrlParams } from "@/lib/utils/search-params";

type HomePageProps = {
  searchParams: Promise<MovieSearchUrlParams>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const parsedSearch = parseMovieSearchParams(params);

  if (!parsedSearch) {
    return {
      title: "Search movies",
      description: config.app.description,
      alternates: {
        canonical: "/",
      },
    };
  }

  const filters = [
    parsedSearch.year ? String(parsedSearch.year) : null,
    parsedSearch.type ? parsedSearch.type : null,
  ].filter(Boolean);
  const filterDescription = filters.length > 0 ? ` filtered by ${filters.join(", ")}` : "";
  const canonical = buildMovieSearchUrl({
    query: parsedSearch.query,
    year: parsedSearch.year ? String(parsedSearch.year) : undefined,
    type: parsedSearch.type,
    page: parsedSearch.page,
  });

  return {
    title: `Results for "${parsedSearch.query}"`,
    description: `Browse movie search results for "${parsedSearch.query}"${filterDescription}.`,
    alternates: {
      canonical,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const parsedSearch = parseMovieSearchParams(params);

  if (!parsedSearch) {
    return <MovieSearchPage initialParams={null} />;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.movies.search(parsedSearch),
    queryFn: () => searchMoviesPaginated(parsedSearch),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieSearchPage initialParams={parsedSearch} />
    </HydrationBoundary>
  );
}
