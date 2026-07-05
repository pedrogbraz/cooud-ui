import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./button.js";
import { ConfirmationDialog } from "./confirmation-dialog.js";

describe("ConfirmationDialog", () => {
  it("opens from its trigger and renders the title and description", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationDialog
        trigger={<Button>Delete</Button>}
        title="Delete project"
        description="This action cannot be undone."
      />,
    );

    expect(screen.queryByText("Delete project")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Delete project")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("shows a busy confirm button and closes once an async onConfirm resolves", async () => {
    const user = userEvent.setup();
    let resolveConfirm: (() => void) | undefined;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = resolve;
        }),
    );

    render(
      <ConfirmationDialog
        defaultOpen
        destructive
        title="Delete project"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );

    const confirm = screen.getByRole("button", { name: "Delete" });
    await user.click(confirm);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirm).toBeDisabled();
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument();

    resolveConfirm?.();
    await waitForElementToBeRemoved(() => screen.queryByText("Delete project"));
  });

  it("stays open and surfaces the error when onConfirm rejects", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn(() => Promise.reject(new Error("Network unreachable")));

    render(
      <ConfirmationDialog
        defaultOpen
        destructive
        title="Delete project"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Network unreachable");
    expect(screen.getByText("Delete project")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    render(
      <ConfirmationDialog
        defaultOpen
        title="Delete project"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
      />,
    );

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
