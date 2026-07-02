import { MovieCard } from "@/components/movies/movie-card";
import type { FavoriteMovie } from "@/lib/schemas/favorites";
import type { MovieSummary } from "@/lib/schemas";

type MovieGridProps = {
  movies: MovieSummary[];
  onFavoriteRemoved?: (movie: FavoriteMovie) => void;
};

export function MovieGrid({ movies, onFavoriteRemoved }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} onFavoriteRemoved={onFavoriteRemoved} />
        </li>
      ))}
    </ul>
  );
}
