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
import { config } from "@/lib/config";
import type { MovieDetail } from "@/lib/schemas";

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

function buildMovieDescription(movie: MovieDetail): string {
  if (movie.plot) {
    return movie.plot.length > 160 ? `${movie.plot.slice(0, 157)}...` : movie.plot;
  }

  const parts = [`${movie.title} (${movie.year})`];

  if (movie.genre) {
    parts.push(movie.genre);
  }

  if (movie.director) {
    parts.push(`Directed by ${movie.director}`);
  }

  if (movie.imdbRating) {
    parts.push(`IMDb ${movie.imdbRating}/10`);
  }

  return parts.join(" — ");
}

export async function generateMetadata({ params }: MovieDetailsPageProps): Promise<Metadata> {
  const { imdbId } = await params;
  const movie = await loadMovie(imdbId);

  if (!movie) {
    return {
      title: "Movie not found",
      description: "The requested movie could not be found.",
    };
  }

  const description = buildMovieDescription(movie);

  return {
    title: movie.title,
    description,
    alternates: {
      canonical: `/movies/${movie.id}`,
    },
    openGraph: {
      title: movie.title,
      description,
      url: `/movies/${movie.id}`,
      type: "video.movie",
      images: movie.posterUrl ? [{ url: movie.posterUrl, alt: movie.title }] : undefined,
    },
    twitter: {
      card: movie.posterUrl ? "summary_large_image" : "summary",
      title: movie.title,
      description,
      images: movie.posterUrl ? [movie.posterUrl] : undefined,
    },
  };
}

function movieJsonLd(movie: NonNullable<Awaited<ReturnType<typeof loadMovie>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    url: `${config.app.url}/movies/${movie.id}`,
    image: movie.posterUrl || undefined,
    datePublished: movie.year,
    description: movie.plot,
    genre: movie.genre?.split(",").map((genre) => genre.trim()),
    director: movie.director,
    actor: movie.actors?.split(",").map((actor) => ({ "@type": "Person", name: actor.trim() })),
    aggregateRating: movie.imdbRating
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.imdbRating,
          bestRating: "10",
          ratingCount: movie.imdbVotes?.replaceAll(",", ""),
        }
      : undefined,
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
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Button asChild variant="ghost" className="h-auto px-0">
              <Link href="/">Search</Link>
            </Button>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            /
          </li>
          <li className="text-muted-foreground" aria-current="page">
            {movie.title}
          </li>
        </ol>
      </nav>
      <MovieDetailView movie={movie} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieJsonLd(movie)).replaceAll("<", "\\u003c"),
        }}
      />
    </div>
  );
}
