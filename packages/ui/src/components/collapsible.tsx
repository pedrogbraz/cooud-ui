import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export const CollapsibleContent = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden text-sm text-fg-secondary transition-[height] duration-200 ease-[var(--ease-out-quart)] data-[state=closed]:h-0 data-[state=open]:h-[var(--radix-collapsible-content-height)] motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";
