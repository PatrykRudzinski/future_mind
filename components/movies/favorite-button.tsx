"use client";

import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/hooks/use-favorites";
import type { FavoriteMovie } from "@/lib/schemas/favorites";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  movie: FavoriteMovie;
  variant?: "icon" | "default";
  className?: string;
  onRemoved?: (movie: FavoriteMovie) => void;
};

export function FavoriteButton({
  movie,
  variant = "icon",
  className,
  onRemoved,
}: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite, isPending } = useFavorites();
  const saved = isFavorite(movie.id);
  const label = saved ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`;

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (saved) {
      if (onRemoved) {
        onRemoved(movie);
        return;
      }

      removeFavorite(movie.id);
      return;
    }

    addFavorite(movie);
  };

  if (variant === "default") {
    return (
      <Button
        type="button"
        variant={saved ? "secondary" : "outline"}
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={saved}
        className={cn("cursor-pointer", className)}
      >
        <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
        {saved ? "Remove from favorites" : "Add to favorites"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={label}
      className={cn("cursor-pointer", className)}
    >
      <Heart className={cn("size-4", saved && "fill-current text-red-500")} aria-hidden="true" />
    </Button>
  );
}
