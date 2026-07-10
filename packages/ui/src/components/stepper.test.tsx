import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./stepper.js";

const STEPS = ["Account", "Shipping", "Payment"];

function Basic({
  value = 1,
  onValueChange,
  orientation = "horizontal" as "horizontal" | "vertical",
  withTrigger = false,
}: {
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  withTrigger?: boolean;
}) {
  return (
    <Stepper value={value} onValueChange={onValueChange} orientation={orientation}>
      <StepperList>
        {STEPS.map((label, index) => {
          const inner = (
            <>
              <StepperIndicator />
              <span>
                <StepperTitle>{label}</StepperTitle>
                <StepperDescription>Step {index + 1}</StepperDescription>
              </span>
            </>
          );
          return (
            <StepperItem key={label} step={index}>
              {withTrigger ? <StepperTrigger>{inner}</StepperTrigger> : inner}
              {index < STEPS.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          );
        })}
      </StepperList>
    </Stepper>
  );
}

/** Uncontrolled fixture: no `value` — the stepper owns its own active index. */
function Uncontrolled({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}) {
  return (
    <Stepper defaultValue={defaultValue} onValueChange={onValueChange}>
      <StepperList>
        {STEPS.map((label, index) => (
          <StepperItem key={label} step={index}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{label}</StepperTitle>
            </StepperTrigger>
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  );
}

describe("Stepper", () => {
  it("renders an ordered list with one item per step", () => {
    render(<Basic />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the active step with aria-current=step", () => {
    render(<Basic value={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[2]).not.toHaveAttribute("aria-current");
  });

  it("derives completed / active / upcoming state from the active value", () => {
    render(<Basic value={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-state", "completed");
    expect(items[1]).toHaveAttribute("data-state", "active");
    expect(items[2]).toHaveAttribute("data-state", "upcoming");
  });

  it("renders the step number for non-completed steps", () => {
    render(<Basic value={0} />);
    // First step active → shows "1"; later steps upcoming → "2", "3".
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("fills the separator after a completed step", () => {
    const { container } = render(<Basic value={1} />);
    const separators = container.querySelectorAll('[data-slot="stepper-separator"]');
    // Separator owned by step 0 (completed) is filled; the one on step 1 (active) is not.
    expect(separators[0]).toHaveAttribute("data-state", "completed");
    expect(separators[1]).toHaveAttribute("data-state", "incomplete");
  });

  it("activates a step through its trigger and reports it via onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Basic value={1} onValueChange={onValueChange} withTrigger />);
    await userEvent.click(screen.getByRole("button", { name: /Payment/ }));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("does not fire onValueChange when the already-active step is clicked", async () => {
    const onValueChange = vi.fn();
    render(<Basic value={1} onValueChange={onValueChange} withTrigger />);
    await userEvent.click(screen.getByRole("button", { name: /Shipping/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reflects the orientation on the root", () => {
    const { container } = render(<Basic orientation="vertical" />);
    expect(container.querySelector('[data-slot="stepper"]')).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Basic withTrigger />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Stepper — screen-reader state", () => {
  it("appends an sr-only state suffix to every step", () => {
    render(<Basic value={1} />);
    const items = screen.getAllByRole("listitem");
    expect(within(items[0] as HTMLElement).getByText("completed")).toHaveClass("sr-only");
    expect(within(items[1] as HTMLElement).getByText("current")).toHaveClass("sr-only");
    expect(within(items[2] as HTMLElement).getByText("not started")).toHaveClass("sr-only");
  });

  it("localizes the state suffixes via the labels prop", () => {
    render(
      <Stepper
        value={1}
        labels={{ completed: "concluída", current: "atual", upcoming: "não iniciada" }}
      >
        <StepperList>
          {STEPS.map((label, index) => (
            <StepperItem key={label} step={index}>
              <StepperTitle>{label}</StepperTitle>
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>,
    );
    const items = screen.getAllByRole("listitem");
    expect(within(items[0] as HTMLElement).getByText("concluída")).toBeInTheDocument();
    expect(within(items[1] as HTMLElement).getByText("atual")).toBeInTheDocument();
    expect(within(items[2] as HTMLElement).getByText("não iniciada")).toBeInTheDocument();
  });

  it("keeps aria-current=step alongside the sr-only suffix", () => {
    render(<Basic value={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(within(items[1] as HTMLElement).getByText("current")).toBeInTheDocument();
  });
});

describe("Stepper — uncontrolled", () => {
  it("starts at defaultValue and derives states from it", () => {
    render(<Uncontrolled defaultValue={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-state", "completed");
    expect(items[1]).toHaveAttribute("data-state", "active");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[2]).toHaveAttribute("data-state", "upcoming");
  });

  it("defaults to the first step when defaultValue is omitted", () => {
    render(<Uncontrolled />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-state", "active");
    expect(items[0]).toHaveAttribute("aria-current", "step");
  });

  it("advances on trigger click and reports the new value", async () => {
    const onValueChange = vi.fn();
    render(<Uncontrolled defaultValue={0} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Payment/ }));
    const items = screen.getAllByRole("listitem");
    expect(items[2]).toHaveAttribute("data-state", "active");
    expect(items[2]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveAttribute("data-state", "completed");
    expect(items[1]).toHaveAttribute("data-state", "completed");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("can move backwards through a trigger", async () => {
    const onValueChange = vi.fn();
    render(<Uncontrolled defaultValue={2} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Account/ }));
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("data-state", "active");
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it("clicking the already-active step keeps state and stays silent", async () => {
    const onValueChange = vi.fn();
    render(<Uncontrolled defaultValue={1} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Shipping/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("data-state", "active");
  });
});
