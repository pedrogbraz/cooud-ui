import { type CSSProperties, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The desired width-to-height ratio, expressed as a number
   * (e.g. `16 / 9`, `1`, `4 / 3`). Defaults to `16 / 9`.
   */
  ratio?: number;
}

/**
 * Constrains its content to a fixed width-to-height ratio using the native
 * CSS `aspect-ratio` property (no JavaScript measurement, no dependency).
 * The wrapper fills the available width; children should stretch to fill it
 * (e.g. an `<img className="h-full w-full object-cover" />`).
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="aspect-ratio"
        className={cn("relative w-full", className)}
        style={{ aspectRatio: ratio, ...style } as CSSProperties}
        {...props}
      />
    );
  },
);
AspectRatio.displayName = "AspectRatio";
