"use client";

import Link from "next/link";

import { FavoriteButton } from "@/components/movies/favorite-button";
import { MoviePoster } from "@/components/movies/movie-poster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MovieDetail } from "@/lib/schemas";

type MovieDetailViewProps = {
  movie: MovieDetail;
};

function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <>
      <dt className="text-muted-foreground text-sm sm:pt-0.5">{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

export function MovieDetailView({ movie }: MovieDetailViewProps) {
  return (
    <article className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px]">
        <MoviePoster title={movie.title} posterUrl={movie.posterUrl} priority />
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">{movie.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{movie.year}</Badge>
                <Badge variant="outline" className="capitalize">
                  {movie.type}
                </Badge>
                {movie.rated ? <Badge variant="outline">{movie.rated}</Badge> : null}
                {movie.imdbRating ? (
                  <Badge variant="outline">IMDb {movie.imdbRating}/10</Badge>
                ) : null}
              </div>
            </div>
            <FavoriteButton movie={movie} variant="default" />
          </div>

          {movie.plot ? (
            <p className="text-muted-foreground leading-relaxed">{movie.plot}</p>
          ) : null}
        </div>

        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[max-content_minmax(0,1fr)]">
          <DetailField label="Genre" value={movie.genre} />
          <DetailField label="Director" value={movie.director} />
          <DetailField label="Cast" value={movie.actors} />
          <DetailField label="Runtime" value={movie.runtime} />
          <DetailField label="Votes" value={movie.imdbVotes} />
          <DetailField label="Awards" value={movie.awards} />
        </dl>

        <Button asChild variant="outline">
          <Link href="/">Back to search</Link>
        </Button>
      </div>
    </article>
  );
}
