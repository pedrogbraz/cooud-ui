import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  MorphingPopover,
  MorphingPopoverBody,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverHeader,
  MorphingPopoverTrigger,
} from "./morphing-popover.js";

function Popover(props?: React.ComponentProps<typeof MorphingPopover>) {
  return (
    <MorphingPopover {...props}>
      <MorphingPopoverTrigger>Open menu</MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Menu">
        <MorphingPopoverHeader>
          Title
          <MorphingPopoverClose />
        </MorphingPopoverHeader>
        <MorphingPopoverBody>
          <button type="button">First action</button>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

describe("MorphingPopover", () => {
  it("renders the trigger and keeps the surface closed initially", () => {
    render(<Popover />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a non-modal dialog when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<Popover />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "false");
    expect(dialog).toHaveAccessibleName("Menu");
  });

  it("reflects open state on the trigger via aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Popover />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await user.click(trigger);
    await screen.findByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus into the surface on open (first focusable descendant)", async () => {
    const user = userEvent.setup();
    render(<Popover />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    // rAF-deferred focus grab; wait for it to land on the first focusable child.
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    });
  });

  // NOTE on closing: the content is wrapped in framer's <AnimatePresence>, which
  // keeps the exiting node mounted until its exit animation completes. jsdom has
  // no animation lifecycle, so that completion never fires and the dialog element
  // lingers in the DOM. We therefore assert the open STATE (React-driven), which
  // flips synchronously: the trigger's aria-expanded / data-state return to
  // closed — exactly the bookkeeping the close handlers drive.
  it("closes on Escape (open state returns to closed)", async () => {
    const user = userEvent.setup();
    render(<Popover />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("closes when the Close button is clicked (open state returns to closed)", async () => {
    const user = userEvent.setup();
    render(<Popover />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("accepts the reducedMotion prop and still opens", async () => {
    const user = userEvent.setup();
    render(<Popover reducedMotion="always" />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Popover />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    expect(await axe(container)).toHaveNoViolations();
  });
});
