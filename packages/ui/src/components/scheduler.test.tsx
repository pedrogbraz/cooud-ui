import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Scheduler, type SchedulerEvent } from "./scheduler.js";

// Fixed dates keep the grid deterministic regardless of the wall clock.
const JUNE_2026 = new Date(2026, 5, 1);
const TODAY = new Date(2026, 5, 15);

const EVENTS: SchedulerEvent[] = [
  { id: "a", title: "Launch call", date: new Date(2026, 5, 15), color: "primary" },
  { id: "b", title: "Payout run", date: new Date(2026, 5, 15), color: "success" },
  { id: "c", title: "Webinar", date: new Date(2026, 5, 20), color: "info" },
];

describe("Scheduler", () => {
  it("renders the visible month and year in the header", () => {
    render(<Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} />);
    expect(screen.getByRole("heading", { name: "June 2026" })).toBeInTheDocument();
  });

  it("renders weekday headers and a full padded grid of day cells", () => {
    render(<Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    // June 2026 (Sun-start) spans 5 weeks → 35 day cells.
    expect(screen.getAllByRole("cell")).toHaveLength(35);
  });

  it("labels each day cell with its full date for assistive tech", () => {
    render(<Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} />);
    expect(screen.getByRole("cell", { name: "Monday, June 15, 2026" })).toBeInTheDocument();
  });

  it("renders events on their day", () => {
    render(<Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} />);
    const cell = screen.getByRole("cell", { name: "Monday, June 15, 2026" });
    expect(within(cell).getByText("Launch call")).toBeInTheDocument();
    expect(within(cell).getByText("Payout run")).toBeInTheDocument();
    // A different day does not show June 15's events.
    const other = screen.getByRole("cell", { name: "Saturday, June 20, 2026" });
    expect(within(other).getByText("Webinar")).toBeInTheDocument();
    expect(within(other).queryByText("Launch call")).not.toBeInTheDocument();
  });

  it("collapses overflow beyond three events into a +N more affordance", () => {
    const many: SchedulerEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Event ${i}`,
      date: new Date(2026, 5, 10),
    }));
    render(<Scheduler month={JUNE_2026} events={many} today={TODAY} />);
    const cell = screen.getByRole("cell", { name: "Wednesday, June 10, 2026" });
    expect(within(cell).getByText("Event 0")).toBeInTheDocument();
    expect(within(cell).getByText("Event 2")).toBeInTheDocument();
    expect(within(cell).queryByText("Event 3")).not.toBeInTheDocument();
    expect(within(cell).getByText("+2 more")).toBeInTheDocument();
  });

  it("highlights today via aria-current and leaves other days unmarked", () => {
    render(<Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} />);
    expect(screen.getByRole("cell", { name: "Monday, June 15, 2026" })).toHaveAttribute(
      "aria-current",
      "date",
    );
    expect(screen.getByRole("cell", { name: "Tuesday, June 16, 2026" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("does not highlight any day when `today` is omitted (SSR-safe default)", () => {
    render(<Scheduler month={JUNE_2026} events={EVENTS} />);
    expect(screen.queryByRole("cell", { current: "date" })).not.toBeInTheDocument();
  });

  it("fires onMonthChange with the previous month from Prev", async () => {
    const onMonthChange = vi.fn();
    render(<Scheduler month={JUNE_2026} onMonthChange={onMonthChange} today={TODAY} />);
    await userEvent.click(screen.getByRole("button", { name: /previous month/i }));
    expect(onMonthChange).toHaveBeenCalledTimes(1);
    const [next] = onMonthChange.mock.calls[0] as [Date];
    expect(next.getMonth()).toBe(4); // May
    expect(next.getFullYear()).toBe(2026);
  });

  it("fires onMonthChange with the next month from Next", async () => {
    const onMonthChange = vi.fn();
    render(<Scheduler month={JUNE_2026} onMonthChange={onMonthChange} today={TODAY} />);
    await userEvent.click(screen.getByRole("button", { name: /next month/i }));
    const [next] = onMonthChange.mock.calls[0] as [Date];
    expect(next.getMonth()).toBe(6); // July
    expect(next.getFullYear()).toBe(2026);
  });

  it("advances the visible month when uncontrolled", async () => {
    render(<Scheduler defaultMonth={JUNE_2026} today={TODAY} />);
    await userEvent.click(screen.getByRole("button", { name: /next month/i }));
    expect(screen.getByRole("heading", { name: "July 2026" })).toBeInTheDocument();
  });

  it("fires onEventClick with the event when a chip is activated", async () => {
    const onEventClick = vi.fn();
    render(
      <Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} onEventClick={onEventClick} />,
    );
    await userEvent.click(screen.getByText("Webinar"));
    expect(onEventClick).toHaveBeenCalledTimes(1);
    expect(onEventClick.mock.calls[0]?.[0]).toMatchObject({ id: "c", title: "Webinar" });
  });

  it("fires onDayClick (not onEventClick) when the cell body is activated", async () => {
    const onDayClick = vi.fn();
    const onEventClick = vi.fn();
    render(
      <Scheduler
        month={JUNE_2026}
        events={EVENTS}
        today={TODAY}
        onDayClick={onDayClick}
        onEventClick={onEventClick}
      />,
    );
    await userEvent.click(screen.getByRole("cell", { name: "Saturday, June 20, 2026" }));
    expect(onDayClick).toHaveBeenCalledTimes(1);
    const [date] = onDayClick.mock.calls[0] as [Date];
    expect(date.getDate()).toBe(20);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Scheduler month={JUNE_2026} events={EVENTS} today={TODAY} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
