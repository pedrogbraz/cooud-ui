"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  DataTable,
  DatePicker,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Kbd,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Cluster, Section, Subcard } from "./showcase-ui";

export function DataGallery() {
  return (
    <div className="mt-16 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
          Data &amp; Display
        </h2>
        <p className="max-w-2xl text-sm text-fg-secondary">
          Wave 3 — tables, charts, metrics, and the surfaces that present real data. Every component
          is token-driven and theme-aware.
        </p>
      </div>

      <MetricSection />
      <TableSection />
      <DataTableSection />
      <PaginationSection />
      <AvatarSection />
      <ProgressSection />
      <ScrollAreaSection />
      <CalendarSection />
      <ChartSection />
      <EmptySection />
      <KbdSection />
    </div>
  );
}

// ── 1. Metric ──────────────────────────────────────────────────────
function MetricSection() {
  const metrics = [
    { label: "Revenue", value: "$48,290", delta: "+12.5%", trend: "up" as const },
    { label: "New users", value: "1,204", delta: "+3.2%", trend: "up" as const },
    { label: "Churn", value: "2.1%", delta: "-0.4%", trend: "down" as const },
    { label: "Sessions", value: "9,830", delta: "0.0%", trend: "neutral" as const },
  ];

  return (
    <Section
      title="Metric"
      description="Compact KPI tiles pairing a label, a value, and a trend-aware delta."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Subcard key={metric.label} label={metric.label}>
            <Metric>
              <MetricLabel className="sr-only">{metric.label}</MetricLabel>
              <MetricValue>{metric.value}</MetricValue>
              <MetricDelta trend={metric.trend}>{metric.delta}</MetricDelta>
            </Metric>
          </Subcard>
        ))}
      </div>
    </Section>
  );
}

// ── 2. Table ───────────────────────────────────────────────────────
function TableSection() {
  const invoices = [
    { invoice: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
    { invoice: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
    { invoice: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
    { invoice: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
    { invoice: "INV-005", status: "Paid", method: "PayPal", amount: "$550.00" },
  ];

  return (
    <Section
      title="Table"
      description="A styled static table with a header, body, footer, and an accessible caption."
    >
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right font-mono tabular-nums">$1,750.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Section>
  );
}

// ── 3. DataTable ───────────────────────────────────────────────────
type Payment = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  amount: number;
};

const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="capitalize">{row.getValue("status")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="lowercase">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(String(row.getValue("amount")));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="font-mono tabular-nums">{formatted}</span>;
    },
  },
];

const paymentData: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "p0r9twq2", amount: 459, status: "pending", email: "jason.lee@example.com" },
];

function DataTableSection() {
  return (
    <Section
      title="Data Table"
      description="A TanStack-powered table with a sortable Amount column — click the header to sort."
    >
      <DataTable columns={paymentColumns} data={paymentData} />
    </Section>
  );
}

// ── 4. Pagination ──────────────────────────────────────────────────
function PaginationSection() {
  return (
    <Section
      title="Pagination"
      description="A paginator with previous/next controls, page links, and a truncating ellipsis."
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Section>
  );
}

// ── 5. Avatar ──────────────────────────────────────────────────────
function AvatarSection() {
  return (
    <Section
      title="Avatar"
      description="A user image with a graceful initials fallback when the image is unavailable."
    >
      <Cluster label="With image &amp; fallbacks">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://broken.example/none.png" alt="Ada Lovelace" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
      </Cluster>
    </Section>
  );
}

// ── 6. Progress ────────────────────────────────────────────────────
function ProgressSection() {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(66), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Section
      title="Progress"
      description="Determinate progress bars — the middle bar animates in on mount."
    >
      <div className="flex flex-col gap-6">
        <Subcard label="30%">
          <Progress value={30} />
        </Subcard>
        <Subcard label="66% · animated">
          <Progress value={animated} />
        </Subcard>
        <Subcard label="100%">
          <Progress value={100} />
        </Subcard>
      </div>
    </Section>
  );
}

// ── 7. ScrollArea ──────────────────────────────────────────────────
function ScrollAreaSection() {
  const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${20 - index}`);

  return (
    <Section
      title="Scroll Area"
      description="A fixed-height viewport with a styled, theme-aware vertical scrollbar."
    >
      <ScrollArea className="h-48 w-full max-w-xs rounded-xl border border-border-soft bg-surface-inset">
        <div className="flex flex-col gap-1 p-4">
          <span className="mb-2 text-xs font-medium uppercase tracking-wider text-fg-tertiary">
            Tags
          </span>
          {tags.map((tag) => (
            <div
              key={tag}
              className="rounded-md px-2 py-1.5 font-mono text-sm text-fg-secondary hover:bg-surface-overlay"
            >
              {tag}
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Section>
  );
}

// ── 8. Calendar + DatePicker ───────────────────────────────────────
function CalendarSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [picked, setPicked] = useState<Date | undefined>();

  return (
    <Section
      title="Calendar & Date Picker"
      description="A controlled single-date calendar beside a popover-based date picker."
    >
      <div className="flex flex-wrap items-start gap-8">
        <Subcard label="Calendar">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
        </Subcard>
        <Subcard label="Date picker">
          <div className="flex flex-col gap-3">
            <DatePicker value={picked} onChange={setPicked} placeholder="Pick a date" />
            <span className="text-sm text-fg-tertiary">
              {picked ? `Selected: ${picked.toLocaleDateString()}` : "No date selected yet."}
            </span>
          </div>
        </Subcard>
      </div>
    </Section>
  );
}

// ── 9. Chart ───────────────────────────────────────────────────────
const chartConfig = {
  revenue: { label: "Revenue", color: "var(--cooud-primary)" },
  profit: { label: "Profit", color: "var(--cooud-accent)" },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", revenue: 4200, profit: 1400 },
  { month: "Feb", revenue: 3800, profit: 1100 },
  { month: "Mar", revenue: 5200, profit: 1900 },
  { month: "Apr", revenue: 4900, profit: 1700 },
  { month: "May", revenue: 6100, profit: 2400 },
  { month: "Jun", revenue: 7300, profit: 3100 },
];

function ChartSection() {
  return (
    <Section
      title="Chart"
      description="A recharts bar chart composed inside ChartContainer with token-colored series."
    >
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Section>
  );
}

// ── 10. Empty ──────────────────────────────────────────────────────
function EmptySection() {
  return (
    <Section
      title="Empty"
      description="A composable empty-state for zero-data views, with an icon, copy, and an action."
    >
      <Empty>
        <EmptyIcon>
          <Inbox aria-hidden="true" />
        </EmptyIcon>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          When someone sends you a message, it will show up here. Start a conversation to get going.
        </EmptyDescription>
        <EmptyContent>
          <Button>New message</Button>
        </EmptyContent>
      </Empty>
    </Section>
  );
}

// ── 11. Kbd + Breadcrumb ───────────────────────────────────────────
function KbdSection() {
  return (
    <Section
      title="Kbd & Breadcrumb"
      description="Keyboard-key hints and a navigational breadcrumb trail."
    >
      <div className="flex flex-col gap-6">
        <Cluster label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Data</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Cluster>

        <Cluster label="Keyboard keys">
          <span className="inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
          <Kbd>Esc</Kbd>
          <Kbd>↵</Kbd>
        </Cluster>
      </div>
    </Section>
  );
}
