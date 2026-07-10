import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

  it("formats the trigger label with the provided date-fns locale", () => {
    const from = new Date(2026, 5, 1);
    const to = new Date(2026, 5, 7);
    render(
      <DateRangePicker
        value={{ from, to }}
        aria-label="Report period"
        locale={ptBR}
        dateFormat="PPP"
      />,
    );
    const expected = `${format(from, "PPP", { locale: ptBR })} – ${format(to, "PPP", { locale: ptBR })}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("supports a formatValue escape hatch for the trigger label", () => {
    render(
      <DateRangePicker
        aria-label="Report period"
        value={{ from: new Date(2026, 5, 1), to: new Date(2026, 5, 7) }}
        formatValue={(range) => `${range.from?.getDate()}–${range.to?.getDate()} de junho`}
      />,
    );
    expect(screen.getByText("1–7 de junho")).toBeInTheDocument();
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

  it("names the popover dialog and the calendar group for assistive tech", async () => {
    render(
      <DateRangePicker aria-label="Report period" placeholder="Pick a range" numberOfMonths={1} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Report period" }));
    // The popover dialog is named via aria-label (axe: aria-dialog-name).
    expect(await screen.findByRole("dialog", { name: "Pick a range" })).toBeInTheDocument();
    // react-day-picker drops an aria-labelledby handed to its root, so the
    // label is wired through a fieldset/legend we control — assert it lands.
    const group = screen.getByRole("group", { name: "Pick a range" });
    expect(group).toHaveAttribute("data-slot", "date-range-picker-calendar");
    expect(within(group).getByRole("grid")).toBeInTheDocument();
  });

  it("renders an accessible open popover (no axe violations)", async () => {
    const { baseElement } = render(
      <DateRangePicker
        aria-label="Report period"
        defaultValue={{ from: JUNE_2026 }}
        numberOfMonths={1}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Report period" }));
    await screen.findByRole("grid");
    // The popover portals to document.body, so axe the whole baseElement.
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
