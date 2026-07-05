import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TiltCard } from "./tilt-card.js";

describe("TiltCard", () => {
  it("renders its children", () => {
    render(
      <TiltCard>
        <p>Hover me</p>
      </TiltCard>,
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("engages the tilt state on pointer enter and resets it on leave", async () => {
    const { container } = render(<TiltCard scale={1.05}>content</TiltCard>);
    const card = container.querySelector('[data-slot="tilt-card"]') as HTMLElement;

    await userEvent.hover(card);
    expect(card).toHaveAttribute("data-tilting", "true");
    expect(card.style.getPropertyValue("--tilt-scale")).toBe("1.05");

    await userEvent.unhover(card);
    expect(card).not.toHaveAttribute("data-tilting");
    expect(card.style.getPropertyValue("--tilt-scale")).toBe("1");
    expect(card.style.getPropertyValue("--tilt-rx")).toBe("0deg");
    expect(card.style.getPropertyValue("--tilt-ry")).toBe("0deg");
  });

  it("renders the decorative glare layer only when enabled", () => {
    const { container, rerender } = render(<TiltCard>content</TiltCard>);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    rerender(<TiltCard glare>content</TiltCard>);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TiltCard glare parallax>
        <p>content</p>
      </TiltCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
