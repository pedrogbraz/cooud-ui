import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer.js";

// vaul (the Drawer engine) is heavily pointer/animation driven. jsdom implements
// neither window.matchMedia nor PointerCapture, so stub both at the file scope
// (this does NOT touch the shared jsdom setup). Even with these stubs, vaul does
// not actually unmount the surface on close in jsdom because it waits for CSS
// transition/animation-end events that jsdom never fires — see notes on the
// close cases below for what is asserted instead.
beforeAll(() => {
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    Element.prototype.hasPointerCapture = () => false;
  }
});

function BasicDrawer({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Drawer onOpenChange={onOpenChange}>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <p>Drawer body</p>
        <DrawerFooter>
          <DrawerClose>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("renders closed by default", () => {
    render(<BasicDrawer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open drawer" })).toBeInTheDocument();
  });

  it("opens a dialog surface when the trigger is activated", async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Move goal")).toBeInTheDocument();
    expect(within(dialog).getByText("Set your daily activity goal.")).toBeInTheDocument();
  });

  it("exposes the title/description as the surface's accessible name & description", async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
  });

  it("requests close (onOpenChange=false) when Escape is pressed", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicDrawer onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog");
    onOpenChange.mockClear();

    await user.keyboard("{Escape}");
    // jsdom NOTE: this is the close path we *can* assert. vaul fires
    // onOpenChange(false) on Escape, but it owns its own exit animation and only
    // removes the surface after a CSS transition/animation-end event — which
    // jsdom never dispatches. So the surface stays in the DOM even when driven
    // closed (controlled open={false}). We therefore assert the close intent
    // (onOpenChange) rather than the DOM removal, which is not observable here.
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("requests close (onOpenChange=false) when the Close button is activated", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicDrawer onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    const dialog = await screen.findByRole("dialog");
    onOpenChange.mockClear();

    await user.click(within(dialog).getByRole("button", { name: "Done" }));
    // Same jsdom caveat as Escape: assert the close intent, not DOM removal.
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicDrawer />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog");
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
