import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ComparisonSlider } from "./comparison-slider.js";

describe("ComparisonSlider", () => {
  it("renders both the before and after layers", () => {
    render(
      <ComparisonSlider
        aria-label="Edit"
        before={<span>Before content</span>}
        after={<span>After content</span>}
      />,
    );
    expect(screen.getByText("Before content")).toBeInTheDocument();
    expect(screen.getByText("After content")).toBeInTheDocument();
  });

  it("exposes a slider handle with an accessible name and value", () => {
    render(<ComparisonSlider aria-label="Retouch" before={<i />} after={<i />} />);
    const handle = screen.getByRole("slider", { name: "Retouch" });
    expect(handle).toHaveAttribute("aria-valuemin", "0");
    expect(handle).toHaveAttribute("aria-valuemax", "100");
    expect(handle).toHaveAttribute("aria-valuenow", "50");
  });

  it("starts at defaultPosition", () => {
    render(
      <ComparisonSlider aria-label="Compare" defaultPosition={30} before={<i />} after={<i />} />,
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30");
  });

  it("increases aria-valuenow on ArrowRight", () => {
    render(<ComparisonSlider aria-label="Compare" before={<i />} after={<i />} />);
    const handle = screen.getByRole("slider");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(handle).toHaveAttribute("aria-valuenow", "51");
  });

  it("decreases aria-valuenow on ArrowLeft and steps by 10 with shift", () => {
    render(<ComparisonSlider aria-label="Compare" before={<i />} after={<i />} />);
    const handle = screen.getByRole("slider");
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(handle).toHaveAttribute("aria-valuenow", "49");
    fireEvent.keyDown(handle, { key: "ArrowRight", shiftKey: true });
    expect(handle).toHaveAttribute("aria-valuenow", "59");
  });

  it("clamps at 100 and 0 via End/Home", () => {
    render(<ComparisonSlider aria-label="Compare" before={<i />} after={<i />} />);
    const handle = screen.getByRole("slider");
    fireEvent.keyDown(handle, { key: "End" });
    expect(handle).toHaveAttribute("aria-valuenow", "100");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(handle).toHaveAttribute("aria-valuenow", "100");
    fireEvent.keyDown(handle, { key: "Home" });
    expect(handle).toHaveAttribute("aria-valuenow", "0");
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(handle).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports a controlled position", () => {
    const onPositionChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState(20);
      return (
        <ComparisonSlider
          aria-label="Bound"
          before={<i />}
          after={<i />}
          position={value}
          onPositionChange={(next) => {
            onPositionChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);
    const handle = screen.getByRole("slider");
    expect(handle).toHaveAttribute("aria-valuenow", "20");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onPositionChange).toHaveBeenCalledWith(21);
    expect(handle).toHaveAttribute("aria-valuenow", "21");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ComparisonSlider
        aria-label="Before and after"
        before={<span>before</span>}
        after={<span>after</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
