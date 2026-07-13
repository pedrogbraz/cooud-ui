import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export const Metric = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="metric"
        className={cn("flex flex-col gap-1", className)}
        {...props}
      />
    );
  },
);
Metric.displayName = "Metric";

export const MetricLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="metric-label"
        className={cn("text-xs font-medium uppercase tracking-wider text-fg-tertiary", className)}
        {...props}
      />
    );
  },
);
MetricLabel.displayName = "MetricLabel";

export const MetricValue = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="metric-value"
        className={cn("font-display text-2xl font-semibold text-fg tabular-nums", className)}
        {...props}
      />
    );
  },
);
MetricValue.displayName = "MetricValue";

export interface MetricDeltaProps extends HTMLAttributes<HTMLSpanElement> {
  trend?: "up" | "down" | "neutral";
}

// Small (`text-xs`) delta text: use the AA-tuned `*-strong` variants so the
// success/error trend labels clear WCAG AA on the light-theme card surfaces
// (plain `text-success`/`text-error` read <4.5:1 as small text there).
const trendStyles: Record<NonNullable<MetricDeltaProps["trend"]>, string> = {
  up: "text-success-strong",
  down: "text-error-strong",
  neutral: "text-fg-tertiary",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

export const MetricDelta = forwardRef<HTMLSpanElement, MetricDeltaProps>(
  ({ className, trend = "neutral", children, ...props }, ref) => {
    const Icon = trendIcons[trend];
    return (
      <span
        ref={ref}
        data-slot="metric-delta"
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium",
          trendStyles[trend],
          className,
        )}
        {...props}
      >
        <Icon className="size-3.5" />
        {children}
      </span>
    );
  },
);
MetricDelta.displayName = "MetricDelta";
