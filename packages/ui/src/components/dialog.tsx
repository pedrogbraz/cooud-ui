import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-[cooud-overlay-in_200ms_var(--ease-out-quart)] data-[state=closed]:animate-[cooud-overlay-out_160ms_var(--ease-out-quart)]",
        className,
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "fixed inset-0 z-50 m-auto grid h-fit w-full max-w-lg gap-4 rounded-xl border border-border bg-surface-floating p-6 text-fg shadow-lg data-[state=open]:animate-[cooud-pop-in_200ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cooud-pop-out_160ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className="absolute right-4 top-4 rounded-md text-fg-tertiary outline-none transition-opacity hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
};
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
};
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("font-display text-lg font-semibold text-fg", className)}
      {...props}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn("text-sm text-fg-secondary", className)}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";
