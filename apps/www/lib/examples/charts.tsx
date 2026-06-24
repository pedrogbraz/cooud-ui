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

const PieChartDemo = dynamic(() => import("./charts.pie-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

const RadarChartDemo = dynamic(() => import("./charts.radar-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

const RadialChartDemo = dynamic(() => import("./charts.radial-chart"), {
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
    {
      id: "pie-chart",
      title: "Donut chart",
      description:
        "A traffic-sources donut. Each slice maps to a theme token via the ChartConfig and renders through `Cell`, with a legend and tooltip wired to the same config.",
      code: `const chartConfig = {
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

return (
  <ChartContainer config={chartConfig} className="h-64 w-full">
    <PieChart accessibilityLayer>
      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
      <Pie data={chartData} dataKey="visitors" nameKey="source" innerRadius={56} strokeWidth={4}>
        {chartData.map((entry) => (
          <Cell key={entry.source} fill={entry.fill} />
        ))}
      </Pie>
      <ChartLegend content={<ChartLegendContent nameKey="source" />} />
    </PieChart>
  </ChartContainer>
);`,
      preview: <PieChartDemo />,
    },
    {
      id: "radar-chart",
      title: "Radar chart",
      description:
        "A two-series radar comparing Current vs Target across six metrics. Each Radar reads its fill and stroke from the config token, so themes recolor both shapes at once.",
      code: `const chartConfig = {
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

return (
  <ChartContainer config={chartConfig} className="h-64 w-full">
    <RadarChart accessibilityLayer data={chartData}>
      <ChartTooltip content={<ChartTooltipContent />} />
      <PolarGrid />
      <PolarAngleAxis dataKey="metric" />
      <Radar dataKey="current" fill="var(--color-current)" fillOpacity={0.6} stroke="var(--color-current)" />
      <Radar dataKey="target" fill="var(--color-target)" fillOpacity={0.15} stroke="var(--color-target)" />
      <ChartLegend content={<ChartLegendContent />} />
    </RadarChart>
  </ChartContainer>
);`,
      preview: <RadarChartDemo />,
    },
    {
      id: "radial-chart",
      title: "Radial bar gauge",
      description:
        "Visitors-by-device drawn as concentric radial bars with rounded ring caps. The tracked `background` ring and `cornerRadius` give each device a clean gauge read.",
      code: `const chartConfig = {
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

return (
  <ChartContainer config={chartConfig} className="h-64 w-full">
    <RadialBarChart accessibilityLayer data={chartData} innerRadius={32} outerRadius={110}>
      <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="device" />} />
      <PolarGrid gridType="circle" radialLines={false} stroke="none" />
      <RadialBar dataKey="visitors" background cornerRadius={8} />
      <ChartLegend content={<ChartLegendContent nameKey="device" />} />
    </RadialBarChart>
  </ChartContainer>
);`,
      preview: <RadialChartDemo />,
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
