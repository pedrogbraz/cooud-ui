"use client";

import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "../lib/cn.js";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout orientation; also drives which arrow keys move focus. */
  orientation?: "horizontal" | "vertical";
}

function getButtons(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>("[data-slot=toolbar-button]:not([disabled])"),
  );
}

function setTabbable(buttons: HTMLButtonElement[], active: HTMLButtonElement) {
  for (const button of buttons) {
    button.tabIndex = button === active ? 0 : -1;
  }
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, orientation = "horizontal", onKeyDown, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement | null>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Initialize roving tabindex so exactly one button is tabbable.
    useEffect(() => {
      const container = innerRef.current;
      if (!container) return;
      const buttons = getButtons(container);
      const first = buttons[0];
      if (!first) return;
      const alreadyTabbable = buttons.some((button) => button.tabIndex === 0);
      if (!alreadyTabbable) setTabbable(buttons, first);
    });

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;

        const container = event.currentTarget;
        const buttons = getButtons(container);
        if (buttons.length === 0) return;

        const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

        const active = document.activeElement as HTMLButtonElement | null;
        const currentIndex = active ? buttons.indexOf(active) : -1;

        let nextIndex: number | null = null;
        if (event.key === nextKey) {
          nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % buttons.length;
        } else if (event.key === prevKey) {
          nextIndex =
            currentIndex < 0
              ? buttons.length - 1
              : (currentIndex - 1 + buttons.length) % buttons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = buttons.length - 1;
        }

        if (nextIndex === null) return;
        const target = buttons[nextIndex];
        if (!target) return;
        event.preventDefault();
        setTabbable(buttons, target);
        target.focus();
      },
      [onKeyDown, orientation],
    );

    return (
      <div
        ref={mergedRef}
        role="toolbar"
        data-slot="toolbar"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border border-border bg-surface-raised p-1",
          orientation === "vertical" && "flex-col",
          className,
        )}
        {...props}
      />
    );
  },
);
Toolbar.displayName = "Toolbar";

export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Toggle-button pressed state; reflected as aria-pressed. */
  pressed?: boolean;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, pressed, type, tabIndex, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        data-slot="toolbar-button"
        tabIndex={tabIndex ?? -1}
        aria-pressed={pressed}
        data-state={pressed ? "on" : undefined}
        className={cn(
          "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-surface-overlay data-[state=on]:text-fg [&_svg]:size-4 [&_svg]:shrink-0",
          className,
        )}
        {...props}
      />
    );
  },
);
ToolbarButton.displayName = "ToolbarButton";

export const ToolbarSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useFocusableInteractive: WAI-ARIA toolbar separators are static, non-focusable
      // biome-ignore lint/a11y/useSemanticElements: a styled divider in a toolbar uses role="separator", not <hr>
      <div
        ref={ref}
        // biome-ignore lint/a11y/useAriaPropsForRole: a static (non-resizable) separator carries no aria-valuenow
        role="separator"
        data-slot="toolbar-separator"
        aria-orientation="vertical"
        className={cn("mx-1 h-5 w-px shrink-0 bg-border", className)}
        {...props}
      />
    );
  },
);
ToolbarSeparator.displayName = "ToolbarSeparator";

export const ToolbarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a toolbar sub-group uses role="group", not <fieldset>
      <div
        ref={ref}
        role="group"
        data-slot="toolbar-group"
        className={cn("inline-flex items-center gap-1", className)}
        {...props}
      />
    );
  },
);
ToolbarGroup.displayName = "ToolbarGroup";
