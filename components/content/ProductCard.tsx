import Image from "next/image";
import Link from "next/link";
import { DEFAULT_IMAGE, TMDB_IMAGE_BASE } from "@/lib/constants";
import type { MediaType, TmdbListItem } from "@/types/tmdb";

type ProductCardProps = {
  product: TmdbListItem;
  mediaType: MediaType;
  priority?: boolean;
};

const getYear = (value?: string) => (value ? value.slice(0, 4) : "N/A");

export function ProductCard({ product, mediaType, priority = false }: ProductCardProps) {
  const title = product.title ?? product.name ?? "Untitled";
  const releaseDate = product.release_date ?? product.first_air_date;
  const poster = product.poster_path ? `${TMDB_IMAGE_BASE}/w500${product.poster_path}` : DEFAULT_IMAGE;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:shadow-amber-400/20">
      <Link href={`/items/${product.id}?type=${mediaType}`} className="block">
        <div className="relative aspect-2/3 w-full overflow-hidden bg-slate-900">
          <Image
            src={poster}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-4">
          <h2 className="line-clamp-1 text-base font-bold text-slate-100">{title}</h2>
          <p className="line-clamp-2 text-sm text-slate-400">{product.overview || "No plot summary available."}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <span className="rounded bg-slate-800 px-2 py-1">Year: {getYear(releaseDate)}</span>
            <span className="rounded bg-slate-800 px-2 py-1">Lang: {product.original_language.toUpperCase()}</span>
            <span className="rounded bg-slate-800 px-2 py-1">Rating: {product.vote_average.toFixed(1)}</span>
            <span className="rounded bg-slate-800 px-2 py-1">Votes: {product.vote_count}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
