"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MediaType, SortBy } from "@/types/tmdb";

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "primary_release_date.desc", label: "Newest Releases" }
];

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();

  const initialQuery = searchParams.get("q") ?? "";
  const initialType = (searchParams.get("type") as MediaType | null) ?? "movie";
  const initialSort = (searchParams.get("sort") as SortBy | null) ?? "popularity.desc";
  const [query, setQuery] = useState(initialQuery);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      if (query === currentQ) {
        return;
      }

      const nextParams = new URLSearchParams(paramsString);
      if (query) {
        nextParams.set("q", query);
      } else {
        nextParams.delete("q");
      }
      nextParams.delete("page");
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, 400);

    return () => clearTimeout(timeout);
  }, [paramsString, pathname, query, router, searchParams]);

  const activeSortLabel = useMemo(
    () => SORT_OPTIONS.find((option) => option.value === initialSort)?.label ?? "Most Popular",
    [initialSort]
  );

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(paramsString);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.delete("page");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 md:grid-cols-[2fr_1fr_1fr]">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
        Search
        <div className="flex items-center rounded-md border border-slate-700 bg-slate-950 px-3 focus-within:ring-2 focus-within:ring-amber-500/50">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent py-2 text-slate-100 outline-none"
            placeholder="Search movies or TV titles..."
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-2 rounded px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Clear search"
            >
              X
            </button>
          ) : null}
        </div>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
        Type
        <div className="grid grid-cols-2 rounded-md border border-slate-700 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => updateParam("type", "movie")}
            className={`rounded px-3 py-2 text-sm transition ${
              initialType === "movie" ? "bg-amber-400 font-semibold text-slate-950" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Movies
          </button>
          <button
            type="button"
            onClick={() => updateParam("type", "tv")}
            className={`rounded px-3 py-2 text-sm transition ${
              initialType === "tv" ? "bg-amber-400 font-semibold text-slate-950" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            TV Shows
          </button>
        </div>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
        Sort
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-left text-slate-100 outline-none ring-amber-500/50 transition hover:border-slate-600 focus:ring-2"
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
          >
            <span>{activeSortLabel}</span>
            <span className={`text-xs text-slate-400 transition ${isSortOpen ? "rotate-180" : ""}`}>v</span>
          </button>
          {isSortOpen ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-700 bg-slate-950 shadow-lg shadow-black/40">
              <ul role="listbox" className="py-1">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSortOpen(false);
                        updateParam("sort", option.value);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm transition ${
                        option.value === initialSort
                          ? "bg-amber-400/20 text-amber-300"
                          : "text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </label>
    </div>
  );
}
