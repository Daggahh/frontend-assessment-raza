export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-4 aspect-2/3 rounded-lg bg-slate-800" />
      <div className="mb-2 h-5 w-2/3 rounded bg-slate-800" />
      <div className="mb-2 h-4 w-full rounded bg-slate-800" />
      <div className="h-4 w-1/2 rounded bg-slate-800" />
    </div>
  );
}
