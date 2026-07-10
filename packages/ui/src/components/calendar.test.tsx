import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ptBR } from "date-fns/locale";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Calendar } from "./calendar.js";

// A fixed month keeps the grid deterministic regardless of "today".
const JUNE_2026 = new Date(2026, 5, 15);

describe("Calendar", () => {
  it("renders a month grid", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("shows the current month caption and day buttons", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "15" })).toBeInTheDocument();
  });

  it("calls onSelect with the chosen day", async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={JUNE_2026} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("gridcell", { name: "12" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const [selectedDate] = onSelect.mock.calls[0] as [Date];
    expect(selectedDate.getDate()).toBe(12);
    expect(selectedDate.getMonth()).toBe(5);
  });

  it("marks the selected day with aria-selected", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} selected={new Date(2026, 5, 20)} />);
    expect(screen.getByRole("gridcell", { name: "20" })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates to the next month via the nav button", async () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    await userEvent.click(screen.getByRole("button", { name: /next month/i }));
    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("localizes the month caption via the locale prop", () => {
    // `locale` is a native DayPicker prop forwarded through the spread.
    render(<Calendar mode="single" defaultMonth={JUNE_2026} locale={ptBR} />);
    expect(screen.getByText("junho 2026")).toBeInTheDocument();
  });

  it("positions the nav buttons with logical (RTL-safe) utilities", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    const previous = screen.getByRole("button", { name: /previous month/i });
    const next = screen.getByRole("button", { name: /next month/i });
    // start/end (not left/right) so the buttons flip under dir="rtl".
    expect(previous.className).toContain("start-1");
    expect(next.className).toContain("end-1");
    expect(previous.className).not.toContain("left-1");
    expect(next.className).not.toContain("right-1");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
