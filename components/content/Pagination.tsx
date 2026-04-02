import Link from "next/link";

type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  searchParams: Record<string, string | undefined>;
};

const buildHref = (page: number, searchParams: Record<string, string | undefined>) => {
  const nextParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      nextParams.set(key, value);
    }
  });

  nextParams.set("page", String(page));
  return `/?${nextParams.toString()}`;
};

export function Pagination({ page, total, limit, searchParams }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
      <Link
        href={hasPrevious ? buildHref(page - 1, searchParams) : "#"}
        aria-disabled={!hasPrevious}
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
          hasPrevious
            ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
            : "cursor-not-allowed bg-slate-800 text-slate-500"
        }`}
      >
        Previous
      </Link>
      <span className="text-sm text-slate-300">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hasNext ? buildHref(page + 1, searchParams) : "#"}
        aria-disabled={!hasNext}
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
          hasNext
            ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
            : "cursor-not-allowed bg-slate-800 text-slate-500"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
