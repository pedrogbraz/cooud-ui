import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Toggle } from "./toggle.js";

describe("Toggle", () => {
  it("reflects the pressed state via aria-pressed", () => {
    render(<Toggle pressed>Bold</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("is unpressed by default", () => {
    render(<Toggle>Italic</Toggle>);
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onPressedChange when activated", async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Underline</Toggle>);
    await userEvent.click(screen.getByRole("button", { name: "Underline" }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Toggle aria-label="Toggle bold">B</Toggle>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
