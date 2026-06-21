import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        aria-hidden
        className={cn("animate-pulse rounded-md bg-surface-overlay", className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";
