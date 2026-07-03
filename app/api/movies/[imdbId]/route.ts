import { NextResponse } from "next/server";

import {
  getMovieByImdbId,
  isOmdbError,
  mapOmdbDetailToMovieDetail,
  OmdbApiError,
} from "@/lib/api";
import { movieDetailParamsSchema } from "@/lib/schemas";

const CACHE_HEADERS = {
  "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
};

type RouteContext = {
  params: Promise<{ imdbId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { imdbId } = await context.params;
  const { searchParams } = new URL(request.url);

  const parsed = movieDetailParamsSchema.safeParse({
    imdbId,
    plot: searchParams.get("plot") ?? "full",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid movie parameters" },
      { status: 400 },
    );
  }

  try {
    const response = await getMovieByImdbId(parsed.data);

    if (isOmdbError(response)) {
      return NextResponse.json({ error: response.Error }, { status: 404 });
    }

    return NextResponse.json(mapOmdbDetailToMovieDetail(response), { headers: CACHE_HEADERS });
  } catch (error) {
    if (error instanceof OmdbApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status ?? 502 });
    }

    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 });
  }
}
