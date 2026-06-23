"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-picker"
          variant="outline"
          disabled={disabled}
          className="w-[240px] justify-start gap-2 font-normal"
        >
          <CalendarIcon className="size-4" />
          {value ? format(value, "PPP") : (placeholder ?? "Pick a date")}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Choose a date" className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
DatePicker.displayName = "DatePicker";
