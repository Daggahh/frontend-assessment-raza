import { buildQueryString, parsePositiveInt } from "@/lib/utils";

describe("utils", () => {
  it("returns fallback for invalid positive integer", () => {
    expect(parsePositiveInt("-3", 1)).toBe(1);
    expect(parsePositiveInt(undefined, 2)).toBe(2);
  });

  it("builds query string without empty values", () => {
    const result = buildQueryString({ q: "laptop", page: 2, empty: "" });
    expect(result).toBe("q=laptop&page=2");
  });
});
