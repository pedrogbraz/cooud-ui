import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SpotlightCard } from "./spotlight-card.js";

describe("SpotlightCard", () => {
  it("renders its children", () => {
    render(
      <SpotlightCard>
        <p>Hover me</p>
      </SpotlightCard>,
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("toggles the hovered data attribute on pointer enter/leave", async () => {
    const { container } = render(<SpotlightCard>content</SpotlightCard>);
    const card = container.querySelector('[data-slot="spotlight-card"]') as HTMLElement;
    await userEvent.hover(card);
    expect(card).toHaveAttribute("data-spotlight-hovered", "true");
    await userEvent.unhover(card);
    expect(card).not.toHaveAttribute("data-spotlight-hovered");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SpotlightCard>
        <p>content</p>
      </SpotlightCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
