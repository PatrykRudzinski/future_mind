import Link from "next/link";

import { FavoriteButton } from "@/components/movies/favorite-button";
import { MoviePoster } from "@/components/movies/movie-poster";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FavoriteMovie } from "@/lib/schemas/favorites";
import type { MovieSummary } from "@/lib/schemas";

type MovieCardProps = {
  movie: MovieSummary;
  onFavoriteRemoved?: (movie: FavoriteMovie) => void;
};

export function MovieCard({ movie, onFavoriteRemoved }: MovieCardProps) {
  const detailsHref = `/movies/${movie.id}`;

  return (
    <Card className="hover:border-primary/30 relative overflow-hidden pt-0 transition-colors">
      <Link
        href={detailsHref}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`View details for ${movie.title}`}
      />

      <div className="pointer-events-none relative z-10">
        <div className="relative aspect-[2/3] w-full">
          <MoviePoster title={movie.title} posterUrl={movie.posterUrl} className="rounded-none" />
          <div className="pointer-events-auto absolute top-2 right-2">
            <FavoriteButton
              movie={movie}
              onRemoved={onFavoriteRemoved}
              className="bg-background/80 hover:bg-background size-9 backdrop-blur-sm"
            />
          </div>
        </div>

        <CardHeader className="gap-2 pt-4 pb-2">
          <h3 className="font-heading line-clamp-2 min-h-[2.75rem] text-base leading-snug font-medium">
            {movie.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{movie.year}</Badge>
            <Badge variant="outline" className="capitalize">
              {movie.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="text-primary pt-0 text-sm font-medium">View details</CardContent>
      </div>
    </Card>
  );
}
