import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type SVGAttributes } from "react";
import { cn } from "../lib/cn.js";

const spinnerVariants = cva("animate-spin text-current", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps
  extends SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, "aria-label": ariaLabel = "Loading", ...props }, ref) => {
    return (
      <svg
        ref={ref}
        data-slot="spinner"
        role="status"
        aria-label={ariaLabel}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>
    );
  },
);
Spinner.displayName = "Spinner";

export { spinnerVariants };
