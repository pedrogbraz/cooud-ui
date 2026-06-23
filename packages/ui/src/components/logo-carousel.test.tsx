import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LogoCarousel, type LogoCarouselItem } from "./logo-carousel.js";

const items: LogoCarouselItem[] = [
  { id: "acme", label: "Acme" },
  { id: "globex", label: "Globex" },
  { id: "initech", label: "Initech" },
];

describe("LogoCarousel", () => {
  it("renders a labelled list of the visible logos", () => {
    render(<LogoCarousel items={items} columns={3} ariaLabel="Trusted by" />);
    const list = screen.getByRole("list", { name: "Trusted by" });
    expect(list).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "Acme" })).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "Initech" })).toBeInTheDocument();
  });

  it("renders nothing in the list when there are no items", () => {
    render(<LogoCarousel items={[]} ariaLabel="Empty" />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("has no axe violations", async () => {
    const { container } = render(<LogoCarousel items={items} ariaLabel="Logos" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
