"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type MoviePosterProps = {
  title: string;
  posterUrl?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function PosterPlaceholder({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center rounded-lg p-3 text-center text-sm",
        className,
      )}
      role="img"
      aria-label={`No poster available for ${title}`}
    >
      No poster
    </div>
  );
}

export function MoviePoster({
  title,
  posterUrl,
  className,
  sizes = "(max-width: 768px) 100vw, 240px",
  priority = false,
}: MoviePosterProps) {
  const [hasError, setHasError] = useState(false);

  if (!posterUrl || hasError) {
    return <PosterPlaceholder title={title} className={className} />;
  }

  return (
    <Image
      src={posterUrl}
      alt={`Poster for ${title}`}
      fill
      className={cn("rounded-lg object-cover", className)}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
