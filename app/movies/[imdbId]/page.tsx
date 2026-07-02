import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MovieDetailView } from "@/components/movies/movie-detail-view";
import { Button } from "@/components/ui/button";
import {
  getMovieByImdbId,
  isOmdbError,
  mapOmdbDetailToMovieDetail,
  OmdbApiError,
} from "@/lib/api";

type MovieDetailsPageProps = {
  params: Promise<{ imdbId: string }>;
};

const loadMovie = cache(async function loadMovie(imdbId: string) {
  try {
    const response = await getMovieByImdbId({ imdbId, plot: "full" });

    if (isOmdbError(response)) {
      return null;
    }

    return mapOmdbDetailToMovieDetail(response);
  } catch (error) {
    if (error instanceof OmdbApiError) {
      return null;
    }

    throw error;
  }
});

export async function generateMetadata({ params }: MovieDetailsPageProps): Promise<Metadata> {
  const { imdbId } = await params;
  const movie = await loadMovie(imdbId);

  if (!movie) {
    return {
      title: "Movie not found",
    };
  }

  return {
    title: movie.title,
    description: movie.plot ?? `Details for ${movie.title} (${movie.year})`,
    openGraph: {
      title: movie.title,
      description: movie.plot,
      images: movie.posterUrl ? [{ url: movie.posterUrl, alt: movie.title }] : undefined,
    },
  };
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { imdbId } = await params;
  const movie = await loadMovie(imdbId);

  if (!movie) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
      <nav aria-label="Breadcrumb">
        <Button asChild variant="ghost" className="h-auto px-0">
          <Link href="/">← Back to search</Link>
        </Button>
      </nav>
      <MovieDetailView movie={movie} />
    </div>
  );
}
