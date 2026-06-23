import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Kbd } from "./kbd.js";

describe("Kbd", () => {
  it("renders its key label inside a <kbd> element", () => {
    render(<Kbd>Esc</Kbd>);
    const kbd = screen.getByText("Esc");
    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toHaveAttribute("data-slot", "kbd");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Kbd>⌘K</Kbd>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
