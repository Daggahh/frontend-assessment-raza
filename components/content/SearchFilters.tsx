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
    <div className="relative z-30 mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 shadow-sm backdrop-blur-md md:grid-cols-[2fr_1fr_1fr] md:gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="search-input" className="text-sm font-semibold tracking-wide text-slate-300">
          Search
        </label>
        <div className="flex h-11 items-center rounded-lg border border-slate-700 bg-slate-950/80 px-3 transition-colors focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/50">
          <input
            id="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            placeholder="Search movies or TV titles..."
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-wide text-slate-300">Type</span>
        <div className="grid h-11 grid-cols-2 gap-1 rounded-lg border border-slate-700 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => updateParam("type", "movie")}
            className={`flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ${
              initialType === "movie" 
                ? "bg-amber-400 text-slate-950 shadow-sm" 
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            Movies
          </button>
          <button
            type="button"
            onClick={() => updateParam("type", "tv")}
            className={`flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ${
              initialType === "tv" 
                ? "bg-amber-400 text-slate-950 shadow-sm" 
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            TV Shows
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-wide text-slate-300">Sort By</span>
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/80 px-4 text-left text-sm font-medium text-slate-200 outline-none transition-colors hover:border-slate-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
          >
            <span>{activeSortLabel}</span>
            <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {isSortOpen ? (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-xl shadow-black/50">
              <ul role="listbox" className="py-1">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSortOpen(false);
                        updateParam("sort", option.value);
                      }}
                      className={`w-full cursor-pointer px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        option.value === initialSort
                          ? "bg-amber-400/10 text-amber-400"
                          : "text-slate-300 hover:bg-slate-800"
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
      </div>
    </div>
  );
}
