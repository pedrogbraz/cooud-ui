"use client";

import { forwardRef, type HTMLAttributes, type RefObject, useEffect, useState } from "react";
import { cn } from "../lib/cn.js";

type ScrollProgressVariant = "bar" | "circle";
type ScrollProgressPosition = "top" | "bottom";

/**
 * Clamp a raw scroll ratio to 0–1. A scroll container with no overflow
 * (`scrollHeight === clientHeight`) has nothing to scroll, so it reports 0.
 */
function ratioFor(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, scrollTop / scrollable));
}

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Render a thin horizontal bar or a circular ring. */
  variant?: ScrollProgressVariant;
  /**
   * The scroll container to track. When omitted, the window / document scrolling
   * element is tracked instead.
   */
  target?: RefObject<HTMLElement | null>;
  /** Where to pin the bar variant (ignored for the circle). */
  position?: ScrollProgressPosition;
  /** Diameter of the ring in px (circle variant only). */
  size?: number;
}

export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    {
      className,
      variant = "bar",
      target,
      position = "top",
      size = 40,
      "aria-label": ariaLabel = "Scroll progress",
      ...props
    },
    ref,
  ) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const element = target?.current ?? null;
      // Track the supplied element, or the document scrolling element for the
      // window-level case (scroll events still come from `window`).
      const scrollSource: EventTarget = element ?? window;

      const measure = () => {
        if (element) {
          setProgress(ratioFor(element.scrollTop, element.scrollHeight, element.clientHeight));
          return;
        }
        const doc = document.documentElement;
        setProgress(ratioFor(doc.scrollTop, doc.scrollHeight, doc.clientHeight));
      };

      // Measure on every scroll/resize. `setProgress` already bails out when the
      // ratio is unchanged, so bursty events stay cheap without deferring the
      // update off the event (which would race a synchronous read of the value).
      const onScroll = () => measure();

      measure();
      scrollSource.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });

      return () => {
        scrollSource.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, [target]);

    const percent = Math.round(progress * 100);
    const ariaProps = {
      role: "progressbar" as const,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": percent,
      "aria-label": ariaLabel,
    };

    if (variant === "circle") {
      // Inset the ring by half the stroke so it isn't clipped by the viewBox.
      const strokeWidth = Math.max(2, Math.round(size * 0.1));
      const radius = size / 2 - strokeWidth / 2;
      const circumference = 2 * Math.PI * radius;
      const dashOffset = circumference * (1 - progress);

      return (
        <div
          ref={ref}
          data-slot="scroll-progress"
          data-variant="circle"
          {...ariaProps}
          className={cn("relative inline-flex items-center justify-center", className)}
          style={{ width: size, height: size }}
          {...props}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            // Rotate so the ring fills clockwise from 12 o'clock.
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              className="stroke-border"
            />
            <circle
              data-slot="scroll-progress-ring"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="stroke-primary"
            />
          </svg>
          <span
            data-slot="scroll-progress-value"
            className="absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums text-fg"
          >
            {percent}%
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="scroll-progress"
        data-variant="bar"
        {...ariaProps}
        className={cn(
          "h-1 w-full overflow-hidden bg-surface-inset",
          // Pin to the viewport edge for the window-level case; consumers can
          // override via className.
          !target && "sticky inset-x-0 z-50",
          !target && (position === "bottom" ? "bottom-0" : "top-0"),
          className,
        )}
        {...props}
      >
        <div
          data-slot="scroll-progress-fill"
          className="h-full bg-primary"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    );
  },
);
ScrollProgress.displayName = "ScrollProgress";
