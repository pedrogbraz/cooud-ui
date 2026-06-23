import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

function Plans({
  ...props
}: Omit<React.ComponentProps<typeof RadioGroup>, "children">): React.ReactElement {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <RadioGroupItem value="free" id="r-free" aria-label="Free" />
      <RadioGroupItem value="pro" id="r-pro" aria-label="Pro" />
      <RadioGroupItem value="team" id="r-team" aria-label="Team" />
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("renders a radiogroup with its radio items", () => {
    render(<Plans />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects an option on click (uncontrolled)", async () => {
    render(<Plans />);
    const pro = screen.getByRole("radio", { name: "Pro" });
    await userEvent.click(pro);
    expect(pro).toBeChecked();
  });

  it("fires onValueChange with the selected value", async () => {
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Team" }));
    expect(onValueChange).toHaveBeenCalledWith("team");
  });

  it("checks a focused radio with the Space key", async () => {
    render(<Plans />);
    const pro = screen.getByRole("radio", { name: "Pro" });
    pro.focus();
    await userEvent.keyboard("[Space]");
    expect(pro).toBeChecked();
  });

  it("honors a controlled value", () => {
    function Controlled() {
      const [value] = useState("team");
      return <Plans value={value} onValueChange={() => {}} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("radio", { name: "Team" })).toBeChecked();
  });

  it("carries aria-invalid on an item when marked invalid", () => {
    render(
      <RadioGroup aria-label="Choice">
        <RadioGroupItem value="a" aria-label="A" aria-invalid />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Plans />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
