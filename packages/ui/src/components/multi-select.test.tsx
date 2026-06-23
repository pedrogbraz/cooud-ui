import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { MultiSelect, type MultiSelectOption } from "./multi-select.js";

// Radix Popover + cmdk rely on browser APIs jsdom does not implement.
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

const STACK: MultiSelectOption[] = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
];

describe("MultiSelect", () => {
  it("renders a combobox trigger with the placeholder", () => {
    render(<MultiSelect options={STACK} aria-label="Stack" placeholder="Select frameworks" />);
    const trigger = screen.getByRole("combobox", { name: "Stack" });
    expect(trigger).toHaveTextContent("Select frameworks");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("selects multiple options, accumulating the value (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={STACK} aria-label="Stack" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Stack" }));

    await userEvent.click(await screen.findByRole("option", { name: /React/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["react"]);

    await userEvent.click(screen.getByRole("option", { name: /Svelte/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "svelte"]);
  });

  it("deselects an already-selected option", async () => {
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        options={STACK}
        aria-label="Stack"
        defaultValue={["vue"]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Stack" }));
    await userEvent.click(await screen.findByRole("option", { name: /Vue/ }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("renders chips for the controlled selection and clears them", async () => {
    function Controlled() {
      const [value, setValue] = useState<string[]>(["react", "vue"]);
      return (
        <MultiSelect options={STACK} aria-label="Stack" value={value} onValueChange={setValue} />
      );
    }
    render(<Controlled />);
    const trigger = screen.getByRole("combobox", { name: "Stack" });
    expect(within(trigger).getByText("React")).toBeInTheDocument();
    expect(within(trigger).getByText("Vue")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    await waitFor(() => expect(trigger).toHaveTextContent("Select…"));
  });

  it("opens with the keyboard (ArrowDown on the trigger)", async () => {
    render(<MultiSelect options={STACK} aria-label="Stack" />);
    const trigger = screen.getByRole("combobox", { name: "Stack" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(await screen.findByRole("option", { name: /React/ })).toBeInTheDocument();
  });

  it("marks the trigger disabled and ignores keyboard open while disabled", async () => {
    render(<MultiSelect options={STACK} aria-label="Stack" disabled />);
    const trigger = screen.getByRole("combobox", { name: "Stack" });
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    // Removed from the tab order, and its keydown handler is a no-op when
    // disabled. (jsdom applies no CSS, so the `pointer-events-none` that blocks
    // a real click is not observable here — we assert the keyboard guard.)
    expect(trigger).toHaveAttribute("tabindex", "-1");
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("carries aria-invalid on the trigger when marked invalid", () => {
    render(<MultiSelect options={STACK} aria-label="Stack" aria-invalid />);
    expect(screen.getByRole("combobox", { name: "Stack" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations (closed, with selection)", async () => {
    const { container } = render(
      <MultiSelect options={STACK} aria-label="Stack" defaultValue={["react"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
