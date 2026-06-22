"use client";

import { Badge, Button, cn, GlassCard, ScrollArea } from "@cooud/ui";
import { Layers, RotateCcw, Shuffle } from "lucide-react";
import { useMemo } from "react";
import type { Catalog, Resolution } from "@/lib/stack/types";

export interface SelectedSummaryProps {
  /** The current resolution (drives the rendered choices). */
  resolution: Resolution;
  /** The catalog (for category order + option names). */
  catalog: Catalog;
  /** Restore the default selection. */
  onReset: () => void;
  /** Roll a fresh, valid random stack. */
  onRandomize: () => void;
  className?: string;
}

interface SummaryRow {
  categoryId: string;
  title: string;
  /** The human values chosen for this category (empty when nothing meaningful). */
  values: string[];
}

/** Whether an option id represents an empty / "None" choice we hide from the list. */
function isNoneId(id: string): boolean {
  return id.endsWith("-none");
}

/**
 * The "Selected stack" panel — mirrors Better-T-Stack's summary. Lists every
 * meaningful choice (Nones and off-toggles are hidden), shows a live count, and
 * exposes Reset + Randomize. It is a pure projection of {@link Resolution}.
 */
export function SelectedSummary({
  resolution,
  catalog,
  onReset,
  onRandomize,
  className,
}: SelectedSummaryProps) {
  const rows = useMemo<SummaryRow[]>(() => {
    const out: SummaryRow[] = [];
    for (const cat of catalog) {
      const rc = resolution.categories[cat.id];
      if (!rc) continue;
      const { value } = rc;
      const values: string[] = [];

      if (cat.kind === "single" && typeof value === "string") {
        if (!isNoneId(value)) {
          const opt = cat.options.find((o) => o.id === value);
          if (opt) values.push(opt.name);
        }
      } else if (cat.kind === "multi" && Array.isArray(value)) {
        for (const id of value) {
          const opt = cat.options.find((o) => o.id === id);
          if (opt) values.push(opt.name);
        }
      } else if (cat.kind === "toggle" && value === true) {
        values.push("On");
      }

      if (values.length > 0) out.push({ categoryId: cat.id, title: cat.title, values });
    }
    return out;
  }, [resolution, catalog]);

  // Count distinct selected choices (each value counts once).
  const count = rows.reduce((n, r) => n + r.values.length, 0);
  const hasErrors = resolution.issues.some((i) => i.level === "error");
  const infos = resolution.issues.filter((i) => i.level === "info");

  return (
    <GlassCard
      role="region"
      data-slot="selected-summary"
      aria-labelledby="selected-summary-heading"
      className={cn("flex flex-col p-4 sm:p-5", className)}
    >
      <div className="flex flex-col">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg border border-border bg-surface-overlay text-fg-secondary">
              <Layers className="size-4" aria-hidden="true" />
            </span>
            <h2
              id="selected-summary-heading"
              className="text-xs font-semibold uppercase tracking-widest text-fg-secondary"
            >
              Selected stack
            </h2>
          </div>
          {/* Count badge — re-keyed on change so it replays a subtle scale pop. */}
          <Badge
            key={count}
            variant="secondary"
            aria-label={`${count} choices selected`}
            className="tabular-nums transition-transform duration-200 ease-[var(--ease-spring)] starting:scale-90 motion-reduce:transition-none motion-reduce:starting:scale-100"
          >
            {count}
          </Badge>
        </header>

        <ScrollArea className="-mr-2 mt-4 max-h-[18rem] pr-2">
          <dl className="flex flex-col gap-2.5">
            {rows.map((row) => (
              <div
                key={row.categoryId}
                className="flex items-start justify-between gap-3 border-b border-border/50 pb-2.5 last:border-b-0 last:pb-0"
              >
                <dt className="shrink-0 text-xs text-fg-tertiary">{row.title}</dt>
                <dd className="flex flex-wrap justify-end gap-1.5 text-right">
                  {row.values.map((v) => (
                    // Each chip is keyed by its value, so a newly-selected option
                    // mounts fresh and runs a one-shot fade/scale-in (Tailwind v4
                    // @starting-style). Reduced-motion keeps it instant.
                    <span
                      key={`${row.categoryId}-${v}`}
                      className="inline-flex rounded-md bg-surface-overlay/70 px-1.5 py-0.5 text-xs font-medium text-fg transition-[opacity,transform] duration-200 ease-[var(--ease-out-quart)] starting:scale-95 starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:scale-100 motion-reduce:starting:opacity-100"
                    >
                      {v}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollArea>

        {/* Advisory recommendations (info-level issues). */}
        {infos.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-1 rounded-lg border border-info/30 bg-info/10 px-3 py-2">
            {infos.map((issue) => (
              <li key={issue.message} className="text-xs text-fg-secondary">
                {issue.message}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="group/randomize flex-1"
            onClick={onRandomize}
            data-slot="summary-randomize"
          >
            <Shuffle
              aria-hidden="true"
              className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover/randomize:rotate-180 motion-reduce:transition-none motion-reduce:group-hover/randomize:rotate-0"
            />
            Randomize
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="group/reset flex-1"
            onClick={onReset}
            data-slot="summary-reset"
          >
            <RotateCcw
              aria-hidden="true"
              className="transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover/reset:-rotate-90 motion-reduce:transition-none motion-reduce:group-hover/reset:rotate-0"
            />
            Reset
          </Button>
        </div>

        {/* Live status for assistive tech (and a subtle visual note on errors). */}
        <p
          role="status"
          aria-live="polite"
          className={cn("mt-4 text-xs", hasErrors ? "text-error" : "sr-only")}
        >
          {hasErrors
            ? "This stack has conflicting choices — adjust the highlighted categories."
            : "Stack is valid."}
        </p>
      </div>
    </GlassCard>
  );
}
