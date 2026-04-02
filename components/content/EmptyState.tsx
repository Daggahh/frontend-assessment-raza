type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  );
}
