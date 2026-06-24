import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Rating } from "./rating.js";

/** Fill fractions (0–100) of each star overlay — the clipped `fill-warning` icons. */
function filledStarWidths(container: HTMLElement): number[] {
  return Array.from(container.querySelectorAll('[data-slot="rating-star"]')).map((star) => {
    const overlay = star.lastElementChild as HTMLElement;
    return Number.parseFloat(overlay.style.width) || 0;
  });
}

/** The interactive per-star hit-areas (only present in interactive mode). */
function starItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[data-slot="rating-item"]'));
}

describe("Rating", () => {
  it("renders a slider with an accessible name, bounds, and value", () => {
    render(<Rating aria-label="Quality" defaultValue={3} />);
    const rating = screen.getByRole("slider", { name: "Quality" });
    expect(rating).toBeInTheDocument();
    expect(rating).toHaveAttribute("aria-valuemin", "0");
    expect(rating).toHaveAttribute("aria-valuemax", "5");
    expect(rating).toHaveAttribute("aria-valuenow", "3");
    expect(rating).toHaveAttribute("aria-valuetext", "3 out of 5");
  });

  it("renders `max` stars and fills the count that reflects `value`", () => {
    const { container } = render(<Rating aria-label="Score" max={5} defaultValue={3} />);
    const widths = filledStarWidths(container);
    expect(widths).toHaveLength(5);
    // First three fully filled (100%), last two empty (0%).
    expect(widths).toEqual([100, 100, 100, 0, 0]);
  });

  it("respects a custom `max`", () => {
    const { container } = render(<Rating aria-label="Score" max={10} defaultValue={4} />);
    expect(filledStarWidths(container)).toHaveLength(10);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "10");
  });

  it("fires onValueChange with the clicked star value", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating aria-label="Rate" defaultValue={0} onValueChange={onValueChange} />,
    );
    await userEvent.click(starItems(container)[3]);
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it("updates the displayed value on click (uncontrolled)", async () => {
    const { container } = render(<Rating aria-label="Rate" defaultValue={0} />);
    await userEvent.click(starItems(container)[2]);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "3");
  });

  it("changes the value with the arrow keys", async () => {
    const onValueChange = vi.fn();
    render(<Rating aria-label="Rate" defaultValue={2} onValueChange={onValueChange} />);
    const rating = screen.getByRole("slider");
    rating.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(rating).toHaveAttribute("aria-valuenow", "3");
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(rating).toHaveAttribute("aria-valuenow", "1");
  });

  it("jumps to the bounds with Home and End", async () => {
    render(<Rating aria-label="Rate" defaultValue={2} max={5} />);
    const rating = screen.getByRole("slider");
    rating.focus();
    await userEvent.keyboard("{End}");
    expect(rating).toHaveAttribute("aria-valuenow", "5");
    await userEvent.keyboard("{Home}");
    expect(rating).toHaveAttribute("aria-valuenow", "0");
  });

  it("honors a controlled value", async () => {
    function Controlled() {
      const [value, setValue] = useState(2);
      return <Rating aria-label="Bound" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    const rating = screen.getByRole("slider", { name: "Bound" });
    expect(rating).toHaveAttribute("aria-valuenow", "2");
    rating.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(rating).toHaveAttribute("aria-valuenow", "3");
  });

  it("steps by 0.5 with `allowHalf` and renders a half-filled star", async () => {
    const { container } = render(<Rating aria-label="Half" allowHalf defaultValue={2.5} />);
    // The third star is rendered at 50% fill.
    expect(filledStarWidths(container)).toEqual([100, 100, 50, 0, 0]);

    const rating = screen.getByRole("slider");
    expect(rating).toHaveAttribute("aria-valuenow", "2.5");
    rating.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(rating).toHaveAttribute("aria-valuenow", "3");
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(rating).toHaveAttribute("aria-valuenow", "2");
  });

  it("renders read-only without interaction and does not fire changes", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating aria-label="Average" readOnly defaultValue={4} onValueChange={onValueChange} />,
    );
    const rating = screen.getByRole("slider", { name: "Average" });
    expect(rating).toHaveAttribute("aria-readonly", "true");
    // No interactive star hit-areas exist in read-only mode.
    expect(starItems(container)).toHaveLength(0);
    expect(filledStarWidths(container)).toEqual([100, 100, 100, 100, 0]);

    rating.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(rating).toHaveAttribute("aria-valuenow", "4");
  });

  it("clamps the value within bounds at the edges", async () => {
    render(<Rating aria-label="Edge" defaultValue={5} max={5} />);
    const rating = screen.getByRole("slider");
    rating.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(rating).toHaveAttribute("aria-valuenow", "5");
  });

  it("has no axe violations (interactive)", async () => {
    const { container } = render(<Rating aria-label="Feedback" defaultValue={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (read-only)", async () => {
    const { container } = render(<Rating aria-label="Average rating" readOnly defaultValue={4} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
