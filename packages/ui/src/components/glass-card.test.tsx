import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GlassCard } from "./glass-card.js";

describe("GlassCard", () => {
  it("renders its children", () => {
    render(
      <GlassCard>
        <p>Frosted content</p>
      </GlassCard>,
    );
    expect(screen.getByText("Frosted content")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GlassCard>
        <p>content</p>
      </GlassCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
