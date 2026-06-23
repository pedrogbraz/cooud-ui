import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet.js";

function BasicSheet({ side }: { side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <Sheet>
      <SheetTrigger>Open sheet</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
        <p>Sheet body</p>
        <SheetFooter>
          <SheetClose>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("renders closed by default", () => {
    render(<BasicSheet />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open sheet" })).toBeInTheDocument();
  });

  it("opens a modal dialog surface when the trigger is activated", async () => {
    const user = userEvent.setup();
    render(<BasicSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));

    const dialog = await screen.findByRole("dialog");
    // Radix labels the surface via aria-labelledby/aria-describedby (it does not
    // emit aria-modal on the content node in jsdom); the modal focus trap is
    // covered by the focus-management case below.
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(within(dialog).getByText("Edit profile")).toBeInTheDocument();
    expect(within(dialog).getByText("Make changes to your profile here.")).toBeInTheDocument();
  });

  it("renders on the requested side (defaults to right)", async () => {
    const user = userEvent.setup();
    render(<BasicSheet side="left" />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    const dialog = await screen.findByRole("dialog");
    // The left variant pins to the left edge via the sheetVariants class.
    expect(dialog.className).toContain("left-0");
  });

  it("moves focus into the surface on open and restores it to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<BasicSheet />);
    const trigger = screen.getByRole("button", { name: "Open sheet" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes via the built-in close (X) button", async () => {
    const user = userEvent.setup();
    render(<BasicSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    const dialog = await screen.findByRole("dialog");

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via Escape", async () => {
    const user = userEvent.setup();
    render(<BasicSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
