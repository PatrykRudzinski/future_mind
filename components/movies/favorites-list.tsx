"use client";

import Link from "next/link";
import { toast } from "sonner";

import { MovieGrid } from "@/components/movies/movie-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/lib/hooks/use-favorites";
import type { FavoriteMovie } from "@/lib/schemas/favorites";

export function FavoritesList() {
  const { favorites, isLoading, addFavorite, removeFavorite } = useFavorites();

  const handleFavoriteRemoved = (movie: FavoriteMovie) => {
    removeFavorite(movie.id);

    toast.success(`Removed "${movie.title}" from favorites`, {
      action: {
        label: "Undo",
        onClick: () => addFavorite(movie),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <Alert>
        <AlertTitle>No favorites yet</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>Search for movies and add them to your favorites list.</p>
          <Button asChild variant="outline">
            <Link href="/">Start searching</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="space-y-4">
      <p className="text-muted-foreground text-sm">
        {favorites.length} saved {favorites.length === 1 ? "movie" : "movies"}
      </p>
      <MovieGrid movies={favorites} onFavoriteRemoved={handleFavoriteRemoved} />
    </section>
  );
}
