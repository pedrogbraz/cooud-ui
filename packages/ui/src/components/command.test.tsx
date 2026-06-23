import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command.js";

// cmdk drives selection with ResizeObserver + scrollIntoView, neither of which
// jsdom implements. Stub both at file scope (does NOT touch the shared setup).
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function Palette({ onApple = () => {} }: { onApple?: () => void }) {
  return (
    <Command>
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Fruit">
          <CommandItem onSelect={onApple}>Apple</CommandItem>
          <CommandItem>Banana</CommandItem>
          <CommandItem>Cherry</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  it("renders a combobox input and a listbox of options", () => {
    render(<Palette />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Apple",
      "Banana",
      "Cherry",
    ]);
    // cmdk auto-selects the first item.
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "true");
  });

  it("filters options as the user types in the input", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    await user.type(screen.getByRole("combobox"), "ban");

    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Banana"]);
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    await user.type(screen.getByRole("combobox"), "zzzzz");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("moves the active option with ArrowDown / ArrowUp", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    const input = screen.getByRole("combobox");
    input.focus();

    await user.keyboard("{ArrowDown}"); // Apple -> Banana
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}"); // Banana -> Cherry
    expect(screen.getByRole("option", { name: "Cherry" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowUp}"); // Cherry -> Banana
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-selected", "true");
  });

  it("runs the selected item's onSelect when Enter is pressed", async () => {
    const onApple = vi.fn();
    const user = userEvent.setup();
    render(<Palette onApple={onApple} />);
    const input = screen.getByRole("combobox");
    input.focus();
    // Filter down to Apple, which becomes the active option, then activate it.
    await user.type(input, "app");
    await user.keyboard("{Enter}");
    expect(onApple).toHaveBeenCalledOnce();
  });

  it("runs onSelect when an option is clicked", async () => {
    const onApple = vi.fn();
    const user = userEvent.setup();
    render(<Palette onApple={onApple} />);

    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(onApple).toHaveBeenCalledOnce();
  });

  it("CommandDialog opens in a modal dialog and closes via Escape", async () => {
    function DialogHost() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open palette
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Fruit">
                <CommandItem>Apple</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </>
      );
    }
    const user = userEvent.setup();
    render(<DialogHost />);

    await user.click(screen.getByRole("button", { name: "Open palette" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("combobox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no axe violations (palette open with options)", async () => {
    const { container } = render(<Palette />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
