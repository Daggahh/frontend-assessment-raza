import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/content/Pagination";
import type { ReactNode } from "react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

describe("Pagination", () => {
  it("disables previous button on first page", () => {
    render(
      <Pagination page={1} total={40} limit={20} searchParams={{ q: "dune", type: "movie", sort: "popularity.desc" }} />
    );

    const previous = screen.getByRole("link", { name: "Previous" });
    expect(previous).toHaveAttribute("aria-disabled", "true");
  });

  it("builds next page link with query params", () => {
    render(
      <Pagination page={1} total={40} limit={20} searchParams={{ q: "dune", type: "movie", sort: "popularity.desc" }} />
    );

    const next = screen.getByRole("link", { name: "Next" });
    expect(next).toHaveAttribute("href", "/?q=dune&type=movie&sort=popularity.desc&page=2");
  });
});
