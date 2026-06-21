import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface GradientBorderProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
  glow?: boolean;
}

export const GradientBorder = forwardRef<HTMLDivElement, GradientBorderProps>(
  ({ className, innerClassName, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="gradient-border"
        className={cn("rounded-2xl bg-gradient-primary p-px", glow && "shadow-glow", className)}
        {...props}
      >
        <div className={cn("h-full w-full rounded-[inherit] bg-surface-raised", innerClassName)}>
          {children}
        </div>
      </div>
    );
  },
);
GradientBorder.displayName = "GradientBorder";
