import { PAGE_SIZE } from "@/lib/constants";

export const parsePositiveInt = (value?: string, fallback = 1): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const getSkipForPage = (page: number): number => (page - 1) * PAGE_SIZE;

export const buildQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
};
