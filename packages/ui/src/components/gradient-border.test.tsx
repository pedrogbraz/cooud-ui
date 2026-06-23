import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GradientBorder } from "./gradient-border.js";

describe("GradientBorder", () => {
  it("renders its children inside the inner surface", () => {
    render(
      <GradientBorder>
        <span>Wrapped</span>
      </GradientBorder>,
    );
    expect(screen.getByText("Wrapped")).toBeInTheDocument();
  });

  it("renders without crashing when glow is enabled", () => {
    const { container } = render(<GradientBorder glow>content</GradientBorder>);
    expect(container.querySelector('[data-slot="gradient-border"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GradientBorder>
        <span>content</span>
      </GradientBorder>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
