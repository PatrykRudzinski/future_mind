# Movie Finder

A Next.js movie search application built for the Future Mind recruitment task. Browse movies via the [OMDb API](https://www.omdbapi.com/), view details, and manage a persistent favorites list.

## Features

| Area              | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **Home**          | Search form, filters (year, type), results list, classic pagination (16 items per page)          |
| **Movie details** | Title, plot, genre, year, rating, poster, and related metadata; SSR with SEO metadata + JSON-LD |
| **Favorites**     | Dedicated `/favorites` page — add/remove movies; persisted in `localStorage` across refreshes    |
| **UX & SEO**      | Responsive layout, WCAG basics, theme toggle (light/dark), Open Graph / Twitter cards, sitemap   |

## Tech stack

| Tool                                          | Purpose                                        |
| --------------------------------------------- | ---------------------------------------------- |
| [Next.js 16](https://nextjs.org/)             | App Router, SSR/SSG for SEO, API routes as BFF |
| [React 19](https://react.dev/)                | UI                                             |
| [TypeScript](https://www.typescriptlang.org/) | Type safety                                    |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Styling                                        |
| [shadcn/ui](https://ui.shadcn.com/)           | Accessible, composable UI components           |
| [TanStack Query](https://tanstack.com/query)  | Server state, caching, loading/error states    |
| [Zod](https://zod.dev/)                       | Runtime validation for API responses and DTOs  |

## Getting started

### Prerequisites

- Node.js 20+
- OMDb API key from [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)

### Initial setup

```bash
git clone <repository-url>
cd future_mind

npm install

cp .env.example .env.local
# Edit .env.local and set OMDB_API_KEY=your_key_here
```

### Development

Start the dev server with hot reload:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

Useful during development:

```bash
npm run lint          # Run ESLint
npm run test          # Run unit tests
npm run build         # Verify the app builds successfully
```

To use a different port:

```bash
npm run dev -- -p 3001
```

### Production

Build and run the optimized production server locally:

```bash
npm run build
npm run start
```

The app runs at [http://localhost:3000](http://localhost:3000) by default.

To use a different port:

```bash
PORT=3001 npm run start
```

### Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start development server (hot reload)      |
| `npm run build` | Create optimized production build          |
| `npm run start` | Serve production build (run after `build`) |
| `npm run lint`  | Run ESLint                                 |
| `npm run test`  | Run unit tests (Vitest)                    |

## Configuration

Environment variables (see `.env.example`):

| Variable                   | Required | Description                                                              |
| -------------------------- | -------- | ------------------------------------------------------------------------ |
| `OMDB_API_KEY`             | Yes      | Server-side OMDb API key                                                 |
| `NEXT_PUBLIC_OMDB_API_URL` | No       | OMDb base URL (default: `https://www.omdbapi.com/`)                      |
| `NEXT_PUBLIC_APP_URL`      | No       | Public app URL for canonical links and sitemap (default: `http://localhost:3000`; set in production) |

Runtime config lives in `lib/config.ts`. The API key is **never** exposed to the browser — client code calls internal Next.js API routes.

## Routing

Next.js App Router structure:

```
app/
├── page.tsx                    → /           Home (search + results)
├── favorites/page.tsx          → /favorites  Saved movies
├── movies/[imdbId]/page.tsx    → /movies/:id Movie details (SEO-friendly dynamic route)
└── api/
    └── movies/
        ├── search/route.ts     → GET /api/movies/search
        └── [imdbId]/route.ts   → GET /api/movies/:imdbId
```

| Route                  | Type            | Purpose                                        |
| ---------------------- | --------------- | ---------------------------------------------- |
| `/`                    | Server + Client | Search UI, filters, paginated results          |
| `/movies/[imdbId]`     | Dynamic         | Movie detail view; `generateMetadata` for SEO  |
| `/favorites`           | Client-heavy    | Favorites list from localStorage               |
| `/api/movies/search`   | Route Handler   | Proxy to OMDb search (`s` param)               |
| `/api/movies/[imdbId]` | Route Handler   | Proxy to OMDb detail (`i` param)               |

## API module

```
lib/api/
├── omdb-client.ts    # Server-side OMDb fetch + Zod parse
├── client.ts         # Browser fetch to internal /api routes
├── endpoints.ts      # Route + upstream endpoint documentation
├── query-keys.ts     # TanStack Query key factory
├── hooks.ts          # useSearchMovies, useMovieDetail
└── mappers.ts        # OMDb → app DTO transformers
```

### Endpoints

**Internal (React Query → BFF)**

| Method | Path                   | Query params                       | Response               |
| ------ | ---------------------- | ---------------------------------- | ---------------------- |
| `GET`  | `/api/movies/search`   | `query`, `type?`, `year?`, `page?` | `PaginatedMovieSearch` |
| `GET`  | `/api/movies/[imdbId]` | `plot?` (`short` \| `full`)        | `MovieDetail`          |

**Upstream OMDb** (server-only, see [OMDb docs](https://www.omdbapi.com/))

| Operation       | OMDb params                 | Used for                   |
| --------------- | --------------------------- | -------------------------- |
| Search          | `s`, `type?`, `y?`, `page?` | Home page search + filters |
| Detail by ID    | `i`, `plot?`                | Movie details page         |
| Detail by title | `t`, `plot?`                | Optional fallback lookup   |

**Not needed from OMDb:** favorites — stored client-side in `localStorage`.

### React Query hooks

```tsx
import { useSearchMovies, useMovieDetail } from "@/lib/api/hooks";

const { data, isLoading, error } = useSearchMovies({
  query: "inception",
  page: 1,
});
const { data: movie } = useMovieDetail({ imdbId: "tt1375666" });
```

## Zod DTOs

Schemas in `lib/schemas/`:

| File           | Schemas                                      | Role                    |
| -------------- | -------------------------------------------- | ----------------------- |
| `omdb.ts`      | Raw OMDb API response shapes                 | Validate upstream JSON  |
| `movie.ts`     | `MovieSummary`, `MovieDetail`, search params | App-level DTOs          |
| `favorites.ts` | `FavoritesStorage`                           | localStorage validation |

Mappers in `lib/api/mappers.ts` convert validated OMDb responses into app DTOs.

## shadcn/ui

Initialized via `components.json` (New York style, CSS variables, `@/` aliases).

| Path              | Description                                      |
| ----------------- | ------------------------------------------------ |
| `components/ui/`  | shadcn components (`button`, `input`, `card`, …) |
| `lib/utils/cn.ts` | `cn()` helper (clsx + tailwind-merge)            |
| `app/globals.css` | Theme tokens (`--primary`, `--muted`, etc.)      |

Add more components:

```bash
npx shadcn@latest add select badge skeleton
```

Components are copied into the repo (not installed as a package), so they can be customized freely.

## Project structure

```
├── app/                  # Routes, layouts, API handlers
├── components/
│   ├── providers/        # QueryProvider
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api/              # API client, hooks, mappers
│   ├── schemas/          # Zod DTOs
│   ├── config.ts         # App + OMDb configuration
│   └── utils/            # Shared utilities (cn.ts, …)
├── docs/task.md          # Recruitment task specification
└── .cursor/rules/        # Cursor AI project rules
```

## License

Private — recruitment task submission.
