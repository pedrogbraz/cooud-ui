import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AspectRatio } from "./aspect-ratio.js";

describe("AspectRatio", () => {
  it("renders its children", () => {
    render(
      <AspectRatio>
        <span>Framed</span>
      </AspectRatio>,
    );
    expect(screen.getByText("Framed")).toBeInTheDocument();
  });

  it("applies the requested ratio as a CSS aspect-ratio", () => {
    const { container } = render(<AspectRatio ratio={1}>square</AspectRatio>);
    const el = container.querySelector('[data-slot="aspect-ratio"]') as HTMLElement;
    // jsdom normalizes the shorthand `1` to `1 / 1`.
    expect(el.style.aspectRatio.replace(/\s/g, "")).toBe("1/1");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <span>content</span>
      </AspectRatio>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
