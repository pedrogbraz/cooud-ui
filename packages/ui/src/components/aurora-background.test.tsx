import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AuroraBackground } from "./aurora-background.js";

describe("AuroraBackground", () => {
  it("renders its foreground children", () => {
    render(
      <AuroraBackground>
        <h1>Welcome</h1>
      </AuroraBackground>,
    );
    expect(screen.getByRole("heading", { name: "Welcome" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AuroraBackground>
        <p>content</p>
      </AuroraBackground>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
