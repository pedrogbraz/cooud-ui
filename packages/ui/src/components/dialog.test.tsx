import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";

function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <p>Body content</p>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("renders closed by default — no dialog in the document", () => {
    render(<BasicDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open dialog" })).toBeInTheDocument();
  });

  it("opens the modal dialog when the trigger is activated", async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // Radix wires the title/description to the surface for AT (it labels via
    // aria-labelledby/aria-describedby rather than emitting aria-modal in jsdom).
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(within(dialog).getByText("Delete project")).toBeInTheDocument();
    expect(within(dialog).getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("moves focus into the surface on open and restores it to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    // Focus should land inside the dialog surface, not on the (now-inert) trigger.
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    await screen.findByRole("button", { name: "Open dialog" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Radix returns focus to the trigger after close.
    expect(document.activeElement).toBe(trigger);
  });

  it("closes via Escape", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via the built-in close (X) button", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");

    // The DialogContent renders an icon-only close button labelled "Close" (sr-only).
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports controlled open / onOpenChange", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <DialogTrigger>Controlled trigger</DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled</DialogTitle>
            <DialogDescription>Driven by external state.</DialogDescription>
          </DialogContent>
        </Dialog>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(screen.getByRole("button", { name: "Controlled trigger" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");
    // Overlay portals to document.body, so axe the whole baseElement.
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
