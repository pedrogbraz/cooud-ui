"use client";

import { cn, Label, Switch } from "@cooud-ui/ui";
import { type KeyboardEvent, useId, useRef } from "react";
import type { ResolvedCategory } from "@/lib/stack/types";
import { OptionCard } from "./option-card";

export interface CategorySectionProps {
  /** The resolved state for this category (definition + per-option availability). */
  resolved: ResolvedCategory;
  /** Set a single category's value or flip a toggle. */
  onSelectSingle: (categoryId: string, optionId: string) => void;
  /** Toggle one id in a multi category. */
  onToggleMulti: (categoryId: string, optionId: string) => void;
  /** Flip a boolean toggle category. */
  onToggleBoolean: (categoryId: string, next: boolean) => void;
}

/**
 * One builder row: a category header (title + description) plus its options.
 *
 *  - `single` → a `role="radiogroup"` grid of radio cards with roving tabindex
 *    (Arrow keys move focus among AVAILABLE options, wrapping; Home/End jump).
 *  - `multi`  → a group of `aria-pressed` toggle cards.
 *  - `toggle` → a labelled Cooud UI Switch.
 */
export function CategorySection({
  resolved,
  onSelectSingle,
  onToggleMulti,
  onToggleBoolean,
}: CategorySectionProps) {
  const { category, options, value } = resolved;
  const headingId = useId();
  const descId = useId();
  const switchId = useId();
  const groupRef = useRef<HTMLDivElement>(null);

  const labelledBy = category.description ? `${headingId} ${descId}` : headingId;

  // Quiet right-aligned counter for the header: how many options are picked.
  // (single → 0/1, multi → n). Purely informational; the live region in the
  // summary owns the announced state, so this is hidden from AT.
  const selectedCount = options.filter((o) => o.selected).length;
  const counterLabel =
    category.kind === "multi"
      ? `${selectedCount} selected`
      : selectedCount > 0
        ? "Selected"
        : "Choose one";

  // --- Roving focus for the single radiogroup ----------------------------
  // The tab stop is the selected option when it's available, otherwise the
  // first available option, so Tab always lands somewhere sensible.
  const availableIdx = options.map((o, i) => (o.available ? i : -1)).filter((i) => i >= 0);
  const selectedIdx = options.findIndex((o) => o.selected && o.available);
  const tabStopIdx = selectedIdx >= 0 ? selectedIdx : (availableIdx[0] ?? -1);

  function focusOption(index: number) {
    const el = groupRef.current?.querySelectorAll<HTMLButtonElement>('[data-slot="option-card"]')[
      index
    ];
    el?.focus();
  }

  function handleRadioKeyNav(currentIndex: number, event: KeyboardEvent<HTMLButtonElement>) {
    if (availableIdx.length === 0) return;
    const pos = availableIdx.indexOf(currentIndex);
    let nextPos = pos;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextPos = pos < 0 ? 0 : (pos + 1) % availableIdx.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextPos = pos < 0 ? 0 : (pos - 1 + availableIdx.length) % availableIdx.length;
        break;
      case "Home":
        nextPos = 0;
        break;
      case "End":
        nextPos = availableIdx.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const targetIndex = availableIdx[nextPos];
    if (targetIndex === undefined) return;
    focusOption(targetIndex);
    // Radiogroups select on arrow-move (WAI-ARIA pattern).
    const target = options[targetIndex];
    if (target) onSelectSingle(category.id, target.option.id);
  }

  // --- Toggle category --------------------------------------------------
  if (category.kind === "toggle") {
    const on = value === true;
    return (
      <section data-slot="category-section" aria-labelledby={headingId} className="scroll-mt-24">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-xl border bg-surface-raised p-4 transition-colors duration-200 ease-[var(--ease-out-quart)]",
            on ? "border-primary/40 bg-primary/5" : "border-border hover:border-border-strong",
          )}
        >
          <div className="flex flex-col gap-0.5">
            <Label id={headingId} htmlFor={switchId} className="text-sm font-semibold text-fg">
              {category.title}
            </Label>
            {category.description ? (
              <span id={descId} className="text-pretty text-xs text-fg-secondary">
                {category.description}
              </span>
            ) : null}
          </div>
          <Switch
            id={switchId}
            checked={on}
            onCheckedChange={(next) => onToggleBoolean(category.id, next)}
            aria-describedby={category.description ? descId : undefined}
          />
        </div>
      </section>
    );
  }

  // --- Single / multi categories ----------------------------------------
  return (
    <section data-slot="category-section" aria-labelledby={headingId} className="scroll-mt-24">
      <header className="mb-3.5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 id={headingId} className="text-sm font-semibold tracking-tight text-fg">
            {category.title}
          </h3>
          {category.description ? (
            <p id={descId} className="text-pretty text-xs text-fg-secondary">
              {category.description}
            </p>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums transition-colors duration-200",
            selectedCount > 0
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-surface-overlay/60 text-fg-tertiary",
          )}
        >
          {counterLabel}
        </span>
      </header>

      <div
        ref={groupRef}
        // role + label are paired in a spread so the labelledby is statically
        // valid for whichever grouping role this category uses.
        {...{
          role: category.kind === "single" ? "radiogroup" : "group",
          "aria-labelledby": labelledBy,
        }}
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {options.map((opt, index) => (
          <OptionCard
            key={opt.option.id}
            resolved={opt}
            kind={category.kind === "single" ? "single" : "multi"}
            tabIndex={category.kind === "single" ? (index === tabStopIdx ? 0 : -1) : undefined}
            onSelect={() => {
              if (category.kind === "single") onSelectSingle(category.id, opt.option.id);
              else onToggleMulti(category.id, opt.option.id);
            }}
            onKeyNav={
              category.kind === "single" ? (event) => handleRadioKeyNav(index, event) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
