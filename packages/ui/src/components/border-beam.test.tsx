import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { BorderBeam } from "./border-beam.js";

describe("BorderBeam", () => {
  it("renders its children above the beam", () => {
    render(
      <BorderBeam>
        <span>Pro plan</span>
      </BorderBeam>,
    );
    expect(screen.getByText("Pro plan")).toBeInTheDocument();
  });

  it("maps its props onto the driving CSS custom properties", () => {
    const { container } = render(
      <BorderBeam size={80} duration={5} delay={2} borderWidth={3} colorFrom="red" colorTo="blue">
        content
      </BorderBeam>,
    );
    const root = container.querySelector('[data-slot="border-beam"]') as HTMLElement;
    expect(root.style.getPropertyValue("--beam-size")).toBe("80px");
    expect(root.style.getPropertyValue("--beam-duration")).toBe("5s");
    // A positive `delay` becomes a negative animation-delay (phase offset, no pause).
    expect(root.style.getPropertyValue("--beam-delay")).toBe("-2s");
    expect(root.style.getPropertyValue("--beam-border-width")).toBe("3px");
    expect(root.style.getPropertyValue("--beam-color-from")).toBe("red");
    expect(root.style.getPropertyValue("--beam-color-to")).toBe("blue");
  });

  it("hides the decorative beam layer from assistive tech", () => {
    const { container } = render(<BorderBeam>content</BorderBeam>);
    const root = container.querySelector('[data-slot="border-beam"]') as HTMLElement;
    expect(root.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <BorderBeam className="border border-border bg-surface-raised p-6">
        <p>content</p>
      </BorderBeam>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
