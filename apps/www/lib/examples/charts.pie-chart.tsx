"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@cooud-ui/ui";
import { Cell, Pie, PieChart } from "recharts";

/**
 * The only recharts-touching render in this family, isolated so it can be pulled
 * in via `next/dynamic` (`ssr: false`). Keeping recharts behind a client-only
 * dynamic boundary means the chart family chunk no longer drags the recharts
 * graph into any server bundle — it streams in only when this demo mounts.
 */

const chartConfig = {
  visitors: { label: "Visitors" },
  direct: { label: "Direct", color: "var(--cooud-primary)" },
  organic: { label: "Organic", color: "var(--cooud-info)" },
  referral: { label: "Referral", color: "var(--cooud-success)" },
  social: { label: "Social", color: "var(--cooud-warning)" },
  email: { label: "Email", color: "var(--cooud-danger)" },
} satisfies ChartConfig;

const chartData = [
  { source: "direct", visitors: 4200, fill: "var(--color-direct)" },
  { source: "organic", visitors: 3100, fill: "var(--color-organic)" },
  { source: "referral", visitors: 1900, fill: "var(--color-referral)" },
  { source: "social", visitors: 1400, fill: "var(--color-social)" },
  { source: "email", visitors: 800, fill: "var(--color-email)" },
];

export default function PieChartDemo() {
  return (
    // The data is conveyed to assistive tech via this label; the SVG internals
    // (recharts tags each sector role="img" with no name) are hidden so they're
    // not announced as 13 nameless images.
    <div
      role="img"
      aria-label="Donut chart of traffic sources by visitors: Direct 4,200, Organic 3,100, Referral 1,900, Social 1,400, Email 800."
      className="h-64 w-full"
    >
      <div aria-hidden="true" className="h-full w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="source"
              innerRadius={56}
              strokeWidth={4}
              rootTabIndex={-1}
            >
              {chartData.map((entry) => (
                <Cell key={entry.source} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="source" />} />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
