import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Masonry } from "./masonry.js";

describe("Masonry", () => {
  it("renders all children", () => {
    render(
      <Masonry>
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </Masonry>,
    );
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByText("Card 3")).toBeInTheDocument();
  });

  it("applies a literal columns class for the number form", () => {
    render(
      <Masonry data-testid="grid" columns={4}>
        <div>One</div>
      </Masonry>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveAttribute("data-slot", "masonry");
    expect(grid).toHaveClass("columns-4");
  });

  it("applies breakpoint columns classes for the responsive-object form", () => {
    render(
      <Masonry data-testid="grid" columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
        <div>One</div>
      </Masonry>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("columns-1");
    expect(grid).toHaveClass("sm:columns-2");
    expect(grid).toHaveClass("md:columns-3");
    expect(grid).toHaveClass("lg:columns-4");
    expect(grid).toHaveClass("xl:columns-5");
  });

  it("sets the column gap and the masonry gap variable from the gap prop", () => {
    render(
      <Masonry data-testid="grid" gap="2rem">
        <div>One</div>
      </Masonry>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.style.columnGap).toBe("2rem");
    expect(grid.style.getPropertyValue("--masonry-gap")).toBe("2rem");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Masonry>
        <div>Note 1</div>
        <div>Note 2</div>
      </Masonry>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
