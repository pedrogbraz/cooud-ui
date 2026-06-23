import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Shimmer } from "./shimmer.js";

describe("Shimmer", () => {
  it("renders as a decorative, aria-hidden wrapper around its children", () => {
    render(
      <Shimmer>
        <span>loading</span>
      </Shimmer>,
    );
    const el = screen.getByText("loading").closest('[data-slot="shimmer"]');
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Shimmer className="h-4 w-24" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
