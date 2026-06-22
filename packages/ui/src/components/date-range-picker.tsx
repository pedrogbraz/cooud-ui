"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import type { Matcher, DateRange as RdpDateRange } from "react-day-picker";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/**
 * A start/end date selection. Both ends are optional so the value can describe
 * an in-progress selection (a `from` with no `to` yet) as well as an empty one.
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/** A named shortcut rendered in the presets column. */
export interface DateRangePreset {
  /** Visible, accessible label for the preset button. */
  label: string;
  /** The range applied when the preset is chosen. */
  range: DateRange;
}

export interface DateRangePickerProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: DateRange;
  /** Initial value for uncontrolled usage. */
  defaultValue?: DateRange;
  /** Called with the new range whenever the selection changes. */
  onValueChange?: (range: DateRange | undefined) => void;
  /** Optional shortcuts shown in a column beside the calendar. */
  presets?: DateRangePreset[];
  /** Text shown on the trigger when no range is selected. */
  placeholder?: string;
  /** Disables the trigger entirely. */
  disabled?: boolean;
  /** Earliest selectable day (inclusive). */
  min?: Date;
  /** Latest selectable day (inclusive). */
  max?: Date;
  /** Extra non-selectable days, merged with `min`/`max`. */
  disabledDates?: Matcher | Matcher[];
  /** `date-fns` format token for each end of the range. */
  dateFormat?: string;
  /** Alignment of the popover against the trigger. */
  align?: ComponentPropsWithoutRef<typeof PopoverContent>["align"];
  /** Number of months shown on wider viewports. */
  numberOfMonths?: number;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the popover content. */
  contentClassName?: string;
  /** Accessible name for the trigger when there is no visible label. */
  "aria-label"?: string;
  /** ID of an element labelling the trigger. */
  "aria-labelledby"?: string;
}

function hasSelection(range: DateRange | undefined): range is DateRange {
  return Boolean(range?.from || range?.to);
}

function toMatcherList(
  min: Date | undefined,
  max: Date | undefined,
  disabledDates: Matcher | Matcher[] | undefined,
): Matcher[] {
  const matchers: Matcher[] = [];
  if (min) matchers.push({ before: min });
  if (max) matchers.push({ after: max });
  if (Array.isArray(disabledDates)) matchers.push(...disabledDates);
  else if (disabledDates !== undefined) matchers.push(disabledDates);
  return matchers;
}

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      presets,
      placeholder = "Pick a date range",
      disabled = false,
      min,
      max,
      disabledDates,
      dateFormat = "LLL dd, y",
      align = "start",
      numberOfMonths = 2,
      className,
      contentClassName,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState<DateRange | undefined>(defaultValue);

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const labelId = useId();

    const commit = useCallback(
      (next: DateRange | undefined) => {
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    // react-day-picker's range selection requires a `from`; surface that as a
    // fully-optional public shape and only feed it a valid selection.
    const handleSelect = useCallback(
      (next: RdpDateRange | undefined) => {
        commit(next ? { from: next.from, to: next.to } : undefined);
      },
      [commit],
    );

    const handlePreset = useCallback(
      (range: DateRange) => {
        commit(range);
        setOpen(false);
      },
      [commit],
    );

    const selected = useMemo<RdpDateRange | undefined>(
      () => (value?.from ? { from: value.from, to: value.to } : undefined),
      [value?.from, value?.to],
    );

    const disabledMatcher = useMemo(
      () => toMatcherList(min, max, disabledDates),
      [min, max, disabledDates],
    );

    const label = useMemo(() => {
      if (!hasSelection(value)) return placeholder;
      const from = value.from ? format(value.from, dateFormat) : "…";
      if (!value.to) return from;
      return `${from} – ${format(value.to, dateFormat)}`;
    }, [value, placeholder, dateFormat]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-slot="date-range-picker-trigger"
            className={cn(
              "w-[300px] justify-start gap-2 font-normal",
              !hasSelection(value) && "text-fg-muted",
              className,
            )}
            {...props}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          data-slot="date-range-picker-content"
          className={cn("w-auto p-0", contentClassName)}
        >
          <div className="flex flex-col sm:flex-row">
            {/*
              Names the calendar grid for assistive tech. The Calendar below
              references this element via aria-labelledby, so it must carry the
              matching id (the reference was previously dangling).
            */}
            <span id={labelId} className="sr-only">
              {placeholder}
            </span>
            {presets && presets.length > 0 ? (
              <fieldset
                data-slot="date-range-picker-presets"
                className="m-0 flex min-w-0 flex-row gap-1 border-0 border-border border-b p-2 sm:flex-col sm:border-r sm:border-b-0"
              >
                <legend className="sr-only">Date range presets</legend>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreset(preset.range)}
                    data-slot="date-range-picker-preset"
                    className="justify-start whitespace-nowrap font-normal"
                  >
                    {preset.label}
                  </Button>
                ))}
              </fieldset>
            ) : null}
            <Calendar
              mode="range"
              selected={selected}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
              defaultMonth={value?.from}
              fromDate={min}
              toDate={max}
              disabled={disabledMatcher.length > 0 ? disabledMatcher : undefined}
              aria-labelledby={labelId}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
DateRangePicker.displayName = "DateRangePicker";
