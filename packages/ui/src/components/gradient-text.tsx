import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const GradientText = forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        data-slot="gradient-text"
        className={cn("bg-gradient-primary bg-clip-text text-transparent", className)}
        {...props}
      />
    );
  },
);
GradientText.displayName = "GradientText";
