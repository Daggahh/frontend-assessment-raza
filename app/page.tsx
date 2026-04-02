import { Suspense } from "react";
import { EmptyState } from "@/components/content/EmptyState";
import { Pagination } from "@/components/content/Pagination";
import { ProductsGrid } from "@/components/content/ProductsGrid";
import { SearchFilters } from "@/components/content/SearchFilters";
import { ProductCardSkeleton } from "@/components/content/ProductCardSkeleton";
import { DEFAULT_IMAGE, TMDB_IMAGE_BASE } from "@/lib/constants";
import { getPageSize, getTitles } from "@/lib/api";
import { parsePositiveInt } from "@/lib/utils";
import type { MediaType, SortBy } from "@/types/tmdb";
import Image from "next/image";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function ProductsSection({
  page,
  query,
  mediaType,
  sortBy
}: {
  page: number;
  query?: string;
  mediaType: MediaType;
  sortBy: SortBy;
}) {
  const { results, total_results } = await getTitles({ page, query, mediaType, sortBy });

  if (!results.length) {
    return (
      <EmptyState
        title="No titles found"
        description="Try another keyword, switch title type, or change your sorting selection."
      />
    );
  }

  return (
    <>
      <ProductsGrid products={results} mediaType={mediaType} />
      <Pagination
        page={page}
        total={total_results}
        limit={getPageSize()}
        searchParams={{ q: query, type: mediaType, sort: sortBy }}
      />
    </>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = parsePositiveInt(typeof params.page === "string" ? params.page : undefined, 1);
  const query = typeof params.q === "string" ? params.q : undefined;
  const mediaType = params.type === "tv" ? "tv" : "movie";
  const allowedSort: SortBy[] = ["popularity.desc", "vote_average.desc", "primary_release_date.desc"];
  const sortBy = allowedSort.includes(params.sort as SortBy) ? (params.sort as SortBy) : "popularity.desc";
  const titlesForHero = await getTitles({ page, query, mediaType, sortBy });
  const hero = titlesForHero.results[0] ?? null;
  const heroImage = hero?.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${hero.backdrop_path}` : DEFAULT_IMAGE;
  const heroTitle = hero?.title ?? hero?.name ?? "Discover your next favorite title";
  const heroOverview = hero?.overview ?? "Explore trending, top-rated, and fresh releases with an IMDb-style experience.";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={heroTitle} fill priority sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        </div>
        <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
          <p className="mb-2 inline-block rounded bg-amber-400 px-2 py-1 text-xs font-bold tracking-wide text-slate-950">
            REELFORGE
          </p>
          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">{heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-slate-300">{heroOverview}</p>
        </div>
      </header>

      <SearchFilters />

      <Suspense key={`${page}-${query ?? ""}-${mediaType}-${sortBy}`} fallback={<ListingSkeleton />}>
        <ProductsSection page={page} query={query} mediaType={mediaType} sortBy={sortBy} />
      </Suspense>
    </main>
  );
}
