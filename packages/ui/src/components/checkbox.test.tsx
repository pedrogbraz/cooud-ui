import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./checkbox.js";

describe("Checkbox", () => {
  it("renders a checkbox with an accessible name", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
  });

  it("toggles checked state on click (uncontrolled)", async () => {
    render(<Checkbox aria-label="Subscribe" />);
    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("fires onCheckedChange with the next value", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Notify" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Notify" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("honors a controlled checked value", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return <Checkbox aria-label="Bound" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const checkbox = screen.getByRole("checkbox", { name: "Bound" });
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("does not toggle while disabled", async () => {
    render(<Checkbox aria-label="Off" disabled />);
    const checkbox = screen.getByRole("checkbox", { name: "Off" });
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("carries aria-invalid when marked invalid", () => {
    render(<Checkbox aria-label="Required" aria-invalid />);
    expect(screen.getByRole("checkbox", { name: "Required" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Checkbox aria-label="Accept" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
