import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Slider } from "./slider.js";

// Radix Slider measures its track with ResizeObserver, which jsdom lacks.
beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

describe("Slider", () => {
  it("renders a slider thumb with an accessible name and value", () => {
    render(<Slider aria-label="Volume" defaultValue={[40]} min={0} max={100} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "40");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("increments the value with the arrow keys", async () => {
    render(<Slider aria-label="Brightness" defaultValue={[50]} min={0} max={100} step={1} />);
    const slider = screen.getByRole("slider", { name: "Brightness" });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "51");
  });

  it("clamps to the maximum with the End key", async () => {
    render(<Slider aria-label="Level" defaultValue={[10]} min={0} max={100} />);
    const slider = screen.getByRole("slider", { name: "Level" });
    slider.focus();
    await userEvent.keyboard("{End}");
    expect(slider).toHaveAttribute("aria-valuenow", "100");
  });

  it("renders one named thumb per value for range sliders", () => {
    render(<Slider aria-label="Price" defaultValue={[20, 80]} min={0} max={100} />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(screen.getByRole("slider", { name: "Price (1)" })).toHaveAttribute(
      "aria-valuenow",
      "20",
    );
    expect(screen.getByRole("slider", { name: "Price (2)" })).toHaveAttribute(
      "aria-valuenow",
      "80",
    );
  });

  it("forwards aria-label onto the slider thumb", () => {
    render(<Slider aria-label="Volume" defaultValue={[40]} min={0} max={100} />);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute("aria-label", "Volume");
  });

  it("names a single thumb from aria-labelledby", () => {
    render(
      <>
        <span id="brightness-label">Brightness</span>
        <Slider aria-labelledby="brightness-label" defaultValue={[40]} min={0} max={100} />
      </>,
    );
    expect(screen.getByRole("slider", { name: "Brightness" })).toBeInTheDocument();
  });

  it("does not change value while disabled", async () => {
    render(<Slider aria-label="Locked" defaultValue={[30]} min={0} max={100} disabled />);
    const slider = screen.getByRole("slider", { name: "Locked" });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "30");
  });

  it("keeps aria-label off the role-less root while naming every thumb", () => {
    const { container } = render(
      <Slider aria-label="Price range" defaultValue={[20, 80]} min={0} max={100} />,
    );
    const root = container.querySelector('[data-slot="slider"]');
    expect(root).not.toHaveAttribute("aria-label");
    expect(root).not.toHaveAttribute("aria-labelledby");
    expect(screen.getByRole("slider", { name: "Price range (1)" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Price range (2)" })).toBeInTheDocument();
  });

  it("keeps aria-labelledby off the role-less root while naming the thumb", () => {
    const { container } = render(
      <>
        <span id="price-label">Price</span>
        <Slider aria-labelledby="price-label" defaultValue={[40]} min={0} max={100} />
      </>,
    );
    const root = container.querySelector('[data-slot="slider"]');
    expect(root).not.toHaveAttribute("aria-labelledby");
    expect(screen.getByRole("slider", { name: "Price" })).toHaveAttribute(
      "aria-labelledby",
      "price-label",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Slider aria-label="Opacity" defaultValue={[50]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations under the a11y gate's WCAG tag set (labeled range slider)", async () => {
    const { container } = render(
      <Slider aria-label="Price range" defaultValue={[20, 80]} min={0} max={100} />,
    );
    expect(
      await axe(container, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      }),
    ).toHaveNoViolations();
  });
});
