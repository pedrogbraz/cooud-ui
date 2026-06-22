"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { forwardRef, useCallback, useId, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** The list of selectable options. */
  options: ComboboxOption[];
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Text shown on the trigger when nothing is selected. */
  placeholder?: string;
  /** Placeholder for the search input inside the popover. */
  searchPlaceholder?: string;
  /** Message rendered when no option matches the search. */
  emptyText?: string;
  /** Disables the trigger entirely. */
  disabled?: boolean;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the popover content. */
  contentClassName?: string;
  /** Accessible name for the trigger when there is no visible label. */
  "aria-label"?: string;
  /** ID of an element labelling the trigger. */
  "aria-labelledby"?: string;
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onValueChange,
      placeholder = "Select an option…",
      searchPlaceholder = "Search…",
      emptyText = "No results found.",
      disabled = false,
      className,
      contentClassName,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const listId = useId();

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value],
    );

    const handleSelect = useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
        setOpen(false);
      },
      [isControlled, onValueChange],
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            disabled={disabled}
            data-slot="combobox-trigger"
            className={cn(
              "w-full justify-between font-normal",
              !selectedOption && "text-fg-muted",
              className,
            )}
            {...props}
          >
            <span className="truncate">{selectedOption?.label ?? placeholder}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          data-slot="combobox-content"
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-[8rem] p-0",
            contentClassName,
          )}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList id={listId}>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option.value)}
                    aria-selected={isSelected}
                  >
                    <Check
                      className={cn("size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                      aria-hidden="true"
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
Combobox.displayName = "Combobox";
