import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "./toolbar.js";

function Basic() {
  return (
    <Toolbar aria-label="Formatting">
      <ToolbarButton>Bold</ToolbarButton>
      <ToolbarButton>Italic</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Link</ToolbarButton>
    </Toolbar>
  );
}

describe("Toolbar", () => {
  it("renders a toolbar role", () => {
    render(<Basic />);
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeInTheDocument();
  });

  it("makes exactly one button tabbable initially", () => {
    render(<Basic />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("tabindex", "0");
    expect(buttons[1]).toHaveAttribute("tabindex", "-1");
    expect(buttons[2]).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus to the next button on ArrowRight and updates tabindex", async () => {
    render(<Basic />);
    const buttons = screen.getAllByRole("button");
    buttons[0].focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(buttons[1]).toHaveFocus();
    expect(buttons[1]).toHaveAttribute("tabindex", "0");
    expect(buttons[0]).toHaveAttribute("tabindex", "-1");
  });

  it("focuses the first button on Home", async () => {
    render(<Basic />);
    const buttons = screen.getAllByRole("button");
    buttons[2].focus();
    await userEvent.keyboard("{Home}");
    expect(buttons[0]).toHaveFocus();
  });

  it("focuses the last button on End", async () => {
    render(<Basic />);
    const buttons = screen.getAllByRole("button");
    buttons[0].focus();
    await userEvent.keyboard("{End}");
    expect(buttons[2]).toHaveFocus();
  });

  it("renders a separator with role separator", () => {
    render(<Basic />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("reflects pressed as aria-pressed", () => {
    render(
      <Toolbar aria-label="Toggles">
        <ToolbarButton pressed>On</ToolbarButton>
      </Toolbar>,
    );
    expect(screen.getByRole("button", { name: "On" })).toHaveAttribute("aria-pressed", "true");
  });

  it("renders a group with an accessible name", () => {
    render(
      <Toolbar aria-label="Edit">
        <ToolbarGroup aria-label="History">
          <ToolbarButton>Undo</ToolbarButton>
        </ToolbarGroup>
      </Toolbar>,
    );
    expect(screen.getByRole("group", { name: "History" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Basic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
