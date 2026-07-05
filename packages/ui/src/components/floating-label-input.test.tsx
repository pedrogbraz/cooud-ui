import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { FloatingLabelInput } from "./floating-label-input.js";

describe("FloatingLabelInput", () => {
  it("associates the floating label with the input", () => {
    render(<FloatingLabelInput label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards its ref to the underlying input and accepts typed text", async () => {
    const ref = createRef<HTMLInputElement>();
    render(<FloatingLabelInput ref={ref} label="Full name" />);

    const input = screen.getByLabelText("Full name");
    expect(ref.current).toBe(input);

    await userEvent.type(input, "Ada Lovelace");
    expect(ref.current).toHaveValue("Ada Lovelace");
  });

  it("wires helper text via aria-describedby and announces errors when invalid", () => {
    render(<FloatingLabelInput label="Email" invalid helperText="Enter a valid email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const helper = screen.getByRole("alert");
    expect(helper).toHaveTextContent("Enter a valid email");
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(helper.id));
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FloatingLabelInput label="Email" helperText="We'll never share it" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
