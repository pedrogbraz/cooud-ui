import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DatePicker } from "./date-picker.js";

const JUNE_15 = new Date(2026, 5, 15);

/** react-day-picker v9+ nests the interactive day button inside the gridcell. */
function dayButton(grid: HTMLElement, name: string): HTMLElement {
  const cell = within(grid).getAllByRole("gridcell", { name })[0] as HTMLElement;
  return within(cell).getByRole("button");
}

function ControlledPicker({ onValueChange }: { onValueChange?: (d: Date | undefined) => void }) {
  const [value, setValue] = useState<Date | undefined>(undefined);
  return (
    <DatePicker
      value={value}
      onValueChange={(d) => {
        setValue(d);
        onValueChange?.(d);
      }}
    />
  );
}

describe("DatePicker", () => {
  it("renders a trigger with the placeholder when no date is set", () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByRole("button", { name: "Pick a date" })).toBeInTheDocument();
  });

  it("keeps the calendar closed until the trigger is activated", () => {
    render(<DatePicker />);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("uncontrolled: picking a day shows it on the trigger and closes the popover", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker name="dob" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: /pick a date/i }));
    const grid = await screen.findByRole("grid");
    await user.click(dayButton(grid, "15"));

    // The popover CLOSES on selection.
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();

    // onValueChange got a real Date for the picked day.
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const picked = onValueChange.mock.calls[0]?.[0] as Date;
    expect(picked).toBeInstanceOf(Date);
    expect(picked.getDate()).toBe(15);

    // The trigger label switched from the placeholder to the formatted date...
    expect(screen.getByRole("button", { name: format(picked, "PPP") })).toBeInTheDocument();
    // ...and the hidden form input carries the local ISO date.
    const hidden = document.querySelector<HTMLInputElement>('input[type="hidden"][name="dob"]');
    expect(hidden?.value).toBe(format(picked, "yyyy-MM-dd"));
  });

  it("controlled: renders the value and round-trips through onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ControlledPicker onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: /pick a date/i }));
    const grid = await screen.findByRole("grid");
    await user.click(dayButton(grid, "15"));

    const picked = onValueChange.mock.calls[0]?.[0] as Date;
    expect(screen.getByRole("button", { name: format(picked, "PPP") })).toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("fires the deprecated onChange alias with the same payload as onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(<DatePicker defaultOpen onChange={onChange} onValueChange={onValueChange} />);

    const grid = await screen.findByRole("grid");
    await user.click(dayButton(grid, "15"));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toBe(onValueChange.mock.calls[0]?.[0]);
  });

  it("opens with Enter, closes with Escape, and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    const trigger = screen.getByRole("button", { name: /pick a date/i });

    await user.tab();
    expect(document.activeElement).toBe(trigger);

    await user.keyboard("{Enter}");
    await screen.findByRole("grid");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    // Radix returns focus to the trigger after close.
    expect(document.activeElement).toBe(trigger);
  });

  it("supports controlled open state via open/onOpenChange", async () => {
    const onOpenChange = vi.fn();
    function ControlledOpen() {
      const [open, setOpen] = useState(false);
      return (
        <DatePicker
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }
    const user = userEvent.setup();
    render(<ControlledOpen />);

    await user.click(screen.getByRole("button", { name: /pick a date/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    const grid = await screen.findByRole("grid");

    // Selecting a day requests close through the same controlled channel.
    await user.click(dayButton(grid, "15"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<DatePicker disabled />);
    const trigger = screen.getByRole("button", { name: /pick a date/i });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("passes id/aria-describedby/aria-invalid through to the trigger (FormControl injection)", () => {
    render(<DatePicker id="dob" aria-describedby="dob-error" aria-invalid placeholder="DOB" />);
    const trigger = screen.getByRole("button", { name: "DOB" });
    expect(trigger).toHaveAttribute("id", "dob");
    expect(trigger).toHaveAttribute("aria-describedby", "dob-error");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("marks the trigger invalid via the invalid prop", () => {
    render(<DatePicker invalid />);
    expect(screen.getByRole("button", { name: /pick a date/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards its ref to the trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<DatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("data-slot", "date-picker-trigger");
  });

  it("serializes the value into a hidden input when name is provided", () => {
    const { container } = render(<DatePicker name="dob" defaultValue={JUNE_15} />);
    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"][name="dob"]');
    expect(hidden).not.toBeNull();
    expect(hidden?.value).toBe("2026-06-15");
  });

  it("renders an empty hidden input when no date is selected", () => {
    const { container } = render(<DatePicker name="dob" />);
    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"][name="dob"]');
    expect(hidden?.value).toBe("");
  });

  it("formats the trigger label with the provided date-fns locale", () => {
    render(<DatePicker value={JUNE_15} locale={ptBR} />);
    expect(
      screen.getByRole("button", { name: format(JUNE_15, "PPP", { locale: ptBR }) }),
    ).toBeInTheDocument();
  });

  it("supports a formatValue escape hatch for the trigger label", () => {
    render(<DatePicker value={JUNE_15} formatValue={(d) => `dia ${d.getDate()}`} />);
    expect(screen.getByRole("button", { name: "dia 15" })).toBeInTheDocument();
  });

  it("disables days outside min/max", async () => {
    render(
      <DatePicker
        defaultOpen
        defaultValue={JUNE_15}
        min={new Date(2026, 5, 10)}
        max={new Date(2026, 5, 20)}
      />,
    );
    const grid = await screen.findByRole("grid");
    expect(dayButton(grid, "5")).toBeDisabled();
    expect(dayButton(grid, "25")).toBeDisabled();
    expect(dayButton(grid, "15")).toBeEnabled();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<DatePicker />);
    await user.click(screen.getByRole("button", { name: /pick a date/i }));
    await screen.findByRole("grid");
    // The popover portals to document.body, so axe the whole baseElement.
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
