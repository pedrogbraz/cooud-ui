import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Spinner } from "./spinner.js";

describe("Spinner", () => {
  it("exposes a default 'Loading' status to assistive tech", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("accepts a custom aria-label", () => {
    render(<Spinner aria-label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner size="lg" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
