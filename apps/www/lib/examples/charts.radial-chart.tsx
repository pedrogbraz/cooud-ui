"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@cooud-ui/ui";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

/**
 * The only recharts-touching render in this family, isolated so it can be pulled
 * in via `next/dynamic` (`ssr: false`). Keeping recharts behind a client-only
 * dynamic boundary means the chart family chunk no longer drags the recharts
 * graph into any server bundle — it streams in only when this demo mounts.
 */

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--cooud-primary)" },
  mobile: { label: "Mobile", color: "var(--cooud-info)" },
  tablet: { label: "Tablet", color: "var(--cooud-success)" },
  other: { label: "Other", color: "var(--cooud-warning)" },
} satisfies ChartConfig;

const chartData = [
  { device: "desktop", visitors: 5200, fill: "var(--color-desktop)" },
  { device: "mobile", visitors: 4100, fill: "var(--color-mobile)" },
  { device: "tablet", visitors: 1800, fill: "var(--color-tablet)" },
  { device: "other", visitors: 900, fill: "var(--color-other)" },
];

export default function RadialChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <RadialBarChart accessibilityLayer data={chartData} innerRadius={32} outerRadius={110}>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="device" />} />
        <PolarGrid gridType="circle" radialLines={false} stroke="none" />
        <RadialBar dataKey="visitors" background cornerRadius={8} />
        <ChartLegend content={<ChartLegendContent nameKey="device" />} />
      </RadialBarChart>
    </ChartContainer>
  );
}
