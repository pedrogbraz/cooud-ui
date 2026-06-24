import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TagsInput } from "./tags-input.js";

describe("TagsInput", () => {
  it("renders a textbox with its placeholder", () => {
    render(<TagsInput aria-label="Tags" placeholder="Add a tag" />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Add a tag");
  });

  it("adds a chip on Enter and fires onValueChange (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<TagsInput aria-label="Tags" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Tags" });

    await userEvent.type(input, "react{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["react"]);
    expect(screen.getByText("react")).toBeInTheDocument();
    // The field clears after a successful commit.
    expect(input).toHaveValue("");

    await userEvent.type(input, "vue{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "vue"]);
  });

  it("trims whitespace and skips empty input", async () => {
    const onValueChange = vi.fn();
    render(<TagsInput aria-label="Tags" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Tags" });

    await userEvent.type(input, "{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.type(input, "  spaced  {Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["spaced"]);
  });

  it("commits on the comma delimiter", async () => {
    const onValueChange = vi.fn();
    render(<TagsInput aria-label="Tags" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Tags" });

    await userEvent.type(input, "alpha,");
    expect(onValueChange).toHaveBeenLastCalledWith(["alpha"]);
    expect(input).toHaveValue("");
  });

  it("removes a tag via its remove button", async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput aria-label="Tags" defaultValue={["react", "vue"]} onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove react" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["vue"]);
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });

  it("removes the last tag on Backspace when the field is empty", async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput aria-label="Tags" defaultValue={["react", "vue"]} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });
    input.focus();
    await userEvent.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["react"]);
  });

  it("does not remove a tag when Backspace is pressed with text present", async () => {
    const onValueChange = vi.fn();
    render(<TagsInput aria-label="Tags" defaultValue={["react"]} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    await userEvent.type(input, "vue{Backspace}");
    // Backspace edited the draft text ("vue" -> "vu"), not the committed tags.
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(input).toHaveValue("vu");
  });

  it("blocks duplicate tags by default", async () => {
    const onValueChange = vi.fn();
    render(<TagsInput aria-label="Tags" defaultValue={["react"]} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    await userEvent.type(input, "react{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    // The rejected text stays in the field rather than being silently cleared.
    expect(input).toHaveValue("react");
  });

  it("allows duplicate tags when allowDuplicates is set", async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput
        aria-label="Tags"
        defaultValue={["react"]}
        allowDuplicates
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });
    await userEvent.type(input, "react{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "react"]);
  });

  it("caps the number of tags at max", async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput
        aria-label="Tags"
        defaultValue={["a", "b"]}
        max={2}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });
    await userEvent.type(input, "c{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText("c")).not.toBeInTheDocument();
  });

  it("rejects tags failing the validate predicate", async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput
        aria-label="Tags"
        validate={(tag) => tag.length >= 3}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });
    await userEvent.type(input, "ab{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.type(input, "c{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["abc"]);
  });

  it("blocks adding and removing while disabled", async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput
        aria-label="Tags"
        defaultValue={["react"]}
        disabled
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "vue{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    // No remove button is rendered while disabled, so the tag cannot be removed.
    expect(screen.queryByRole("button", { name: "Remove react" })).not.toBeInTheDocument();
  });

  it("renders chips from a controlled value", async () => {
    function Controlled() {
      const [value, setValue] = useState<string[]>(["react", "vue"]);
      return <TagsInput aria-label="Tags" value={value} onValueChange={setValue} />;
    }
    const { container } = render(<Controlled />);
    const field = container.querySelector("[data-slot='tags-input']") as HTMLElement;
    expect(within(field).getByText("react")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remove react" }));
    expect(within(field).queryByText("react")).not.toBeInTheDocument();
    expect(within(field).getByText("vue")).toBeInTheDocument();
  });

  it("focuses the input when the field is clicked", async () => {
    const { container } = render(<TagsInput aria-label="Tags" defaultValue={["react"]} />);
    const field = container.querySelector("[data-slot='tags-input']") as HTMLElement;
    await userEvent.click(field);
    expect(screen.getByRole("textbox", { name: "Tags" })).toHaveFocus();
  });

  it("carries aria-invalid on the field and input when marked invalid", () => {
    render(<TagsInput aria-label="Tags" aria-invalid />);
    expect(screen.getByRole("textbox", { name: "Tags" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations when labelled", async () => {
    const { container } = render(
      <>
        <label htmlFor="topics">Topics</label>
        <TagsInput id="topics" defaultValue={["react", "vue"]} />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
