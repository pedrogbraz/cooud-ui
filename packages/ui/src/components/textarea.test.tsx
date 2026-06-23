import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Textarea } from "./textarea.js";

describe("Textarea", () => {
  it("renders a multiline textbox with its placeholder", () => {
    render(<Textarea placeholder="Write a bio…" aria-label="Bio" />);
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("placeholder", "Write a bio…");
  });

  it("updates its value as the user types", async () => {
    render(<Textarea aria-label="Notes" />);
    const textarea = screen.getByRole("textbox", { name: "Notes" });
    await userEvent.type(textarea, "line one");
    expect(textarea).toHaveValue("line one");
  });

  it("does not accept typing while disabled", async () => {
    render(<Textarea aria-label="Locked" disabled />);
    const textarea = screen.getByRole("textbox", { name: "Locked" });
    expect(textarea).toBeDisabled();
    await userEvent.type(textarea, "nope");
    expect(textarea).toHaveValue("");
  });

  it("maps the invalid prop to aria-invalid", () => {
    render(<Textarea aria-label="Field" invalid />);
    expect(screen.getByRole("textbox", { name: "Field" })).toHaveAttribute("aria-invalid", "true");
  });

  it("supports a controlled value", () => {
    render(<Textarea aria-label="Controlled" value="fixed" onChange={() => {}} />);
    expect(screen.getByRole("textbox", { name: "Controlled" })).toHaveValue("fixed");
  });

  it("has no axe violations when labelled", async () => {
    const { container } = render(
      <>
        <label htmlFor="bio">Bio</label>
        <Textarea id="bio" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
