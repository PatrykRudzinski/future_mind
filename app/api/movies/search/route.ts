import { NextResponse } from "next/server";

import { OmdbApiError, searchMoviesPaginated } from "@/lib/api";
import { movieSearchParamsSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = movieSearchParamsSchema.safeParse({
    query: searchParams.get("query") ?? "",
    type: searchParams.get("type") ?? undefined,
    year: searchParams.get("year") ?? undefined,
    page: searchParams.get("page") ?? 1,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid search parameters" },
      { status: 400 },
    );
  }

  try {
    const data = await searchMoviesPaginated(parsed.data);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof OmdbApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status ?? 502 });
    }

    if (error instanceof Error && error.message) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
