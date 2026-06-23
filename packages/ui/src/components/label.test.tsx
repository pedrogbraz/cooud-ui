import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "./input.js";
import { Label } from "./label.js";

describe("Label", () => {
  it("renders its text content", () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("associates with a control via htmlFor, naming it accessibly", () => {
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeInTheDocument();
  });

  it("focuses its associated control when clicked", async () => {
    render(
      <>
        <Label htmlFor="city">City</Label>
        <Input id="city" />
      </>,
    );
    await userEvent.click(screen.getByText("City"));
    expect(screen.getByRole("textbox", { name: "City" })).toHaveFocus();
  });

  it("has no axe violations when associated with a control", async () => {
    const { container } = render(
      <>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
