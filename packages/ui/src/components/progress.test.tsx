import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Progress } from "./progress.js";

describe("Progress", () => {
  it("reports its value through the progressbar role", () => {
    render(<Progress value={40} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders an indeterminate bar when value is omitted", () => {
    render(<Progress aria-label="Loading" />);
    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Progress value={75} aria-label="Progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
