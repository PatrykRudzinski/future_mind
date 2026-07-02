import { MovieSearchPage } from "@/components/movies/movie-search-form";
import { parseMovieSearchParams, type MovieSearchUrlParams } from "@/lib/utils/search-params";

type HomePageProps = {
  searchParams: Promise<MovieSearchUrlParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const parsedSearch = parseMovieSearchParams(params);

  return <MovieSearchPage initialParams={parsedSearch} />;
}
