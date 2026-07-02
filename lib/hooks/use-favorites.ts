"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import type { FavoriteMovie, FavoritesStorage } from "@/lib/schemas/favorites";
import { favoritesStorageAdapter } from "@/lib/utils/favorites-storage";

function readFavorites(): FavoritesStorage {
  return favoritesStorageAdapter.read().data;
}

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: queryKeys.favorites.all,
    queryFn: readFavorites,
  });

  const syncFavorites = (next: FavoritesStorage) => {
    queryClient.setQueryData(queryKeys.favorites.all, next);
  };

  const addMutation = useMutation({
    mutationFn: async (movie: FavoriteMovie) => {
      const current = readFavorites();

      if (current.some((item) => item.id === movie.id)) {
        return current;
      }

      const next = [...current, movie];
      favoritesStorageAdapter.write(next);
      return next;
    },
    onSuccess: syncFavorites,
  });

  const removeMutation = useMutation({
    mutationFn: async (imdbId: string) => {
      const next = readFavorites().filter((item) => item.id !== imdbId);
      favoritesStorageAdapter.write(next);
      return next;
    },
    onSuccess: syncFavorites,
  });

  const isFavorite = (imdbId: string) => favorites.some((item) => item.id === imdbId);

  const addFavorite = (movie: FavoriteMovie) => {
    addMutation.mutate(movie);
  };

  const removeFavorite = (imdbId: string) => {
    removeMutation.mutate(imdbId);
  };

  const toggleFavorite = (movie: FavoriteMovie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
      return;
    }

    addFavorite(movie);
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isPending: addMutation.isPending || removeMutation.isPending,
  };
}
