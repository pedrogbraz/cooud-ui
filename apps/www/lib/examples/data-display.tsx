"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DataTable,
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
  ScrollArea,
  ScrollBar,
  Separator,
  Skeleton,
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
import { ArrowUpDown, Check, Inbox } from "lucide-react";
import type { ExampleMap } from "./types";

// ── DataTable demo data ───────────────────────────────────────────────
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

export const dataDisplayExamples: ExampleMap = {
  avatar: [
    {
      id: "image-fallback",
      title: "Image & fallback",
      description: "A user image that degrades to initials when the source fails to load.",
      code: `<div className="flex items-center gap-4">
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
</div>`,
      preview: (
        <div className="flex items-center gap-4">
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
        </div>
      ),
    },
    {
      id: "group",
      title: "Group",
      description: "A stack of overlapping avatars with a ring to separate each layer.",
      code: `<div className="flex -space-x-3">
  {["CN", "AL", "JL", "MK"].map((initials) => (
    <Avatar key={initials} className="ring-2 ring-surface">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  ))}
  <Avatar className="ring-2 ring-surface">
    <AvatarFallback className="text-xs">+5</AvatarFallback>
  </Avatar>
</div>`,
      preview: (
        <div className="flex -space-x-3">
          {["CN", "AL", "JL", "MK"].map((initials) => (
            <Avatar key={initials} className="ring-2 ring-surface">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar className="ring-2 ring-surface">
            <AvatarFallback className="text-xs">+5</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
  ],

  badge: [
    {
      id: "variants",
      title: "Variants",
      description: "Compact status and category labels across the semantic palette.",
      code: `<div className="flex flex-wrap gap-2">
  <Badge variant="default">Default</Badge>
  <Badge variant="primary">Primary</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
  <Badge variant="info">Info</Badge>
</div>`,
      preview: (
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      ),
    },
    {
      id: "with-icon",
      title: "With icon",
      description: "Pair a leading icon with the label to reinforce meaning.",
      code: `<Badge variant="success">
  <Check aria-hidden="true" />
  Verified
</Badge>`,
      preview: (
        <Badge variant="success">
          <Check aria-hidden="true" />
          Verified
        </Badge>
      ),
    },
  ],

  card: [
    {
      id: "anatomy",
      title: "Anatomy",
      description: "A composable container with header, action, content, and footer slots.",
      code: `<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Pro plan</CardTitle>
    <CardDescription>Everything you need to ship a polished product.</CardDescription>
    <CardAction>
      <Badge variant="primary">Popular</Badge>
    </CardAction>
  </CardHeader>
  <CardContent className="flex items-baseline gap-1">
    <span className="font-display text-3xl font-semibold text-fg">$24</span>
    <span className="text-sm text-fg-tertiary">/ month</span>
  </CardContent>
  <CardFooter>
    <Button variant="gradient" className="w-full">
      Upgrade now
    </Button>
  </CardFooter>
</Card>`,
      preview: (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Pro plan</CardTitle>
            <CardDescription>Everything you need to ship a polished product.</CardDescription>
            <CardAction>
              <Badge variant="primary">Popular</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$24</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </CardContent>
          <CardFooter>
            <Button variant="gradient" className="w-full">
              Upgrade now
            </Button>
          </CardFooter>
        </Card>
      ),
    },
  ],

  table: [
    {
      id: "basic",
      title: "Basic",
      description: "A styled static table with a header, body, footer, and an accessible caption.",
      code: `<Table>
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
      <TableCell className="text-right font-mono tabular-nums">$1,200.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`,
      preview: (
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
            {[
              { invoice: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
              { invoice: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
              { invoice: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
              { invoice: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
            ].map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.method}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {invoice.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right font-mono tabular-nums">$1,200.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
  ],

  "data-table": [
    {
      id: "sortable",
      title: "Sortable",
      description:
        "A TanStack-powered table with a sortable Amount column — click the header to sort.",
      code: `type Payment = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  amount: number;
};

const columns: ColumnDef<Payment>[] = [
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

const data: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "p0r9twq2", amount: 459, status: "pending", email: "jason.lee@example.com" },
];

<DataTable columns={columns} data={data} />`,
      preview: <DataTable columns={paymentColumns} data={paymentData} />,
    },
  ],

  metric: [
    {
      id: "stat-tiles",
      title: "Stat tiles",
      description: "Compact KPI tiles pairing a label, a value, and a trend-aware delta.",
      code: `<div className="grid gap-4 sm:grid-cols-3">
  <Metric>
    <MetricLabel>Revenue</MetricLabel>
    <MetricValue>$48,290</MetricValue>
    <MetricDelta trend="up">+12.5%</MetricDelta>
  </Metric>
  <Metric>
    <MetricLabel>Churn</MetricLabel>
    <MetricValue>2.1%</MetricValue>
    <MetricDelta trend="down">-0.4%</MetricDelta>
  </Metric>
  <Metric>
    <MetricLabel>Sessions</MetricLabel>
    <MetricValue>9,830</MetricValue>
    <MetricDelta trend="neutral">0.0%</MetricDelta>
  </Metric>
</div>`,
      preview: (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric>
            <MetricLabel>Revenue</MetricLabel>
            <MetricValue>$48,290</MetricValue>
            <MetricDelta trend="up">+12.5%</MetricDelta>
          </Metric>
          <Metric>
            <MetricLabel>Churn</MetricLabel>
            <MetricValue>2.1%</MetricValue>
            <MetricDelta trend="down">-0.4%</MetricDelta>
          </Metric>
          <Metric>
            <MetricLabel>Sessions</MetricLabel>
            <MetricValue>9,830</MetricValue>
            <MetricDelta trend="neutral">0.0%</MetricDelta>
          </Metric>
        </div>
      ),
    },
  ],

  kbd: [
    {
      id: "keys",
      title: "Keys",
      description: "Keyboard-key hints, on their own or combined into a chord.",
      code: `<div className="flex items-center gap-3">
  <span className="inline-flex items-center gap-1">
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </span>
  <Kbd>Esc</Kbd>
  <Kbd>↵</Kbd>
</div>`,
      preview: (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
          <Kbd>Esc</Kbd>
          <Kbd>↵</Kbd>
        </div>
      ),
    },
  ],

  empty: [
    {
      id: "empty-state",
      title: "Empty state",
      description:
        "A composable empty-state for zero-data views, with an icon, copy, and an action.",
      code: `<Empty>
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
</Empty>`,
      preview: (
        <Empty>
          <EmptyIcon>
            <Inbox aria-hidden="true" />
          </EmptyIcon>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            When someone sends you a message, it will show up here. Start a conversation to get
            going.
          </EmptyDescription>
          <EmptyContent>
            <Button>New message</Button>
          </EmptyContent>
        </Empty>
      ),
    },
  ],

  separator: [
    {
      id: "horizontal-vertical",
      title: "Horizontal & vertical",
      description: "A divider that adapts to either orientation.",
      code: `<div className="flex flex-col gap-3">
  <span className="text-sm text-fg-secondary">Section A</span>
  <Separator />
  <span className="text-sm text-fg-secondary">Section B</span>
  <div className="flex h-10 items-center gap-3 text-sm text-fg-secondary">
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>API</span>
    <Separator orientation="vertical" />
    <span>Blog</span>
  </div>
</div>`,
      preview: (
        <div className="flex flex-col gap-3">
          <span className="text-sm text-fg-secondary">Section A</span>
          <Separator />
          <span className="text-sm text-fg-secondary">Section B</span>
          <div className="flex h-10 items-center gap-3 text-sm text-fg-secondary">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>API</span>
            <Separator orientation="vertical" />
            <span>Blog</span>
          </div>
        </div>
      ),
    },
  ],

  skeleton: [
    {
      id: "loading-card",
      title: "Loading card",
      description: "Placeholder shapes that mirror content while it loads.",
      code: `<div className="flex items-center gap-3">
  <Skeleton className="size-12 rounded-full" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-3 w-3/4 rounded-md" />
    <Skeleton className="h-3 w-1/2 rounded-md" />
  </div>
</div>`,
      preview: (
        <div className="flex w-full max-w-xs items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ),
    },
  ],

  "scroll-area": [
    {
      id: "scrollable-list",
      title: "Scrollable list",
      description: "A fixed-height viewport with a styled, theme-aware vertical scrollbar.",
      code: `const tags = Array.from({ length: 20 }, (_, index) => \`v1.2.0-beta.\${20 - index}\`);

<ScrollArea className="h-48 w-full max-w-xs rounded-xl border border-border-soft bg-surface-inset">
  <div className="flex flex-col gap-1 p-4">
    {tags.map((tag) => (
      <div key={tag} className="rounded-md px-2 py-1.5 font-mono text-sm text-fg-secondary">
        {tag}
      </div>
    ))}
  </div>
  <ScrollBar orientation="vertical" />
</ScrollArea>`,
      preview: (
        <ScrollArea className="h-48 w-full max-w-xs rounded-xl border border-border-soft bg-surface-inset">
          <div className="flex flex-col gap-1 p-4">
            {Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${20 - index}`).map((tag) => (
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
      ),
    },
  ],
};
