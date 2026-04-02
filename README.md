# ReelForge

TMDB movie and TV explorer built with Next.js App Router + TypeScript.

## API Choice

The app uses [The Movie Database (TMDB)](https://developer.themoviedb.org/docs) for movies, TV shows, and cast data.

## Setup

1. `pnpm install`
2. Copy `.env.example` to `.env.local`
3. Set `TMDB_API_KEY` in `.env.local`
4. `pnpm dev`

Open `http://localhost:3000`.

## What Was Implemented

- Server-rendered listing page with 20 TMDB titles per page
- Custom cinematic hero section (trending title spotlight)
- Beautiful, non-basic card grid with poster, year, language, votes, and rating
- Dynamic detail page at `/items/[id]?type=movie|tv`
- Full metadata generation for detail pages (`title`, `description`, `og:image`)
- Breadcrumb back navigation
- Debounced search (400ms) with URL state
- Additional filters: media type (movie/tv) + sort mode
- URL-driven shareable states (`q`, `type`, `sort`, `page`)
- Loading skeletons, error boundary, and no-results empty state
- Cast section on details page
- Two unit test files with Vitest + RTL

## Architecture Notes

- `lib/api.ts` contains all TMDB fetch logic and cache strategy.
- `types/tmdb.ts` stores shared API response types.
- UI logic is split into focused components under `components/content`.
- Pages stay thin and orchestration-focused.

## Performance Work

1. `next/image` with responsive `sizes` for posters/backdrops.
2. `next/font` in `app/layout.tsx`.
3. Route-level cache strategy with `revalidate` tuned by endpoint freshness.
4. Streaming-friendly Suspense fallback on listing content.

## Verify

- `pnpm lint`
- `pnpm test`
- `pnpm build`
