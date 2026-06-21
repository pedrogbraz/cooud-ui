import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/cn.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background,border-color,box-shadow,transform,opacity] duration-150 ease-[var(--ease-out-quart)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-xs",
        gradient:
          "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:opacity-95 shadow-xs",
        secondary: "bg-surface-overlay text-fg border border-border hover:border-border-strong",
        outline: "border border-border text-fg hover:bg-surface-overlay",
        ghost: "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
        destructive: "bg-error text-white hover:opacity-90 shadow-xs",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-xs [&_svg]:size-3.5",
        md: "h-10 px-4 [&_svg]:size-4",
        lg: "h-11 px-6 text-base [&_svg]:size-4",
        icon: "size-9 [&_svg]:size-4",
        "icon-sm": "size-8 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        type={asChild ? undefined : (type ?? "button")}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
