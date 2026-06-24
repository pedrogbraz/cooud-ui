"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@cooud-ui/ui";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

/**
 * The only recharts-touching render in this family, isolated so it can be pulled
 * in via `next/dynamic` (`ssr: false`). Keeping recharts behind a client-only
 * dynamic boundary means the chart family chunk no longer drags the recharts
 * graph into any server bundle — it streams in only when this demo mounts.
 */

const chartConfig = {
  current: { label: "Current", color: "var(--cooud-primary)" },
  target: { label: "Target", color: "var(--cooud-info)" },
} satisfies ChartConfig;

const chartData = [
  { metric: "Speed", current: 86, target: 95 },
  { metric: "Reliability", current: 72, target: 90 },
  { metric: "Coverage", current: 91, target: 88 },
  { metric: "Security", current: 78, target: 96 },
  { metric: "Usability", current: 84, target: 80 },
  { metric: "Support", current: 69, target: 85 },
];

export default function RadarChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <RadarChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <Radar
          dataKey="current"
          fill="var(--color-current)"
          fillOpacity={0.6}
          stroke="var(--color-current)"
        />
        <Radar
          dataKey="target"
          fill="var(--color-target)"
          fillOpacity={0.15}
          stroke="var(--color-target)"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}
