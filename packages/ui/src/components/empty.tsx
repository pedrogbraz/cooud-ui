import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export const Empty = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty"
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-inset/40 px-6 py-12 text-center",
          className,
        )}
        {...props}
      />
    );
  },
);
Empty.displayName = "Empty";

export const EmptyIcon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-icon"
        className={cn(
          "flex size-11 items-center justify-center rounded-full bg-surface-overlay text-fg-tertiary [&_svg]:size-5",
          className,
        )}
        {...props}
      />
    );
  },
);
EmptyIcon.displayName = "EmptyIcon";

export const EmptyTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-title"
        className={cn("font-display text-sm font-semibold text-fg", className)}
        {...props}
      />
    );
  },
);
EmptyTitle.displayName = "EmptyTitle";

export const EmptyDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-description"
        className={cn("max-w-sm text-sm text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
EmptyDescription.displayName = "EmptyDescription";

export const EmptyContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-content"
        className={cn("mt-1 flex items-center gap-2", className)}
        {...props}
      />
    );
  },
);
EmptyContent.displayName = "EmptyContent";
