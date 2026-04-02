import { PAGE_SIZE } from "@/lib/constants";
import type { MediaType, SortBy, TmdbDetail, TmdbListItem, TmdbPagedResponse } from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is missing. Add it to your environment variables.");
  }
  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number>, revalidate = 300): Promise<T> {
  const query = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    api_key: getApiKey()
  });

  const response = await fetch(`${TMDB_BASE_URL}${path}?${query.toString()}`, {
    next: { revalidate }
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function getTitles(params: {
  page?: number;
  query?: string;
  mediaType: MediaType;
  sortBy: SortBy;
}): Promise<TmdbPagedResponse<TmdbListItem>> {
  const page = params.page ?? 1;
  const query = params.query?.trim();

  if (query) {
    return tmdbFetch<TmdbPagedResponse<TmdbListItem>>(
      `/search/${params.mediaType}`,
      { query, page, include_adult: "false" },
      120
    );
  }

  return tmdbFetch<TmdbPagedResponse<TmdbListItem>>(
    `/discover/${params.mediaType}`,
    {
      page,
      sort_by: params.sortBy,
      include_adult: "false",
      include_video: "false",
      "vote_count.gte": 50
    },
    300
  );
}

export async function getTitleDetail(id: string, mediaType: MediaType): Promise<TmdbDetail> {
  return tmdbFetch<TmdbDetail>(`/${mediaType}/${id}`, { append_to_response: "credits" }, 1800);
}

export function getPageSize() {
  return PAGE_SIZE;
}
