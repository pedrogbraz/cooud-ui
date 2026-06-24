import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

const frameVariants = cva(
  "overflow-hidden rounded-xl border border-border bg-surface-raised shadow-sm",
);

export interface FrameProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {
  /** Chrome style. `browser` shows an address bar; `window` is a plain title bar. */
  variant?: "browser" | "window";
  /** URL shown in the address bar (browser variant only). */
  url?: string;
}

export const Frame = forwardRef<HTMLDivElement, FrameProps>(
  ({ variant = "browser", url, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="frame"
        data-variant={variant}
        className={cn(frameVariants(), className)}
        {...props}
      >
        <div
          data-slot="frame-chrome"
          className="flex items-center gap-3 border-b border-border bg-surface-inset px-3 py-2"
        >
          <div aria-hidden className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-error" />
            <span className="size-3 rounded-full bg-warning" />
            <span className="size-3 rounded-full bg-success" />
          </div>
          {variant === "browser" ? (
            <div
              data-slot="frame-address-bar"
              className="mx-auto max-w-full truncate rounded-md bg-surface-raised px-3 py-1 text-xs text-fg-tertiary"
            >
              {url}
            </div>
          ) : null}
        </div>
        <div data-slot="frame-content" className="text-fg">
          {children}
        </div>
      </div>
    );
  },
);
Frame.displayName = "Frame";
