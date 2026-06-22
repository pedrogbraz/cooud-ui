"use client";

import { Badge, cn, Tooltip, TooltipContent, TooltipTrigger } from "@cooud/ui";
import { Check } from "lucide-react";
import { type KeyboardEvent, useId } from "react";
import type { Badge as BadgeKind, ResolvedOption } from "@/lib/stack/types";
import { OptionIcon } from "./option-icon";

/** Map a catalog {@link BadgeKind} to a Cooud UI Badge variant + label. */
const BADGE_META: Record<BadgeKind, { label: string; variant: "warning" | "info" | "primary" }> = {
  beta: { label: "Beta", variant: "warning" },
  new: { label: "New", variant: "info" },
  experimental: { label: "Experimental", variant: "warning" },
  gated: { label: "Gated", variant: "primary" },
};

export interface OptionCardProps {
  /** The resolved option (definition + availability + selected state). */
  resolved: ResolvedOption;
  /** How the owning category is selected — drives ARIA role + semantics. */
  kind: "single" | "multi";
  /** Roving-tabindex value supplied by the parent group (single only). */
  tabIndex?: number;
  /** Select / toggle this option. Never called when the option is unavailable. */
  onSelect: () => void;
  /** Arrow-key handler for roving focus inside a radiogroup (single only). */
  onKeyNav?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * A single selectable stack option, rendered as a button.
 *
 * Semantics by category kind:
 *  - `single` → `role="radio"` with `aria-checked` (the parent is a radiogroup
 *    that owns roving focus via `tabIndex` + `onKeyNav`).
 *  - `multi`  → a toggle button with `aria-pressed` (checkbox-style).
 *
 * When the option is unavailable it is rendered `aria-disabled`, removed from the
 * tab order, visually dimmed (`cursor-not-allowed`, reduced opacity) and will NOT
 * fire `onSelect`. The human reason is surfaced both as a Tooltip AND wired to
 * the button via `aria-describedby` (so it reaches screen readers, not just
 * sighted hover users).
 */
export function OptionCard({ resolved, kind, tabIndex, onSelect, onKeyNav }: OptionCardProps) {
  const { option, available, selected, reason } = resolved;
  const disabled = !available;
  const reasonId = useId();
  const badge = option.badge ? BADGE_META[option.badge] : undefined;

  // Role + checked/pressed state are kind-dependent. Single options are radios
  // inside a radiogroup (aria-checked); multi options are pressable toggle
  // buttons (aria-pressed). Built as a spread so the pairing of role + state is
  // statically coherent.
  const roleProps =
    kind === "single"
      ? ({ role: "radio", "aria-checked": selected } as const)
      : ({ "aria-pressed": selected } as const);

  const card = (
    <button
      type="button"
      data-slot="option-card"
      {...roleProps}
      aria-disabled={disabled || undefined}
      aria-describedby={disabled ? reasonId : undefined}
      // Disabled cards leave the tab order entirely; single uses roving tabindex.
      tabIndex={disabled ? -1 : kind === "single" ? tabIndex : 0}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={(event) => {
        if (disabled) return;
        // Space/Enter activate (native for buttons, but radios need the explicit
        // Space handler). Arrow keys move roving focus in single groups.
        if (kind === "single" && (event.key === " " || event.key === "Enter")) {
          event.preventDefault();
          onSelect();
        }
        onKeyNav?.(event);
      }}
      className={cn(
        // The base card. We transition border/background/shadow/opacity/filter +
        // a tiny translate so BOTH hover (lift) and the availability flip
        // (dim/undim) animate smoothly. `will-change-transform` keeps the lift on
        // the compositor. `motion-reduce` parks every animated property.
        "group/option relative flex h-full w-full flex-col items-start gap-2 rounded-xl border bg-surface-raised p-3 text-left outline-none [will-change:transform]",
        "transition-[border-color,background-color,box-shadow,transform,opacity,filter] duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-[opacity,filter] motion-reduce:duration-150",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        disabled
          ? // Elegant disabled: dimmed + slightly desaturated so it visually
            // recedes, but the transition above means it fades in/out gracefully
            // when a constraint toggles availability — never a hard flicker.
            "cursor-not-allowed border-border/60 opacity-45 saturate-[0.85]"
          : // Interactive: hover lifts the card 2px and warms the border toward
            // primary with a soft glow; active settles it back down.
            "cursor-pointer hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-overlay hover:shadow-[0_8px_24px_-12px_color-mix(in_oklch,var(--color-primary)_45%,transparent)] active:translate-y-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        selected
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary),0_8px_24px_-12px_color-mix(in_oklch,var(--color-primary)_55%,transparent)]"
          : "border-border",
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <OptionIcon name={option.icon} selected={selected} />

        {badge ? (
          <Badge
            variant={badge.variant}
            className="px-1.5 py-0 text-[10px] font-medium uppercase tracking-wide leading-4"
          >
            {badge.label}
          </Badge>
        ) : null}
      </div>

      {/*
        The selected check, pinned to the card's BOTTOM-right corner so it never
        reserves layout space (no gap / shift when unselected) and never collides
        with a top-right badge. Always mounted so it can transition on BOTH edges:
        on select it springs in (scale 0 → 1 + a tiny rotate settle) via the
        `--ease-spring` overshoot easing — the satisfying "pop"; on deselect it
        shrinks back out. `motion-reduce` collapses it to a plain instant toggle to
        stay accessible. Pure CSS — no per-card JS, no layout shift.
      */}
      <span
        data-slot="option-card-check"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 bottom-3 grid size-5 origin-center place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_color-mix(in_oklch,var(--color-primary)_60%,transparent)]",
          "transition-[transform,opacity] duration-300 ease-[var(--ease-spring)] motion-reduce:transition-none motion-reduce:duration-0",
          selected ? "scale-100 rotate-0 opacity-100" : "-rotate-45 scale-0 opacity-0",
        )}
      >
        <Check className="size-3.5" />
      </span>

      {/* Right padding clears the bottom-right corner check so text never runs under it. */}
      <span className="flex flex-col gap-0.5 pr-7">
        <span className="text-sm font-medium text-fg">{option.name}</span>
        <span
          className={cn(
            "text-xs leading-snug transition-colors duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
            "text-fg-secondary group-hover/option:text-fg",
          )}
        >
          {option.description}
        </span>
      </span>

      {/*
        Always rendered (sr-only when available) so `aria-describedby` always
        resolves and the reason is announced to assistive tech, not just shown
        on hover. When disabled it is also visible inline as a subtle hint.
      */}
      <span
        id={reasonId}
        data-slot="option-card-reason"
        className={cn(
          "mt-auto text-[11px] font-medium text-fg-tertiary",
          disabled ? "block pt-1" : "sr-only",
        )}
      >
        {disabled ? (reason ?? "Unavailable in this stack") : ""}
      </span>
    </button>
  );

  // Disabled options get a Tooltip explaining the reason on hover/focus. We keep
  // the trigger reachable for hover even though it is out of the tab order.
  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{card}</TooltipTrigger>
        <TooltipContent>{reason ?? "Unavailable in this stack"}</TooltipContent>
      </Tooltip>
    );
  }

  return card;
}
