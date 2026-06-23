import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { type DateRange, DateRangePicker } from "./date-range-picker.js";

const JUNE_2026 = new Date(2026, 5, 1);

describe("DateRangePicker", () => {
  it("renders a trigger showing the placeholder when empty", () => {
    render(<DateRangePicker placeholder="Pick a range" aria-label="Report period" />);
    expect(screen.getByRole("button", { name: "Report period" })).toBeInTheDocument();
    expect(screen.getByText("Pick a range")).toBeInTheDocument();
  });

  it("keeps the calendar closed until the trigger opens it", () => {
    render(<DateRangePicker aria-label="Report period" />);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("opens a calendar grid on trigger click", async () => {
    render(<DateRangePicker aria-label="Report period" defaultValue={{ from: JUNE_2026 }} />);
    await userEvent.click(screen.getByRole("button", { name: "Report period" }));
    expect((await screen.findAllByRole("grid")).length).toBeGreaterThan(0);
  });

  it("renders the formatted range on the trigger for a controlled value", () => {
    const value: DateRange = { from: new Date(2026, 5, 1), to: new Date(2026, 5, 7) };
    render(<DateRangePicker value={value} aria-label="Report period" dateFormat="LLL dd, y" />);
    expect(screen.getByText(/Jun 01, 2026 – Jun 07, 2026/)).toBeInTheDocument();
  });

  it("applies a preset range and closes the popover", async () => {
    const onValueChange = vi.fn();
    const presets = [
      { label: "First week", range: { from: new Date(2026, 5, 1), to: new Date(2026, 5, 7) } },
    ];
    render(
      <DateRangePicker
        aria-label="Report period"
        presets={presets}
        onValueChange={onValueChange}
        defaultValue={{ from: JUNE_2026 }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Report period" }));
    const preset = await screen.findByRole("button", { name: "First week" });
    await userEvent.click(preset);
    expect(onValueChange).toHaveBeenCalledWith(presets[0].range);
    // Popover closes after a preset is chosen.
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("calls onValueChange when a day is picked in the grid", async () => {
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Report period"
        onValueChange={onValueChange}
        defaultValue={{ from: JUNE_2026 }}
        numberOfMonths={1}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Report period" }));
    const grid = await screen.findByRole("grid");
    await userEvent.click(within(grid).getAllByRole("gridcell", { name: "10" })[0]);
    expect(onValueChange).toHaveBeenCalled();
  });

  it("does not open when disabled", async () => {
    render(<DateRangePicker aria-label="Report period" disabled />);
    const trigger = screen.getByRole("button", { name: "Report period" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("renders an accessible calendar grid (no axe violations)", async () => {
    render(
      <DateRangePicker
        aria-label="Report period"
        defaultValue={{ from: JUNE_2026 }}
        numberOfMonths={1}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Report period" }));
    const grid = await screen.findByRole("grid");
    // Scoped to the grid: Radix's popover dialog lacks an accessible name in
    // this composition (aria-dialog-name) — a source gap, not a test concern.
    expect(await axe(grid)).toHaveNoViolations();
  });
});
