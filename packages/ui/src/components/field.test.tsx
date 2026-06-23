import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field.js";
import { Input } from "./input.js";

describe("Field", () => {
  it("renders a labelled control with description", () => {
    render(
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" />
        <FieldDescription>Pick something memorable.</FieldDescription>
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument();
    expect(screen.getByText("Pick something memorable.")).toBeInTheDocument();
  });

  it("focuses the control when the FieldLabel is clicked", async () => {
    render(
      <Field>
        <FieldLabel htmlFor="handle">Handle</FieldLabel>
        <Input id="handle" />
      </Field>,
    );
    await userEvent.click(screen.getByText("Handle"));
    expect(screen.getByRole("textbox", { name: "Handle" })).toHaveFocus();
  });

  it("renders FieldError as an alert when it has content", () => {
    render(<FieldError>Required field.</FieldError>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Required field.");
  });

  it("renders nothing for FieldError without children", () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();
  });

  it("has no axe violations for a complete field", async () => {
    const { container } = render(
      <Field>
        <FieldLabel htmlFor="bio-field">Bio</FieldLabel>
        <Input id="bio-field" aria-describedby="bio-help" />
        <FieldDescription id="bio-help">Tell us about yourself.</FieldDescription>
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
