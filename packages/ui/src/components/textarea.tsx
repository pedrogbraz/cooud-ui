import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        aria-invalid={invalid ? true : ariaInvalid}
        className={cn(
          "field-sizing-content min-h-20 w-full resize-y rounded-lg border border-border bg-surface-inset px-3 py-2 text-sm text-fg",
          "placeholder:text-fg-tertiary",
          "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)]",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          "selection:bg-primary selection:text-primary-foreground",
          "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/30",
          invalid && "border-error focus-visible:ring-error focus-visible:ring-offset-surface-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
