import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="input"
        aria-invalid={invalid ? true : ariaInvalid}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border bg-surface-inset px-3 text-sm text-fg",
          "placeholder:text-fg-tertiary",
          "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)]",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          "selection:bg-primary selection:text-primary-foreground",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg",
          "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/30",
          invalid && "border-error focus-visible:ring-error focus-visible:ring-offset-surface-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
