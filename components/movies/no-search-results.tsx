import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MovieSearchParams } from "@/lib/schemas";
import { buildMovieSearchUrl } from "@/lib/utils/search-params";

type NoSearchResultsProps = {
  searchParams: MovieSearchParams;
};

function formatType(type: MovieSearchParams["type"]) {
  if (!type) {
    return null;
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function NoSearchResults({ searchParams }: NoSearchResultsProps) {
  const hasFilters = Boolean(searchParams.year || searchParams.type);
  const clearFiltersHref = buildMovieSearchUrl({
    query: searchParams.query,
    page: 1,
  });
  const formattedType = formatType(searchParams.type);

  return (
    <section
      aria-live="polite"
      className="flex flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center"
    >
      <SearchX className="text-muted-foreground mb-4 size-10" aria-hidden="true" />

      <h2 className="text-lg font-semibold">No movies matched your search</h2>

      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
        We couldn&apos;t find anything for{" "}
        <span className="text-foreground font-medium">&ldquo;{searchParams.query}&rdquo;</span>
        {searchParams.year ? (
          <>
            {" "}
            from <span className="text-foreground font-medium">{searchParams.year}</span>
          </>
        ) : null}
        {formattedType ? (
          <>
            {" "}
            in the <span className="text-foreground font-medium">{formattedType}</span> category
          </>
        ) : null}
        .
      </p>

      <ul className="text-muted-foreground mt-4 max-w-sm space-y-1 text-left text-sm">
        <li>Check the spelling of the title</li>
        <li>Try a shorter or more general search term</li>
        {hasFilters ? <li>Remove filters to see more results</li> : null}
      </ul>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {hasFilters ? (
          <Button asChild variant="default">
            <Link href={clearFiltersHref}>Remove filters</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href="/">Start a new search</Link>
        </Button>
      </div>
    </section>
  );
}
