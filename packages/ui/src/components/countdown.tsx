"use client";

import { forwardRef, type HTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";

/** Visible caption under each unit tile. Override any subset to localize. */
export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const DEFAULT_LABELS: CountdownLabels = {
  days: "days",
  hours: "hours",
  minutes: "min",
  seconds: "sec",
};

const UNITS = ["days", "hours", "minutes", "seconds"] as const;
type CountdownUnit = (typeof UNITS)[number];

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3_600;
const SECONDS_PER_DAY = 86_400;

/** Shown in every cell until the client clock is known (SSR + first paint). */
const PLACEHOLDER = "--";

/** Normalize the accepted target shapes to an epoch-ms number (NaN when unparsable). */
function toTimestamp(target: Date | string | number): number {
  return target instanceof Date ? target.getTime() : new Date(target).getTime();
}

function splitSeconds(totalSeconds: number): Record<CountdownUnit, number> {
  return {
    days: Math.floor(totalSeconds / SECONDS_PER_DAY),
    hours: Math.floor(totalSeconds / SECONDS_PER_HOUR) % 24,
    minutes: Math.floor(totalSeconds / SECONDS_PER_MINUTE) % 60,
    seconds: totalSeconds % SECONDS_PER_MINUTE,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * The moment the countdown reaches zero: a `Date`, an ISO-8601 string, or an
   * epoch-ms number. An unparsable target keeps the `--` placeholder and never
   * ticks or completes.
   */
  target: Date | string | number;
  /**
   * Fired exactly once when the countdown reaches zero (immediately after
   * mount when the target is already in the past). Re-arms if `target` later
   * changes to a new future moment.
   */
  onComplete?: () => void;
  /** Smaller tiles + type for tight spots (toolbars, banners, table cells). */
  compact?: boolean;
  /** Override any subset of the unit captions, e.g. `{ days: "dias" }`. */
  labels?: Partial<CountdownLabels>;
}

/**
 * A countdown to a target moment, rendered as four `tabular-nums` tiles
 * (days / hours / minutes / seconds) on `bg-surface-raised` with
 * `text-fg-tertiary` captions.
 *
 * How it works: the remaining time is re-derived from `Date.now()` on every
 * tick, and the next tick is scheduled with a `setTimeout` aligned to the next
 * whole-second boundary (`remaining % 1000`), so the display never drifts and
 * wakes up only once per second. State stores whole seconds — sub-second
 * re-computations that land on the same second are free (React bails out of
 * identical state). At zero the timer stops scheduling and `onComplete` fires
 * exactly once (guarded by a ref).
 *
 * Digit motion: each cell's value lives in a span keyed by its text, so a
 * change remounts the span and a `starting:` (`@starting-style`) CSS
 * transition slides it in with a subtle vertical drift + fade — no JS
 * animation, no re-render churn beyond the one-per-second state update.
 * Under `prefers-reduced-motion` the transition is disabled and digits swap
 * instantly.
 *
 * SSR-safe: the server (and the first client paint) renders a stable `--`
 * placeholder in every cell; the real values only appear after mount, so
 * hydration never mismatches on wall-clock time.
 *
 * Accessibility: the root is `role="timer"` with `aria-live="off"` (per the
 * ARIA timer pattern — ticking values should not be announced every second),
 * and the once-a-second remounting tiles are `aria-hidden`. A visually hidden
 * summary sentence built from the same labels gives screen readers a stable,
 * readable value on focus.
 */
export const Countdown = forwardRef<HTMLDivElement, CountdownProps>(
  ({ target, onComplete, compact = false, labels, className, ...props }, ref) => {
    const targetMs = toTimestamp(target);
    // `null` = clock not known yet (server render / first client paint).
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    // Latest callback in a ref so a new inline `onComplete` never restarts the timer.
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const completedRef = useRef(false);

    useEffect(() => {
      if (Number.isNaN(targetMs)) {
        setRemainingSeconds(null);
        return;
      }
      // A new target re-arms completion (e.g. extending a sale deadline).
      completedRef.current = false;
      let timeoutId: number | undefined;

      const tick = (): void => {
        const remaining = Math.max(0, targetMs - Date.now());
        // Ceil so the display reads "1" until the second truly elapses.
        setRemainingSeconds(Math.ceil(remaining / 1_000));
        if (remaining <= 0) {
          if (!completedRef.current) {
            completedRef.current = true;
            onCompleteRef.current?.();
          }
          return; // Stop scheduling — the countdown is over.
        }
        // Wake exactly at the next whole-second boundary (drift-free).
        timeoutId = window.setTimeout(tick, remaining % 1_000 || 1_000);
      };

      tick();
      return () => window.clearTimeout(timeoutId);
    }, [targetMs]);

    const parts = remainingSeconds === null ? null : splitSeconds(remainingSeconds);
    const mergedLabels: CountdownLabels = { ...DEFAULT_LABELS, ...labels };
    const summary = parts
      ? UNITS.map((unit) => `${parts[unit]} ${mergedLabels[unit]}`).join(", ")
      : "Counting down";

    return (
      <div
        ref={ref}
        data-slot="countdown"
        role="timer"
        aria-live="off"
        data-compact={compact ? "" : undefined}
        className={cn("inline-flex items-start", compact ? "gap-1" : "gap-1.5", className)}
        {...props}
      >
        <span className="sr-only">{summary}</span>
        {UNITS.map((unit) => {
          const value = parts ? pad(parts[unit]) : PLACEHOLDER;
          return (
            <div
              key={unit}
              aria-hidden="true"
              data-slot="countdown-unit"
              data-unit={unit}
              className={cn(
                "flex flex-col items-center rounded-lg border border-border bg-surface-raised shadow-xs",
                compact ? "min-w-9 px-1.5 py-1" : "min-w-14 gap-0.5 px-2.5 py-2",
              )}
            >
              <span
                data-slot="countdown-value"
                className={cn(
                  "block overflow-hidden font-semibold text-fg tabular-nums",
                  compact ? "text-sm leading-5" : "text-2xl leading-8",
                )}
              >
                {/* Keyed by its text: a change remounts the span, and the
                    `starting:` state transitions it in (slide down + fade).
                    Reduced-motion swaps instantly. */}
                <span
                  key={value}
                  className="block transition-[transform,opacity] duration-300 ease-[var(--ease-out-quart)] starting:-translate-y-1.5 starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:translate-y-0 motion-reduce:starting:opacity-100"
                >
                  {value}
                </span>
              </span>
              <span
                data-slot="countdown-label"
                className={cn(
                  "font-medium uppercase tracking-[0.08em] text-fg-tertiary",
                  compact ? "text-[0.5625rem]" : "text-[0.6875rem]",
                )}
              >
                {mergedLabels[unit]}
              </span>
            </div>
          );
        })}
      </div>
    );
  },
);
Countdown.displayName = "Countdown";
