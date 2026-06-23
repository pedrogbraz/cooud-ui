import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.js";

function BasicAlertDialog({ onConfirm = () => {} }: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This permanently deletes your account.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it("renders closed by default", () => {
    render(<BasicAlertDialog />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete account" })).toBeInTheDocument();
  });

  it("opens an alertdialog (modal) when the trigger is activated", async () => {
    const user = userEvent.setup();
    render(<BasicAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const dialog = await screen.findByRole("alertdialog");
    // Radix wires title/description to the surface via aria-labelledby /
    // aria-describedby (it does not emit aria-modal on the node in jsdom); the
    // modal focus trap is covered by the focus-management case below.
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(within(dialog).getByText("Are you absolutely sure?")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("moves focus into the surface on open and restores it to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<BasicAlertDialog />);
    const trigger = screen.getByRole("button", { name: "Delete account" });
    await user.click(trigger);

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes via the Cancel action without firing the confirm handler", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<BasicAlertDialog onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const dialog = await screen.findByRole("alertdialog");

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("runs the confirm handler and closes when the action is activated", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<BasicAlertDialog onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const dialog = await screen.findByRole("alertdialog");

    await user.click(within(dialog).getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes via Escape", async () => {
    const user = userEvent.setup();
    render(<BasicAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
