import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { FlipCard, FlipCardBack, FlipCardFront } from "./flip-card.js";

describe("FlipCard", () => {
  it("keeps both faces in the DOM", () => {
    render(
      <FlipCard aria-label="Plan">
        <FlipCardFront>Front</FlipCardFront>
        <FlipCardBack>Back</FlipCardBack>
      </FlipCard>,
    );
    expect(screen.getByText("Front")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("toggles on click when trigger is click", async () => {
    render(
      <FlipCard trigger="click" aria-label="Flip the card">
        <FlipCardFront>Front</FlipCardFront>
        <FlipCardBack>Back</FlipCardBack>
      </FlipCard>,
    );
    const card = screen.getByRole("button", { name: "Flip the card" });
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(card).not.toHaveAttribute("data-flipped");

    await userEvent.click(card);
    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveAttribute("data-flipped");

    await userEvent.click(card);
    expect(card).toHaveAttribute("aria-pressed", "false");
  });

  it("marks the hidden face inert and swaps it when flipped", () => {
    const { container, rerender } = render(
      <FlipCard trigger="controlled" flipped={false} aria-label="Plan">
        <FlipCardFront>Front</FlipCardFront>
        <FlipCardBack>Back</FlipCardBack>
      </FlipCard>,
    );
    const back = container.querySelector('[data-slot="flip-card-back"]') as HTMLElement;
    const front = container.querySelector('[data-slot="flip-card-front"]') as HTMLElement;
    expect(back).toHaveAttribute("inert");
    expect(front).not.toHaveAttribute("inert");

    rerender(
      <FlipCard trigger="controlled" flipped aria-label="Plan">
        <FlipCardFront>Front</FlipCardFront>
        <FlipCardBack>Back</FlipCardBack>
      </FlipCard>,
    );
    expect(front).toHaveAttribute("inert");
    expect(back).not.toHaveAttribute("inert");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FlipCard trigger="click" aria-label="Flip the card">
        <FlipCardFront>
          <p>Front content</p>
        </FlipCardFront>
        <FlipCardBack>
          <p>Back content</p>
        </FlipCardBack>
      </FlipCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
