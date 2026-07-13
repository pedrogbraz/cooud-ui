import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ScrollArea } from "./scroll-area.js";

describe("ScrollArea", () => {
  it("renders its children inside the viewport", () => {
    render(
      <ScrollArea className="h-32">
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("tags the root with its data-slot", () => {
    const { container } = render(
      <ScrollArea>
        <div>x</div>
      </ScrollArea>,
    );
    expect(container.querySelector('[data-slot="scroll-area"]')).not.toBeNull();
  });

  it("makes the scrollable viewport keyboard-focusable", () => {
    const { container } = render(
      <ScrollArea className="h-32">
        <p>content</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector("[data-radix-scroll-area-viewport]");
    expect(viewport).not.toBeNull();
    expect(viewport).toHaveAttribute("tabindex", "0");
  });

  it("promotes the viewport to a named region when given an aria-label", () => {
    const { container } = render(
      <ScrollArea aria-label="Release notes" className="h-32">
        <p>content</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector("[data-radix-scroll-area-viewport]");
    expect(viewport).toHaveAttribute("aria-label", "Release notes");
    expect(viewport).toHaveAttribute("role", "region");
  });

  it("leaves the viewport unlabeled and role-free without an aria-label", () => {
    const { container } = render(
      <ScrollArea className="h-32">
        <p>content</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector("[data-radix-scroll-area-viewport]");
    expect(viewport).not.toHaveAttribute("role");
    expect(viewport).not.toHaveAttribute("aria-label");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ScrollArea className="h-32">
        <p>content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
