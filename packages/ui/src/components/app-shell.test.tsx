import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AppShell } from "./app-shell.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar.js";

/**
 * The generated `app-shell-chrome` block (apps/www/lib/blocks/shell.tsx) composes
 * exactly this shape: <AppShell> with a <Sidebar> nav + a header, forwarding the
 * page {children}. This test proves that composition renders its nav + content and
 * is a11y-clean — the substance the composer wraps every (app)-group page in.
 * AppShell itself never emits <main>; the consuming page owns the one <main>, so
 * the shell forwards children inside a plain <div> (single-main invariant).
 */

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Team", href: "/team" },
];

function ShellUnderTest({ children }: { children: ReactNode }) {
  const sidebar = (
    <Sidebar collapsible="none" aria-label="Primary">
      <SidebarHeader>
        <span className="font-semibold">Acme</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={index === 0}>
                    <a href={item.href}>
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
  const header = (
    <div className="flex w-full items-center gap-3">
      <span className="font-semibold">Acme</span>
    </div>
  );
  return (
    <AppShell sidebar={sidebar} header={header} providerProps={{ enableKeyboardShortcut: false }}>
      <div className="flex flex-1 flex-col">{children}</div>
    </AppShell>
  );
}

describe("app-shell chrome block composition", () => {
  it("renders the sidebar nav links and the forwarded page content", () => {
    render(
      <ShellUnderTest>
        <main>
          <h1>Dashboard</h1>
        </main>
      </ShellUnderTest>,
    );
    // Every sidebar nav link is present and points at its route.
    for (const item of NAV) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
    }
    // The forwarded page content renders inside the shell.
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("keeps exactly one <main> — the shell wraps children in a plain div", () => {
    const { container } = render(
      <ShellUnderTest>
        <main data-testid="page-main">content</main>
      </ShellUnderTest>,
    );
    // The page owns the single main landmark; AppShell renders no <main> of its own.
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(screen.getByTestId("page-main")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ShellUnderTest>
        <main>
          <h1>Dashboard</h1>
          <p>Body</p>
        </main>
      </ShellUnderTest>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
