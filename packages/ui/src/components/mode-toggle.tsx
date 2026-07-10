"use client";

import { type ButtonHTMLAttributes, forwardRef, useCallback, useId } from "react";
import { cn } from "../lib/cn.js";

export type ModeToggleMode = "light" | "dark";
export type ModeToggleSize = "sm" | "md";

const sizeStyles: Record<ModeToggleSize, { button: string; icon: string }> = {
  sm: { button: "size-8", icon: "size-4" },
  md: { button: "size-9", icon: "size-5" },
};

export interface ModeToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The current color mode. The component is fully controlled — it never stores mode itself. */
  mode: ModeToggleMode;
  /** Called with the opposite mode when the button is activated (click, Enter or Space). */
  onModeChange: (next: ModeToggleMode) => void;
  /** Button footprint: `sm` (32px, 16px glyph) or `md` (36px, 20px glyph). Defaults to `md`. */
  size?: ModeToggleSize;
}

/**
 * An animated light/dark mode icon-button where a single SVG sun morphs into a
 * moon. Three CSS transitions (~300ms, house ease-out) drive the morph, all
 * keyed off the button's `data-mode` attribute so React only swaps one string:
 *
 * - the core `<circle>` scales up 1.75× to become the moon disc,
 * - the 8 sun rays scale down and fade out as a group,
 * - a black circle inside an SVG `<mask>` slides in from the corner to carve
 *   the crescent bite out of the enlarged disc.
 *
 * Because the states are plain CSS classes (no JS animation loop), the morph
 * is compositor-driven and `motion-reduce` collapses it to an instant swap.
 * The `<mask>` id comes from `useId`, so multiple toggles can coexist on one
 * page and SSR/client markup stay in sync.
 *
 * The component is deliberately theme-agnostic: it renders whatever `mode` it
 * is given and reports the opposite via `onModeChange`. Wire it to your theme
 * provider (e.g. `useTheme().setMode`) — it never touches the DOM root itself.
 */
export const ModeToggle = forwardRef<HTMLButtonElement, ModeToggleProps>(
  (
    { mode, onModeChange, size = "md", className, onClick, "aria-label": ariaLabel, ...props },
    ref,
  ) => {
    const maskId = useId();
    const next: ModeToggleMode = mode === "light" ? "dark" : "light";

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onModeChange(next);
      },
      [onClick, onModeChange, next],
    );

    return (
      <button
        ref={ref}
        type="button"
        data-slot="mode-toggle"
        data-mode={mode}
        aria-label={ariaLabel ?? `Switch to ${next} mode`}
        className={cn(
          "group/mode-toggle inline-flex shrink-0 items-center justify-center rounded-lg text-fg-secondary outline-none",
          "transition-[background,color,box-shadow] duration-150 ease-[var(--ease-out-quart)] hover:bg-surface-overlay hover:text-fg motion-reduce:transition-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:pointer-events-none disabled:opacity-50",
          sizeStyles[size].button,
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={cn("shrink-0", sizeStyles[size].icon)}
        >
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            {/* The crescent cutter: parked past the corner in light mode, slides
                over the disc in dark mode. Painting black in a mask erases. */}
            <circle
              cx="24"
              cy="10"
              r="6"
              fill="black"
              className="translate-x-0 transition-transform duration-300 ease-[var(--ease-out-quart)] group-data-[mode=dark]/mode-toggle:-translate-x-[7px] motion-reduce:transition-none"
            />
          </mask>
          {/* Sun core / moon disc. `origin-center` on an SVG element resolves
              against the view-box, whose center (12,12) is the circle's own
              center — so the scale grows the disc in place. */}
          <circle
            data-slot="mode-toggle-core"
            cx="12"
            cy="12"
            r="6"
            fill="currentColor"
            mask={`url(#${maskId})`}
            className="origin-center scale-100 transition-transform duration-300 ease-[var(--ease-out-quart)] group-data-[mode=dark]/mode-toggle:scale-[1.75] motion-reduce:transition-none"
          />
          <g
            data-slot="mode-toggle-rays"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center scale-100 opacity-100 transition-[scale,opacity] duration-300 ease-[var(--ease-out-quart)] group-data-[mode=dark]/mode-toggle:scale-50 group-data-[mode=dark]/mode-toggle:opacity-0 motion-reduce:transition-none"
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      </button>
    );
  },
);
ModeToggle.displayName = "ModeToggle";
