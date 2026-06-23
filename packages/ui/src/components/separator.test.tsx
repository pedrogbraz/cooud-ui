import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Separator } from "./separator.js";

describe("Separator", () => {
  it("is decorative (no separator role) by default", () => {
    const { container } = render(<Separator />);
    expect(screen.queryByRole("separator")).toBeNull();
    const el = container.querySelector('[data-slot="separator"]');
    expect(el).toHaveAttribute("data-orientation", "horizontal");
  });

  it("exposes a separator role when not decorative", () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("reflects the vertical orientation", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-orientation", "vertical");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Separator decorative={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
