export type MediaType = "movie" | "tv";
export type SortBy = "popularity.desc" | "vote_average.desc" | "primary_release_date.desc";

export type TmdbListItem = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  original_language: string;
};

export type TmdbPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type TmdbDetail = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  genres: TmdbGenre[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  number_of_seasons?: number;
  release_date?: string;
  first_air_date?: string;
  original_language: string;
  tagline?: string;
  credits?: {
    cast: TmdbCastMember[];
  };
};
