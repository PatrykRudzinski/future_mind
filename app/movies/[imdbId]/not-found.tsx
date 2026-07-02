import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MovieNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Movie not found</h1>
      <p className="text-muted-foreground">
        We could not find details for this title. It may have been removed or the link is invalid.
      </p>
      <Button asChild variant="outline" className="w-fit">
        <Link href="/">Back to search</Link>
      </Button>
    </div>
  );
}
