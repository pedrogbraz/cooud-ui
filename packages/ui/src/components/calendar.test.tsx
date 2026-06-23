import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("has no axe violations", async () => {
    const { container } = render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
