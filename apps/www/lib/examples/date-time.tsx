"use client";

import { Calendar, DatePicker } from "@cooud/ui";
import { useState } from "react";
import type { ExampleMap } from "./types";

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

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const dateTimeExamples: ExampleMap = {
  calendar: [
    {
      id: "single-date",
      title: "Single date",
      description: "A controlled calendar in single-select mode. Click a day to update the value.",
      code: `const [date, setDate] = useState<Date | undefined>(new Date());

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
};
