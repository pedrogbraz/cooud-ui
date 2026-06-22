"use client";

import dynamic from "next/dynamic";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Chart demo (lazy)                                                         */
/* -------------------------------------------------------------------------- */

/**
 * recharts is heavy and purely client-visual, so the live BarChart is split into
 * its own client-only chunk and pulled in via `next/dynamic` (`ssr: false`).
 * recharts therefore never enters the first-load JS of routes that don't render
 * a chart, and even on a chart slug it streams in after hydration behind a
 * height-matched skeleton (no layout shift, same visual once mounted).
 */
function ChartSkeleton() {
  return (
    <div
      className="h-64 w-full animate-pulse rounded-lg border border-border bg-surface-inset/50"
      aria-hidden="true"
    />
  );
}

const BarChartDemo = dynamic(() => import("./charts.bar-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

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

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function ChartsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={chartsExamples[slug] ?? []} />;
}
