import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

describe("ToggleGroup", () => {
  it("renders single-select items with the radio role", () => {
    render(
      <ToggleGroup type="single" aria-label="Text alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("marks the selected item as pressed in a multiple group", () => {
    render(
      <ToggleGroup type="multiple" value={["bold"]} aria-label="Format">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "false");
  });

  it("emits the new value through onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onValueChange} aria-label="Align">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Right" }));
    expect(onValueChange).toHaveBeenCalledWith("right");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
