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

## Deployment

Cloudflare Workers with OpenNext is configured. Use this flow:

1. `pnpm wrangler login`
2. `pnpm wrangler secret put TMDB_API_KEY`
3. `pnpm cf:deploy:full`

Detailed beginner steps are in `cloudflare-setup.txt`.

## What Was Implemented

- Server-rendered listing page with 20 titles per page
- Dynamic detail page at `/items/[id]?type=movie|tv`
- Metadata on detail pages (`title`, `description`, `og:image`)
- Debounced search (400ms), media type filter, and sort filter
- URL-driven state (`q`, `type`, `sort`, `page`) for shareable links
- Loading skeletons, error boundary, and empty state
- Top cast section on detail page
- Two focused tests with Vitest + Testing Library

## Pagination Decision

Pagination was chosen over infinite scroll so URL state remains explicit and shareable (`page`, `q`, `type`, `sort`), and so users can jump deterministically during review.

## Architecture Notes

- `lib/api.ts` owns API calls and cache strategy.
- `types/tmdb.ts` contains reusable response types.
- UI is split into focused components under `components/content`.
- Page files are kept small and mostly compose sections.
- URL update behavior is centralized in `SearchFilters`.

## Performance Work

1. `next/image` with responsive `sizes` for posters/backdrops.
2. `next/font` in `app/layout.tsx`.
3. Route-level cache strategy with `revalidate` tuned by endpoint freshness.
4. Streaming-friendly Suspense fallback on listing content.
5. Above-the-fold hero/card images use priority loading while preserving explicit aspect ratios to reduce layout shifts.

## Lighthouse

The latest Lighthouse screenshot is checked in at `public/lighthouse.png`.

## Trade-offs and Known Limitations

- The listing hero uses the first result from the current query context, which favors relevance over manual curation.
- The custom filter UI is lightweight by design to avoid adding another dependency.
- `x-cache-status` validation depends on deployed Workers behavior and should be verified on the live URL.
- OpenNext deploy is more stable in WSL than native Windows.

## Bonus Tasks Attempted

### B-1 Cloudflare Workers Edge Caching with OpenNext

- OpenNext adapter integrated into scripts and deployment flow.
- Fetch-level revalidation strategy documented in `lib/api.ts` (`120`, `300`, `1800`).
- Verification: deploy, then inspect response headers on repeated listing requests.
- Current status: partial until `x-cache-status` is confirmed on live listing responses.

### B-2 React 18 Streaming with Suspense

- Implemented on listing route with Suspense fallback skeletons in `app/page.tsx`.
- Verification: throttle network in DevTools and confirm fallback appears before results.

### B-3 Accessibility Audit

- Lighthouse accessibility score recorded at >=95 in `assesment.txt`.
- Contrast updates applied after audit feedback.
- Verification: rerun Lighthouse on deployed URL and attach final screenshot.

## Process and Assessment Notes

- If deployment/runtime issues block anything, I’ll call it out here instead of quietly removing a feature.
- Keeping commits small and readable so it’s easy to review.

## Verify

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm cf:deploy:full` (deployment pipeline)
