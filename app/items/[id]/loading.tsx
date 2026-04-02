export default function LoadingDetail() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 aspect-video rounded bg-slate-200" />
        <div className="mb-3 h-8 w-2/3 rounded bg-slate-200" />
        <div className="h-5 w-full rounded bg-slate-200" />
      </div>
    </main>
  );
}
