import * as SliderPrimitive from "@radix-ui/react-slider";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

export const Slider = forwardRef<
  ComponentRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const values = props.value ?? props.defaultValue ?? [props.min ?? 0];

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-overlay">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: thumb count is positional and stable
          key={index}
          className="block size-4 rounded-full border border-primary bg-surface-base shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = "Slider";
