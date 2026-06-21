"use client";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@cooud/ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Chart demo                                                                */
/* -------------------------------------------------------------------------- */

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--cooud-primary)" },
  profit: { label: "Profit", color: "var(--cooud-info)" },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", revenue: 4200, profit: 1400 },
  { month: "Feb", revenue: 3800, profit: 1100 },
  { month: "Mar", revenue: 5200, profit: 1900 },
  { month: "Apr", revenue: 4900, profit: 1700 },
  { month: "May", revenue: 6100, profit: 2400 },
  { month: "Jun", revenue: 7300, profit: 3100 },
];

function BarChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const chartsExamples: ExampleMap = {
  chart: [
    {
      id: "bar-chart",
      title: "Bar chart",
      description:
        "A recharts BarChart composed inside ChartContainer. The ChartConfig maps each series to a theme token, exposed to bars as `var(--color-*)`.",
      code: `const chartConfig = {
  revenue: { label: "Revenue", color: "var(--cooud-primary)" },
  profit: { label: "Profit", color: "var(--cooud-info)" },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", revenue: 4200, profit: 1400 },
  { month: "Feb", revenue: 3800, profit: 1100 },
  { month: "Mar", revenue: 5200, profit: 1900 },
  { month: "Apr", revenue: 4900, profit: 1700 },
  { month: "May", revenue: 6100, profit: 2400 },
  { month: "Jun", revenue: 7300, profit: 3100 },
];

return (
  <ChartContainer config={chartConfig} className="h-64 w-full">
    <BarChart accessibilityLayer data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
    </BarChart>
  </ChartContainer>
);`,
      preview: <BarChartDemo />,
    },
  ],
};
