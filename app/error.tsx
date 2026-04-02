"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-xl border border-red-900 bg-red-950/60 p-6">
        <h1 className="text-2xl font-semibold text-red-200">Unable to load this page</h1>
        <p className="mt-2 text-red-300">
          TMDB data could not be fetched right now. Retry, or check your API key configuration.
        </p>
        <p className="mt-2 text-sm text-red-400">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
