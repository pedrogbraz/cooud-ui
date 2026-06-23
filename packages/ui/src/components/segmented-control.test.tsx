import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SegmentedControl, SegmentedControlItem } from "./segmented-control.js";

function renderControl(props?: Partial<React.ComponentProps<typeof SegmentedControl>>) {
  return render(
    <SegmentedControl aria-label="View" {...props}>
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>,
  );
}

describe("SegmentedControl", () => {
  it("renders a radiogroup with one radio per item", () => {
    renderControl({ defaultValue: "day" });
    expect(screen.getByRole("radiogroup", { name: "View" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("reflects the selected item via aria-checked (uncontrolled defaultValue)", () => {
    renderControl({ defaultValue: "week" });
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("aria-checked", "false");
  });

  it("selects an item on click and updates the uncontrolled selection", async () => {
    const user = userEvent.setup();
    renderControl({ defaultValue: "day" });
    await user.click(screen.getByRole("radio", { name: "Month" }));
    expect(screen.getByRole("radio", { name: "Month" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("aria-checked", "false");
  });

  it("calls onValueChange and stays controlled (value does not change without prop)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderControl({ value: "day", onValueChange });
    await user.click(screen.getByRole("radio", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalledWith("week");
    // Controlled: still shows "day" because the parent did not update the prop.
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("aria-checked", "true");
  });

  it("moves roving focus + selection with ArrowRight / ArrowLeft", async () => {
    const user = userEvent.setup();
    renderControl({ defaultValue: "day" });
    const day = screen.getByRole("radio", { name: "Day" });
    day.focus();
    expect(day).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    const week = screen.getByRole("radio", { name: "Week" });
    expect(week).toHaveFocus();
    expect(week).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{ArrowLeft}");
    expect(day).toHaveFocus();
    expect(day).toHaveAttribute("aria-checked", "true");
  });

  it("keeps exactly one item tabbable (roving tabindex on the active item)", () => {
    renderControl({ defaultValue: "week" });
    const radios = screen.getAllByRole("radio");
    const tabbable = radios.filter((r) => r.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveAccessibleName("Week");
  });

  it("stays keyboard-reachable when the active item is disabled (first enabled item is tabbable)", () => {
    render(
      <SegmentedControl aria-label="View" value="day">
        <SegmentedControlItem value="day" disabled>
          Day
        </SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
      </SegmentedControl>,
    );
    // The active value ("day") is disabled, so it must NOT own the tab stop;
    // the first enabled item ("week") becomes the single tabbable item.
    const day = screen.getByRole("radio", { name: "Day" });
    const week = screen.getByRole("radio", { name: "Week" });
    expect(day).toBeDisabled();
    expect(day).toHaveAttribute("tabindex", "-1");
    expect(week).toHaveAttribute("tabindex", "0");
    const tabbable = screen.getAllByRole("radio").filter((r) => r.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
  });

  it("has no axe violations", async () => {
    const { container } = renderControl({ defaultValue: "day" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
