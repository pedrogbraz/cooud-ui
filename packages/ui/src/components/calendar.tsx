"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { type ChevronProps, DayButton, type DayButtonProps, DayPicker } from "react-day-picker";
import { cn } from "../lib/cn.js";
import { buttonVariants } from "./button.js";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/** Navigation (and dropdown) chevron, sized to match the v8 icons. */
function CalendarChevron({ orientation = "left" }: ChevronProps) {
  const Icon = {
    up: ChevronUp,
    down: ChevronDown,
    left: ChevronLeft,
    right: ChevronRight,
  }[orientation];
  return <Icon className="size-4" />;
}

/**
 * react-day-picker v9+ hangs the selection/flag modifiers on the grid cell
 * (`td`) instead of the day button, while our ghost-variant button paints its
 * own text colour on top. To keep the established look (rounded primary chip
 * for selected days, muted outside/disabled days) the modifier styling is
 * re-applied on the button itself, where `cn` resolves conflicts
 * deterministically.
 */
function CalendarDayButton({ className, ...props }: DayButtonProps) {
  const { modifiers } = props;
  return (
    <DayButton
      {...props}
      className={cn(
        className,
        modifiers.today && "bg-surface-overlay text-fg",
        modifiers.outside && "day-outside text-fg-muted",
        modifiers.disabled && "text-fg-muted opacity-60",
        // Range middles stay transparent so the cell's overlay strip shows.
        modifiers.range_middle && "bg-transparent text-fg opacity-100 hover:bg-transparent",
        modifiers.selected &&
          !modifiers.range_middle &&
          "bg-primary text-primary-foreground opacity-100 hover:bg-primary",
      )}
    />
  );
}

export function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      // react-day-picker DayPickerProps does not extend HTMLAttributes, so the
      // data-slot marker rides on the "calendar" class rather than a typed attribute.
      showOutsideDays={showOutsideDays}
      className={cn("calendar p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-fg",
        // v9+ wraps both buttons in a single <nav>; it overlays the caption row
        // (out of flow) so the buttons keep their absolute logical offsets.
        nav: "absolute inset-x-0 top-0 flex items-center gap-1",
        // Logical (start/end) utilities so nav buttons and range rounding
        // follow the writing direction under dir="rtl".
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 p-0 opacity-60 hover:opacity-100 absolute start-1 top-0",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 p-0 opacity-60 hover:opacity-100 absolute end-1 top-0",
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-fg-tertiary rounded-md w-9 font-normal text-xs",
        week: "flex w-full mt-2",
        // The cell itself now carries `aria-selected`/`data-*` state (the v8
        // :has() hooks are gone), so the range strip + rounding read those.
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 aria-selected:bg-surface-overlay data-outside:aria-selected:bg-surface-overlay/50 first:aria-selected:rounded-s-md last:aria-selected:rounded-e-md",
        day_button: cn(buttonVariants({ variant: "ghost" }), "size-9 p-0 font-normal"),
        range_start: "day-range-start",
        range_end: "day-range-end rounded-e-md",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        ...components,
      }}
      // `locale` (a date-fns Locale), `dir`, etc. are native DayPicker props
      // forwarded here — month captions, weekday names and nav labels localize.
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
