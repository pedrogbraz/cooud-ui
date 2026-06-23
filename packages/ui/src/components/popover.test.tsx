import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

function BasicPopover() {
  return (
    <Popover>
      <PopoverTrigger>Open popover</PopoverTrigger>
      {/* PopoverContent has role="dialog"; an accessible name (aria-label) is
          required for it — exercising the labeled pattern a consumer must use. */}
      <PopoverContent aria-label="More options">
        <p>Popover body</p>
        <button type="button">Action</button>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("renders closed by default", () => {
    render(<BasicPopover />);
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Open popover" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the content (role=dialog) when the trigger is activated", async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    const trigger = screen.getByRole("button", { name: "Open popover" });
    await user.click(trigger);

    const content = await screen.findByRole("dialog");
    expect(within(content).getByText("Popover body")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("closes via Escape", async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on outside interaction (non-modal dismiss)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <BasicPopover />
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports controlled open / onOpenChange", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <PopoverTrigger>Controlled trigger</PopoverTrigger>
          <PopoverContent>Controlled body</PopoverContent>
        </Popover>
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
    const { baseElement } = render(<BasicPopover />);
    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByRole("dialog");
    // The content portals to <body> outside any landmark; "region" is a
    // page-structure rule that does not apply to an isolated component mount.
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
