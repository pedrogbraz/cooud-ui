import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Combobox, type ComboboxOption } from "./combobox.js";

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

const FRUITS: ComboboxOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

describe("Combobox", () => {
  it("renders a combobox trigger showing the placeholder", () => {
    render(<Combobox options={FRUITS} aria-label="Fruit" placeholder="Pick a fruit" />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Pick a fruit");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the list and selects an option (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={FRUITS} aria-label="Fruit" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(await screen.findByRole("option", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith("banana");
    await waitFor(() => expect(trigger).toHaveTextContent("Banana"));
  });

  it("filters options via the search input", async () => {
    render(<Combobox options={FRUITS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
    const search = await screen.findByPlaceholderText("Search…");
    await userEvent.type(search, "cher");
    expect(await screen.findByRole("option", { name: "Cherry" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument();
  });

  it("selects with the keyboard (ArrowDown + Enter)", async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={FRUITS} aria-label="Fruit" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
    await screen.findByRole("option", { name: "Apple" });
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("reflects a controlled value on the trigger", () => {
    function Controlled() {
      const [value] = useState("cherry");
      return (
        <Combobox options={FRUITS} aria-label="Fruit" value={value} onValueChange={() => {}} />
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Cherry");
  });

  it("does not open while disabled", async () => {
    render(<Combobox options={FRUITS} aria-label="Fruit" disabled />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("carries aria-invalid on the trigger when marked invalid", () => {
    render(<Combobox options={FRUITS} aria-label="Fruit" aria-invalid />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations (closed)", async () => {
    const { container } = render(<Combobox options={FRUITS} aria-label="Fruit" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
