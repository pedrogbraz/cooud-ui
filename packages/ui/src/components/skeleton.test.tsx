import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton } from "./skeleton.js";

describe("Skeleton", () => {
  it("renders a decorative, aria-hidden placeholder", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
