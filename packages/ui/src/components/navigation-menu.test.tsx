import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu.js";

// Radix's NavigationMenu viewport observes its content with ResizeObserver,
// which jsdom does not implement. A no-op stub lets the open-state render so we
// can still assert the disclosure + links; sizing/animation are untested (jsdom
// has no layout). Scoped to this file, no global config touched.
beforeAll(() => {
  if (!("ResizeObserver" in globalThis)) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/checkout">Checkout</NavigationMenuLink>
            <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("renders top-level items including a direct link", () => {
    render(<Menu />);
    expect(screen.getByRole("button", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
  });

  it("keeps the disclosure trigger collapsed initially", () => {
    render(<Menu />);
    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link", { name: "Checkout" })).not.toBeInTheDocument();
  });

  it("opens the panel and reveals its links when the trigger is clicked", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Products" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    expect(await screen.findByRole("link", { name: "Checkout" })).toHaveAttribute(
      "href",
      "/checkout",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("has no axe violations when closed", async () => {
    const { container } = render(<Menu />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when the panel is open", async () => {
    const { container } = render(<Menu />);
    await userEvent.click(screen.getByRole("button", { name: "Products" }));
    await screen.findByRole("link", { name: "Checkout" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
