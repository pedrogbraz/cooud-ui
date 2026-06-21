import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none data-[state=on]:bg-surface-overlay data-[state=on]:text-fg text-fg-secondary hover:bg-surface-overlay/60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-border",
      },
      size: {
        sm: "h-8 px-2",
        md: "h-10 px-3",
        lg: "h-11 px-4",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ToggleProps
  extends ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = forwardRef<ComponentRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <TogglePrimitive.Root
        ref={ref}
        data-slot="toggle"
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Toggle.displayName = "Toggle";

export { toggleVariants };
