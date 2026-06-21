import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export const Shimmer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="shimmer"
        aria-hidden
        className={cn("relative overflow-hidden rounded-md bg-surface-overlay", className)}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {children}
      </div>
    );
  },
);
Shimmer.displayName = "Shimmer";
