import { ProductCardSkeleton } from "@/components/content/ProductCardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-56 animate-pulse rounded-3xl bg-slate-800" />
      <div className="mb-6 h-24 animate-pulse rounded-2xl bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
