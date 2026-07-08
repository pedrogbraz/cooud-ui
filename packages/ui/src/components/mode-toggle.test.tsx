import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ModeToggle, type ModeToggleMode } from "./mode-toggle.js";

function Controlled({ initial = "light" as ModeToggleMode }) {
  const [mode, setMode] = useState<ModeToggleMode>(initial);
  return <ModeToggle mode={mode} onModeChange={setMode} />;
}

describe("ModeToggle", () => {
  it("renders a real button with the mode-aware accessible name", () => {
    render(<ModeToggle mode="light" onModeChange={() => {}} />);
    const button = screen.getByRole("button", { name: "Switch to dark mode" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-mode", "light");
  });

  it("requests the opposite mode on click", async () => {
    const onModeChange = vi.fn();
    const { rerender } = render(<ModeToggle mode="light" onModeChange={onModeChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(onModeChange).toHaveBeenLastCalledWith("dark");

    rerender(<ModeToggle mode="dark" onModeChange={onModeChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(onModeChange).toHaveBeenLastCalledWith("light");
  });

  it("flips the label and the data-mode hook when the controlled mode changes", async () => {
    render(<Controlled />);
    const button = screen.getByRole("button", { name: "Switch to dark mode" });
    await userEvent.click(button);
    expect(button).toHaveAccessibleName("Switch to light mode");
    expect(button).toHaveAttribute("data-mode", "dark");
  });

  it("is keyboard operable", async () => {
    const onModeChange = vi.fn();
    render(<ModeToggle mode="light" onModeChange={onModeChange} />);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onModeChange).toHaveBeenCalledWith("dark");
  });

  it("lets a consumer onClick cancel the mode change via preventDefault", async () => {
    const onModeChange = vi.fn();
    render(
      <ModeToggle
        mode="light"
        onModeChange={onModeChange}
        onClick={(event) => event.preventDefault()}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onModeChange).not.toHaveBeenCalled();
  });

  it("respects a custom aria-label", () => {
    render(<ModeToggle mode="dark" onModeChange={() => {}} aria-label="Tema" />);
    expect(screen.getByRole("button", { name: "Tema" })).toBeInTheDocument();
  });

  it("hides the morphing artwork from assistive tech", () => {
    const { container } = render(<ModeToggle mode="light" onModeChange={() => {}} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    // The crescent mask is scoped by useId so multiple toggles can coexist.
    const mask = container.querySelector("mask");
    expect(mask?.id).toBeTruthy();
    expect(container.querySelector("[data-slot=mode-toggle-core]")).toHaveAttribute(
      "mask",
      `url(#${mask?.id})`,
    );
  });

  it("scales the footprint with the size prop", () => {
    const { rerender } = render(<ModeToggle mode="light" onModeChange={() => {}} size="sm" />);
    expect(screen.getByRole("button").className).toContain("size-8");
    rerender(<ModeToggle mode="light" onModeChange={() => {}} size="md" />);
    expect(screen.getByRole("button").className).toContain("size-9");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <ModeToggle mode="light" onModeChange={() => {}} />
        <ModeToggle mode="dark" onModeChange={() => {}} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
