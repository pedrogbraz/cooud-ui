import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./switch.js";

describe("Switch", () => {
  it("renders a switch with an accessible name", () => {
    render(<Switch aria-label="Dark mode" />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on click and reflects aria-checked (uncontrolled)", async () => {
    render(<Switch aria-label="Wi-Fi" />);
    const toggle = screen.getByRole("switch", { name: "Wi-Fi" });
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("fires onCheckedChange with the next value", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Sync" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch", { name: "Sync" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("honors a controlled checked value", async () => {
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Switch aria-label="Bound" checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    const toggle = screen.getByRole("switch", { name: "Bound" });
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it("does not toggle while disabled", async () => {
    render(<Switch aria-label="Off" disabled />);
    const toggle = screen.getByRole("switch", { name: "Off" });
    expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("carries aria-invalid when marked invalid", () => {
    render(<Switch aria-label="Required" aria-invalid />);
    expect(screen.getByRole("switch", { name: "Required" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Switch aria-label="Notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
