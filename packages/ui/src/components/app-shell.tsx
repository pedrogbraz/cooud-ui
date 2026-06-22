"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { SidebarInset, SidebarProvider, type SidebarProviderProps } from "./sidebar.js";

/* ------------------------------------------------------------------ *
 * AppShell — convenience composition over the Sidebar system.
 *
 * Lays out: <SidebarProvider> { sidebar slot } <content region>.
 * The content region renders an optional sticky topbar (<header>) above the
 * body. It deliberately does NOT render a <main> landmark — the consuming
 * route owns the single <main> so the page keeps exactly one main landmark.
 * ------------------------------------------------------------------ */

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The sidebar element. Pass a `<Sidebar>` (and its trigger/menus). Rendered
   * as the first child of the provider so it sits beside the content region.
   */
  sidebar: ReactNode;
  /**
   * Optional topbar content rendered inside a sticky `<header role="banner">`
   * at the top of the content region. Omit for a header-less shell.
   */
  header?: ReactNode;
  /** Props forwarded to the underlying `SidebarProvider`. */
  providerProps?: Omit<SidebarProviderProps, "children">;
  /**
   * When `true`, wraps the content region in `SidebarInset` for the rounded,
   * inset surface that pairs with `variant="inset" | "floating"` sidebars.
   */
  inset?: boolean;
  /** Extra classes for the content region wrapper. */
  contentClassName?: string;
  /** Extra classes for the sticky header. */
  headerClassName?: string;
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      sidebar,
      header,
      providerProps,
      inset = false,
      className,
      contentClassName,
      headerClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const body = (
      <>
        {header != null && (
          <header
            data-slot="app-shell-header"
            // role="banner" is implicit for a top-level <header>; set explicitly
            // because this header is nested inside layout wrappers.
            className={cn(
              "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface-base/80 px-4 backdrop-blur-sm",
              headerClassName,
            )}
          >
            {header}
          </header>
        )}
        <div
          data-slot="app-shell-body"
          className={cn("flex min-h-0 flex-1 flex-col", contentClassName)}
        >
          {children}
        </div>
      </>
    );

    return (
      <SidebarProvider ref={ref} className={cn(className)} {...props} {...providerProps}>
        {sidebar}
        {inset ? (
          <SidebarInset data-slot="app-shell-content">{body}</SidebarInset>
        ) : (
          <div
            data-slot="app-shell-content"
            className="relative flex min-h-svh min-w-0 flex-1 flex-col bg-surface-base"
          >
            {body}
          </div>
        )}
      </SidebarProvider>
    );
  },
);
AppShell.displayName = "AppShell";
