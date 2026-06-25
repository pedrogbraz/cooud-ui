import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** A single day of the heatmap. `date` is a display string used in the tooltip. */
export interface HeatmapDay {
  /** Display date string, e.g. "2026-06-24". Used only for the tooltip title. */
  date: string;
  /** The activity value for the day; bucketed into a color level. */
  value: number;
}

// Static (never interpolated) background classes selected by level lookup.
// Level 0 is the empty inset; levels 1..4 ramp the primary token's opacity.
const levelClasses = [
  "bg-surface-inset",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

/**
 * Bucket a `value` into a discrete level `0..levels-1` against the series `max`.
 * Level 0 is reserved for an empty/zero day; positive values spread across the
 * remaining `levels-1` buckets. A non-positive `max` collapses everything to 0
 * so we never divide by zero or read past the class lookup.
 */
export function getHeatmapLevel(value: number, max: number, levels: number): number {
  if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(max) || max <= 0) {
    return 0;
  }
  const buckets = Math.max(1, levels - 1);
  const ratio = Math.min(1, value / max);
  // Map ratio (0,1] → level 1..buckets. Ceil so the smallest positive value is
  // still level 1 and value === max lands on the top level.
  const level = Math.ceil(ratio * buckets);
  return Math.min(buckets, Math.max(1, level));
}

export interface HeatmapProps extends HTMLAttributes<HTMLDivElement> {
  /** One item per day, laid out into week columns of 7 (top → bottom). */
  data: HeatmapDay[];
  /** Number of discrete levels including the empty level 0. */
  levels?: number;
  /**
   * Hint for the intended number of week columns. Ignored — the data drives the
   * layout — but accepted so callers can document intent.
   */
  weekCount?: number;
}

export const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      className,
      data,
      levels = 5,
      // Pulled out so it is not forwarded onto the DOM node.
      weekCount: _weekCount,
      "aria-label": ariaLabel = "Activity heatmap",
      ...props
    },
    ref,
  ) => {
    const safeLevels = Math.min(levelClasses.length, Math.max(2, levels));
    const max = data.reduce((acc, day) => (day.value > acc ? day.value : acc), 0);

    return (
      <div
        ref={ref}
        data-slot="heatmap"
        className={cn("inline-flex flex-col gap-2", className)}
        {...props}
      >
        <div role="img" aria-label={ariaLabel} className="grid grid-flow-col grid-rows-7 gap-1">
          {data.map((day, index) => {
            const level = getHeatmapLevel(day.value, max, safeLevels);
            return (
              <div
                // Days are positional and never reordered, so the index is a
                // stable key.
                // biome-ignore lint/suspicious/noArrayIndexKey: positional days
                key={index}
                data-slot="heatmap-day"
                data-level={level}
                title={`${day.value} on ${day.date}`}
                className={cn("size-3 rounded-[3px]", levelClasses[level])}
              />
            );
          })}
        </div>
        <div
          data-slot="heatmap-legend"
          className="flex items-center gap-1 text-xs text-fg-tertiary"
        >
          <span>Less</span>
          {levelClasses.slice(0, safeLevels).map((cls, level) => (
            <span
              // Legend swatches are fixed and positional.
              // biome-ignore lint/suspicious/noArrayIndexKey: positional swatches
              key={level}
              data-slot="heatmap-legend-swatch"
              data-level={level}
              className={cn("size-3 rounded-[3px]", cls)}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    );
  },
);
Heatmap.displayName = "Heatmap";
