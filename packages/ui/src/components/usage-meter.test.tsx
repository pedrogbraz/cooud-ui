import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UsageMeter } from "./usage-meter.js";

describe("UsageMeter", () => {
  it("renders the value readout and percentage for the linear variant", () => {
    render(<UsageMeter value={8400} max={12000} label="API calls" unit="tokens" />);
    expect(screen.getByText("8,400 / 12,000 tokens")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("API calls")).toBeInTheDocument();
  });

  it("exposes the meter role with aria-value attributes", () => {
    render(<UsageMeter value={50} max={200} label="Storage" />);
    const meter = screen.getByRole("meter", { name: "Storage" });
    expect(meter).toHaveAttribute("aria-valuenow", "50");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "200");
    expect(meter).toHaveAttribute("aria-valuetext", "25%");
  });

  it("renders the circular variant with a centered percentage", () => {
    render(<UsageMeter variant="circular" value={3} max={4} label="Seats" />);
    const meter = screen.getByRole("meter", { name: "Seats" });
    expect(meter).toHaveAttribute("aria-valuenow", "3");
    expect(meter).toHaveAttribute("aria-valuemax", "4");
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("uses a warning tone class for high usage (75–90%) with tone='auto'", () => {
    const { container } = render(<UsageMeter value={85} max={100} label="Quota" />);
    const fill = container.querySelector('[data-slot="usage-meter-fill"]');
    expect(fill).toHaveClass("bg-warning");
    expect(fill).not.toHaveClass("bg-error");
  });

  it("uses an error tone class for critical usage (>90%) with tone='auto'", () => {
    const { container } = render(<UsageMeter value={95} max={100} label="Quota" />);
    const fill = container.querySelector('[data-slot="usage-meter-fill"]');
    expect(fill).toHaveClass("bg-error");
  });

  it("lets an explicit tone override the auto severity", () => {
    const { container } = render(<UsageMeter value={95} max={100} tone="success" label="Quota" />);
    const fill = container.querySelector('[data-slot="usage-meter-fill"]');
    expect(fill).toHaveClass("bg-success");
    expect(fill).not.toHaveClass("bg-error");
  });

  it("clamps the ratio at 100% when value exceeds max", () => {
    const { container } = render(<UsageMeter value={150} max={100} label="Over" />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    const fill = container.querySelector('[data-slot="usage-meter-fill"]') as HTMLElement;
    expect(fill.style.width).toBe("100%");
    // aria-valuenow is clamped into the declared [min, max] range.
    expect(screen.getByRole("meter", { name: "Over" })).toHaveAttribute("aria-valuenow", "100");
  });

  it("renders 0% gracefully when max is 0", () => {
    const { container } = render(<UsageMeter value={10} max={0} label="Empty" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
    const fill = container.querySelector('[data-slot="usage-meter-fill"]') as HTMLElement;
    expect(fill.style.width).toBe("0%");
    const meter = screen.getByRole("meter", { name: "Empty" });
    expect(meter).toHaveAttribute("aria-valuemax", "0");
    expect(meter).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders 0% for non-finite values", () => {
    render(<UsageMeter value={Number.NaN} max={100} label="Bad" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("hides the readout when showValue is false", () => {
    render(<UsageMeter value={50} max={100} label="Hidden" showValue={false} />);
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  it("supports a custom formatValue", () => {
    render(
      <UsageMeter value={2} max={5} label="Projects" formatValue={(v, m) => `${v} of ${m} used`} />,
    );
    expect(screen.getByText("2 of 5 used")).toBeInTheDocument();
  });

  it("has no axe violations (linear)", async () => {
    const { container } = render(
      <UsageMeter value={8400} max={12000} label="API usage" unit="tokens" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (circular)", async () => {
    const { container } = render(<UsageMeter variant="circular" value={3} max={4} label="Seats" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
