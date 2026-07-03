"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { MovieSearchResults } from "@/components/movies/movie-search-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { movieSearchFormSchema, type MovieSearchParams } from "@/lib/schemas";
import { buildMovieSearchUrl } from "@/lib/utils/search-params";

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "movie", label: "Movie" },
  { value: "series", label: "Series" },
  { value: "episode", label: "Episode" },
  { value: "game", label: "Game" },
] as const;

type SearchFormField = "query" | "year" | "type";
type SearchFormErrors = Partial<Record<SearchFormField, string>>;

type MovieSearchFormProps = {
  initialParams: MovieSearchParams | null;
};

function MovieSearchForm({ initialParams }: MovieSearchFormProps) {
  const router = useRouter();
  const queryInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const typeTriggerRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState(initialParams?.query ?? "");
  const [year, setYear] = useState(initialParams?.year ? String(initialParams.year) : "");
  const [type, setType] = useState(initialParams?.type ?? "all");
  const [errors, setErrors] = useState<SearchFormErrors>({});

  const clearFieldError = (field: SearchFormField) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const navigate = (next: { query: string; year: string; type: string; page?: number }) => {
    const href = buildMovieSearchUrl({
      query: next.query,
      year: next.year || undefined,
      type: next.type === "all" ? undefined : next.type,
      page: next.page ?? 1,
    });
    router.push(href);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = movieSearchFormSchema.safeParse({ query, year, type });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        query: fieldErrors.query?.[0],
        year: fieldErrors.year?.[0],
        type: fieldErrors.type?.[0],
      });

      if (fieldErrors.query?.[0]) {
        queryInputRef.current?.focus();
      } else if (fieldErrors.year?.[0]) {
        yearInputRef.current?.focus();
      } else if (fieldErrors.type?.[0]) {
        typeTriggerRef.current?.focus();
      }

      return;
    }

    setErrors({});
    navigate(parsed.data);
  };

  const handleReset = () => {
    setQuery("");
    setYear("");
    setType("all");
    setErrors({});
    router.push("/");
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-start">
            <div className="grid min-w-0 gap-2 sm:col-span-2">
              <Label htmlFor="search-query">Search movies</Label>
              <Input
                ref={queryInputRef}
                id="search-query"
                name="query"
                type="search"
                placeholder="e.g. Inception"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  clearFieldError("query");
                }}
                autoComplete="off"
                aria-invalid={Boolean(errors.query)}
                aria-describedby={errors.query ? "search-query-error" : undefined}
              />
              <FieldError id="search-query-error" message={errors.query} />
            </div>

            <div className="grid min-w-0 gap-2 sm:col-span-1">
              <Label htmlFor="search-year">Release year</Label>
              <Input
                ref={yearInputRef}
                id="search-year"
                name="year"
                type="text"
                inputMode="numeric"
                placeholder="Optional, e.g. 2010"
                value={year}
                onChange={(event) => {
                  setYear(event.target.value);
                  clearFieldError("year");
                }}
                aria-invalid={Boolean(errors.year)}
                aria-describedby={errors.year ? "search-year-error" : undefined}
              />
              <FieldError id="search-year-error" message={errors.year} />
            </div>

            <div className="grid min-w-0 gap-2 sm:col-span-1">
              <Label htmlFor="search-type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value);
                  clearFieldError("type");
                }}
              >
                <SelectTrigger
                  ref={typeTriggerRef}
                  id="search-type"
                  className="w-full"
                  aria-invalid={Boolean(errors.type)}
                  aria-describedby={errors.type ? "search-type-error" : undefined}
                >
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-full min-w-(--radix-select-trigger-width)">
                  {TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id="search-type-error" message={errors.type} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Clear
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/favorites">View favorites</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type MovieSearchPageProps = {
  initialParams: MovieSearchParams | null;
};

export function MovieSearchPage({ initialParams }: MovieSearchPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Search movies</h1>
        <p className="text-muted-foreground">
          Find movies by name, filter by year or type.
        </p>
      </section>

      <MovieSearchForm key={JSON.stringify(initialParams)} initialParams={initialParams} />

      {initialParams ? (
        <MovieSearchResults searchParams={initialParams} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Enter a movie title above to start searching.
        </p>
      )}
    </div>
  );
}
