"use client";

import Link from "next/link";

import { MovieGrid } from "@/components/movies/movie-grid";
import { NoSearchResults } from "@/components/movies/no-search-results";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchMovies } from "@/lib/api/hooks";
import { config } from "@/lib/config";
import type { MovieSearchParams } from "@/lib/schemas";
import { buildMovieSearchUrl } from "@/lib/utils/search-params";

type MovieSearchResultsProps = {
  searchParams: MovieSearchParams;
};

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: config.pagination.defaultPageSize }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-xl border p-4">
          <Skeleton className="aspect-2/3 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function Pagination({
  searchParams,
  totalResults,
  page,
  hasMore,
}: {
  searchParams: MovieSearchParams;
  totalResults: number;
  page: number;
  hasMore: boolean;
}) {
  const totalPages = Math.max(1, Math.ceil(totalResults / config.pagination.defaultPageSize));
  const prevHref =
    page > 1
      ? buildMovieSearchUrl({
          query: searchParams.query,
          year: searchParams.year ? String(searchParams.year) : undefined,
          type: searchParams.type,
          page: page - 1,
        })
      : null;
  const nextHref = hasMore
    ? buildMovieSearchUrl({
        query: searchParams.query,
        year: searchParams.year ? String(searchParams.year) : undefined,
        type: searchParams.type,
        page: page + 1,
      })
    : null;

  return (
    <nav
      aria-label="Search results pagination"
      className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted-foreground text-sm">
        {totalResults.toLocaleString()} results
      </p>
      <div className="flex items-center gap-2">
        {prevHref ? (
          <Button asChild variant="outline">
            <Link href={prevHref} aria-label="Go to previous page">
              Previous
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Previous
          </Button>
        )}
        <p className="text-muted-foreground min-w-18 text-center text-sm tabular-nums">
          {page} of {totalPages}
        </p>
        {nextHref ? (
          <Button asChild variant="outline">
            <Link href={nextHref} aria-label="Go to next page">
              Next
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}

export function MovieSearchResults({ searchParams }: MovieSearchResultsProps) {
  const { data, isLoading, isFetching, isError, error, refetch } = useSearchMovies(searchParams);

  if (isLoading) {
    return (
      <section aria-live="polite" aria-busy="true">
        <h2 className="sr-only">Loading search results</h2>
        <ResultsSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Search failed</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{error instanceof Error ? error.message : "Something went wrong while searching movies."}</p>
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.items.length === 0) {
    return <NoSearchResults searchParams={searchParams} />;
  }

  return (
    <section aria-busy={isFetching} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          Results for &ldquo;{searchParams.query}&rdquo;
        </h2>
        <div className="text-muted-foreground text-right text-sm" aria-live="polite">
          <p>{data.totalResults.toLocaleString()} matches</p>
          {isFetching ? <p>Updating results...</p> : null}
        </div>
      </div>

      <MovieGrid movies={data.items} />

      <Pagination
        searchParams={searchParams}
        totalResults={data.totalResults}
        page={data.page}
        hasMore={data.hasMore}
      />
    </section>
  );
}
