import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";

// Radix Select relies on Pointer Events APIs jsdom does not implement. Provide
// the no-op shims it needs so the menu can open under a real click/keypress.
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function Fruit(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders a combobox trigger showing the placeholder", () => {
    render(<Fruit />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Pick a fruit");
  });

  it("opens the listbox and selects an option by click", async () => {
    const onValueChange = vi.fn();
    render(<Fruit onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));

    const listbox = await screen.findByRole("listbox");
    await userEvent.click(within(listbox).getByRole("option", { name: "Banana" }));

    expect(onValueChange).toHaveBeenCalledWith("banana");
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Banana"),
    );
  });

  it("opens and selects with the keyboard", async () => {
    const onValueChange = vi.fn();
    render(<Fruit onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("reflects a controlled value", () => {
    function Controlled() {
      const [value] = useState("cherry");
      return <Fruit value={value} onValueChange={() => {}} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Cherry");
  });

  it("does not open while disabled", async () => {
    render(<Fruit disabled />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("carries aria-invalid on the trigger when marked invalid", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Fruit" aria-invalid>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations (closed)", async () => {
    const { container } = render(<Fruit />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
