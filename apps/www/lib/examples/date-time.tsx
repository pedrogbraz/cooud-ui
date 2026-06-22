"use client";

import { Calendar, DatePicker, type DateRange, DateRangePicker } from "@cooud/ui";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

// Fixed anchor date so SSR + client render the same labels (no hydration drift).
const RANGE_ANCHOR = new Date(2026, 5, 21);

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

/* -------------------------------------------------------------------------- */
/*  Stateful demos                                                            */
/* -------------------------------------------------------------------------- */

function CalendarDemo() {
  // Fixed initial date so server and client render identically (no hydration drift).
  const [date, setDate] = useState<Date | undefined>(() => new Date(2026, 5, 21));
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />;
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div className="flex flex-col gap-3">
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
      <span className="text-sm text-fg-tertiary">
        {date ? `Selected: ${date.toLocaleDateString()}` : "No date selected yet."}
      </span>
    </div>
  );
}

function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: RANGE_ANCHOR,
    to: addDays(RANGE_ANCHOR, 6),
  }));
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      numberOfMonths={1}
      aria-label="Pick a date range"
    />
  );
}

function DateRangePickerPresetsDemo() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      numberOfMonths={1}
      aria-label="Pick a reporting range"
      presets={[
        { label: "Last 7 days", range: { from: addDays(RANGE_ANCHOR, -6), to: RANGE_ANCHOR } },
        { label: "Last 30 days", range: { from: addDays(RANGE_ANCHOR, -29), to: RANGE_ANCHOR } },
        {
          label: "This week",
          range: { from: RANGE_ANCHOR, to: addDays(RANGE_ANCHOR, 6) },
        },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const dateTimeExamples: ExampleMap = {
  calendar: [
    {
      id: "single-date",
      title: "Single date",
      description: "A controlled calendar in single-select mode. Click a day to update the value.",
      code: `// Fixed initial date keeps SSR + client identical (avoids hydration drift).
const [date, setDate] = useState<Date | undefined>(() => new Date(2026, 5, 21));

return (
  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
);`,
      preview: <CalendarDemo />,
    },
  ],
  "date-picker": [
    {
      id: "pick-a-date",
      title: "Pick a date",
      description: "A popover-based picker. Pass `value` and `onChange` to control the selection.",
      code: `const [date, setDate] = useState<Date | undefined>();

return (
  <div className="flex flex-col gap-3">
    <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
    <span className="text-sm text-fg-tertiary">
      {date ? \`Selected: \${date.toLocaleDateString()}\` : "No date selected yet."}
    </span>
  </div>
);`,
      preview: <DatePickerDemo />,
    },
  ],
  "date-range-picker": [
    {
      id: "range",
      title: "Date range",
      description:
        "A controlled start/end selection in a popover. Pass `value` and `onValueChange`; both ends are optional so an in-progress selection is valid.",
      code: `const [range, setRange] = useState<DateRange | undefined>(() => ({
  from: new Date(2026, 5, 21),
  to: new Date(2026, 5, 27),
}));

return (
  <DateRangePicker
    value={range}
    onValueChange={setRange}
    numberOfMonths={1}
    aria-label="Pick a date range"
  />
);`,
      preview: <DateRangePickerDemo />,
    },
    {
      id: "presets",
      title: "With presets",
      description:
        "Add a `presets` column of named shortcuts beside the calendar — ideal for reporting ranges like the last 7 or 30 days.",
      code: `const [range, setRange] = useState<DateRange | undefined>();

return (
  <DateRangePicker
    value={range}
    onValueChange={setRange}
    numberOfMonths={1}
    aria-label="Pick a reporting range"
    presets={[
      { label: "Last 7 days", range: { from: addDays(today, -6), to: today } },
      { label: "Last 30 days", range: { from: addDays(today, -29), to: today } },
      { label: "This week", range: { from: today, to: addDays(today, 6) } },
    ]}
  />
);`,
      preview: <DateRangePickerPresetsDemo />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function DateTimeExamples({ slug }: { slug: string }) {
  return <ExampleList examples={dateTimeExamples[slug] ?? []} />;
}
