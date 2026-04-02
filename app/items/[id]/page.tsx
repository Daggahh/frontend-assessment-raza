import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTitleDetail } from "@/lib/api";
import { DEFAULT_IMAGE, TMDB_IMAGE_BASE } from "@/lib/constants";
import type { MediaType } from "@/types/tmdb";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ params, searchParams }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { type } = await searchParams;
  const mediaType: MediaType = type === "tv" ? "tv" : "movie";
  const titleData = await getTitleDetail(id, mediaType);
  const image = titleData.backdrop_path ? `${TMDB_IMAGE_BASE}/w780${titleData.backdrop_path}` : DEFAULT_IMAGE;
  const title = titleData.title ?? titleData.name ?? "Title";

  return {
    title: `${title} | ReelForge`,
    description: titleData.overview,
    openGraph: {
      title,
      description: titleData.overview,
      images: [image]
    }
  };
}

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const { id } = await params;
  const { type } = await searchParams;
  const mediaType: MediaType = type === "tv" ? "tv" : "movie";
  const titleData = await getTitleDetail(id, mediaType);
  const title = titleData.title ?? titleData.name ?? "Untitled";
  const heroImage = titleData.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${titleData.backdrop_path}` : DEFAULT_IMAGE;
  const poster = titleData.poster_path ? `${TMDB_IMAGE_BASE}/w500${titleData.poster_path}` : DEFAULT_IMAGE;
  const releaseDate = titleData.release_date ?? titleData.first_air_date ?? "Unknown";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-slate-400">
        <Link href="/" className="hover:underline">
          Browse
        </Link>{" "}
        / <span className="text-slate-200">{title}</span>
      </nav>

      <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="relative aspect-video w-full bg-slate-950">
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
          <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-slate-700">
            <Image src={poster} alt={title} fill sizes="260px" className="object-cover" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">{title}</h1>
            {titleData.tagline ? <p className="text-amber-300">{titleData.tagline}</p> : null}
            <p className="text-slate-300">{titleData.overview || "No synopsis available."}</p>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <p>
                <strong className="text-slate-100">Type:</strong> {mediaType === "movie" ? "Movie" : "TV Show"}
              </p>
              <p>
                <strong className="text-slate-100">Release:</strong> {releaseDate}
              </p>
              <p>
                <strong className="text-slate-100">Rating:</strong> {titleData.vote_average.toFixed(1)} (
                {titleData.vote_count.toLocaleString()} votes)
              </p>
              <p>
                <strong className="text-slate-100">{mediaType === "movie" ? "Runtime" : "Seasons"}:</strong>{" "}
                {mediaType === "movie"
                  ? `${titleData.runtime ?? "N/A"} min`
                  : `${titleData.number_of_seasons ?? "N/A"} seasons`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {titleData.genres.map((genre) => (
                <span key={genre.id} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                  {genre.name}
                </span>
              ))}
            </div>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-100">Top Cast</h2>
              <div className="grid grid-cols-1 gap-2 text-sm text-slate-300 sm:grid-cols-2">
                {(titleData.credits?.cast ?? []).slice(0, 8).map((member) => (
                  <p key={member.id}>
                    <strong className="text-slate-100">{member.name}</strong> as {member.character}
                  </p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
