"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Star } from "lucide-react";
import {
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useId,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

const ratingVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5 [&_svg]:size-3.5",
      md: "gap-1 [&_svg]:size-5",
      lg: "gap-1.5 [&_svg]:size-7",
    },
  },
  defaultVariants: { size: "md" },
});

export interface RatingProps extends VariantProps<typeof ratingVariants> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: number;
  /** Initial value for uncontrolled usage. Defaults to `0`. */
  defaultValue?: number;
  /** Called with the new value whenever the rating changes. */
  onValueChange?: (value: number) => void;
  /** Number of stars. Defaults to `5`. */
  max?: number;
  /** Renders display-only with no interaction. Defaults to `false`. */
  readOnly?: boolean;
  /** Allows half-star (0.5) granularity. Defaults to `false`. */
  allowHalf?: boolean;
  /** Star size preset. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Accessible name for the rating when there is no visible label. */
  "aria-label"?: string;
  /** ID of an element labelling the rating. */
  "aria-labelledby"?: string;
  /** Extra classes for the wrapper element. */
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** One star: an empty outline with a clipped, filled overlay sized to `fill`. */
function StarIcon({ fill }: { fill: number }) {
  return (
    <span className="relative inline-flex shrink-0" data-slot="rating-star">
      <Star
        aria-hidden="true"
        className="text-fg-muted transition-colors duration-150 ease-[var(--ease-out-quart)]"
      />
      <span
        className="absolute inset-0 overflow-hidden"
        // Clip the filled overlay to the fill fraction (0, 0.5, or 1). The
        // outline underneath shows through for the unfilled remainder.
        style={{ width: `${clamp(fill, 0, 1) * 100}%` }}
      >
        <Star
          aria-hidden="true"
          className="fill-warning text-warning transition-[color,transform] duration-150 ease-[var(--ease-out-quart)]"
        />
      </span>
    </span>
  );
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: valueProp,
      defaultValue = 0,
      onValueChange,
      max = 5,
      readOnly = false,
      allowHalf = false,
      size = "md",
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = clamp(isControlled ? valueProp : uncontrolledValue, 0, max);

    // Hover preview overrides the displayed value while pointing at the stars
    // (interactive only); `null` means "show the committed value".
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const interactive = !readOnly;
    const step = allowHalf ? 0.5 : 1;
    const labelId = useId();

    const commit = useCallback(
      (next: number) => {
        const clamped = clamp(next, 0, max);
        if (!isControlled) setUncontrolledValue(clamped);
        onValueChange?.(clamped);
      },
      [isControlled, max, onValueChange],
    );

    // Resolve the value a pointer event targets: the star's 1-based index, or
    // its half when `allowHalf` and the pointer sits on the star's left edge.
    // Typed as MouseEvent so both onClick and onPointerMove (a PointerEvent,
    // which extends MouseEvent) can share it.
    const valueFromPointer = useCallback(
      (event: MouseEvent<HTMLSpanElement>, index: number) => {
        if (!allowHalf) return index + 1;
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const isLeftHalf = event.clientX - left < width / 2;
        return isLeftHalf ? index + 0.5 : index + 1;
      },
      [allowHalf],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (!interactive) return;
        let next: number | null = null;
        switch (event.key) {
          case "ArrowRight":
          case "ArrowUp":
            next = value + step;
            break;
          case "ArrowLeft":
          case "ArrowDown":
            next = value - step;
            break;
          case "Home":
            next = 0;
            break;
          case "End":
            next = max;
            break;
          default:
            return;
        }
        event.preventDefault();
        commit(clamp(next, 0, max));
      },
      [interactive, value, step, max, commit],
    );

    // What each star renders: hover preview when present, else the value.
    const displayValue = hoverValue ?? value;
    const valueText = `${value} out of ${max}`;

    const stars = Array.from({ length: max }, (_, index) => {
      const fill = clamp(displayValue - index, 0, 1);
      if (!interactive) {
        // biome-ignore lint/suspicious/noArrayIndexKey: stars are positional and fixed in count
        return <StarIcon key={index} fill={fill} />;
      }
      return (
        // The wrapper is the single focusable slider; each star is a pointer
        // hit-area only (a span, not a nested interactive control), so it stays
        // out of the tab order and the accessibility tree.
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: stars are positional and fixed in count
          key={index}
          aria-hidden="true"
          data-slot="rating-item"
          className="inline-flex cursor-pointer transition-transform duration-150 ease-[var(--ease-out-quart)] hover:scale-110"
          onClick={(event) => commit(valueFromPointer(event, index))}
          onPointerMove={(event) => setHoverValue(valueFromPointer(event, index))}
        >
          <StarIcon fill={fill} />
        </span>
      );
    });

    return (
      <div
        ref={ref}
        data-slot="rating"
        role="slider"
        tabIndex={interactive ? 0 : -1}
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : labelId)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        aria-readonly={readOnly || undefined}
        data-readonly={readOnly ? "" : undefined}
        className={cn(
          ratingVariants({ size }),
          interactive &&
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base rounded-md",
          className,
        )}
        onKeyDown={handleKeyDown}
        onPointerLeave={interactive ? () => setHoverValue(null) : undefined}
        {...props}
      >
        {/* Fallback accessible name when neither aria-label nor -labelledby is set. */}
        {!ariaLabel && !ariaLabelledby ? (
          <span id={labelId} className="sr-only">
            Rating
          </span>
        ) : null}
        {stars}
      </div>
    );
  },
);
Rating.displayName = "Rating";
