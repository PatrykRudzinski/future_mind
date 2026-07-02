import type { Metadata } from "next";

import { FavoritesList } from "@/components/movies/favorites-list";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved movies",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>
        <p className="text-muted-foreground">
          Movies you save here stay in your browser after refresh.
        </p>
      </section>

      <FavoritesList />
    </div>
  );
}
