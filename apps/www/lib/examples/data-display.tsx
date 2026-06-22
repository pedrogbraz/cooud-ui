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
  DataTableColumnHeader,
  type DataTableFacetedFilter,
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
import { ArrowUpDown, Check, CircleDashed, CircleSlash, Inbox, Mail } from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
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

// ── DataTable Pro demo data — a "team members" directory ──────────────
type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "active" | "invited" | "suspended";
  seats: number;
};

const memberData: Member[] = [
  {
    id: "u-1024",
    name: "Ada Lovelace",
    email: "ada@cooud.dev",
    role: "Owner",
    status: "active",
    seats: 5,
  },
  {
    id: "u-1025",
    name: "Grace Hopper",
    email: "grace@cooud.dev",
    role: "Admin",
    status: "active",
    seats: 3,
  },
  {
    id: "u-1026",
    name: "Alan Turing",
    email: "alan@cooud.dev",
    role: "Member",
    status: "active",
    seats: 1,
  },
  {
    id: "u-1027",
    name: "Katherine Johnson",
    email: "katherine@cooud.dev",
    role: "Member",
    status: "invited",
    seats: 1,
  },
  {
    id: "u-1028",
    name: "Margaret Hamilton",
    email: "margaret@cooud.dev",
    role: "Admin",
    status: "active",
    seats: 2,
  },
  {
    id: "u-1029",
    name: "Dennis Ritchie",
    email: "dennis@cooud.dev",
    role: "Viewer",
    status: "suspended",
    seats: 0,
  },
  {
    id: "u-1030",
    name: "Barbara Liskov",
    email: "barbara@cooud.dev",
    role: "Member",
    status: "active",
    seats: 1,
  },
  {
    id: "u-1031",
    name: "Donald Knuth",
    email: "donald@cooud.dev",
    role: "Member",
    status: "invited",
    seats: 1,
  },
  {
    id: "u-1032",
    name: "Edsger Dijkstra",
    email: "edsger@cooud.dev",
    role: "Viewer",
    status: "active",
    seats: 1,
  },
  {
    id: "u-1033",
    name: "Linus Torvalds",
    email: "linus@cooud.dev",
    role: "Admin",
    status: "active",
    seats: 4,
  },
  {
    id: "u-1034",
    name: "Tim Berners-Lee",
    email: "tim@cooud.dev",
    role: "Member",
    status: "suspended",
    seats: 0,
  },
  {
    id: "u-1035",
    name: "Radia Perlman",
    email: "radia@cooud.dev",
    role: "Member",
    status: "active",
    seats: 2,
  },
];

const STATUS_VARIANT: Record<Member["status"], "success" | "warning" | "error"> = {
  active: "success",
  invited: "warning",
  suspended: "error",
};

const memberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium text-fg">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span className="text-fg-secondary">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<Member["status"]>("status");
      return (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "seats",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Seats" />,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums text-fg-secondary">{row.getValue("seats")}</span>
    ),
  },
];

const memberStatusFilter: DataTableFacetedFilter = {
  columnId: "status",
  title: "Status",
  options: [
    { label: "Active", value: "active", icon: Check },
    { label: "Invited", value: "invited", icon: CircleDashed },
    { label: "Suspended", value: "suspended", icon: CircleSlash },
  ],
};

/** Loading demo: toggles a fake fetch so the skeleton → data swap is visible. */
function DataTableLoadingDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setLoading((l) => !l)}
      >
        {loading ? "Show data" : "Show loading"}
      </Button>
      <DataTable
        columns={memberColumns}
        data={memberData.slice(0, 4)}
        loading={loading}
        loadingRowCount={4}
      />
    </div>
  );
}

/** Error demo: a retry button clears the error and reveals the rows. */
function DataTableErrorDemo() {
  const [failed, setFailed] = useState(true);
  return (
    <DataTable
      columns={memberColumns}
      data={failed ? [] : memberData.slice(0, 4)}
      error={
        failed ? "Couldn’t load team members. Check your connection and try again." : undefined
      }
      onRetry={() => setFailed(false)}
    />
  );
}

export const dataDisplayExamples: ExampleMap = {
  avatar: [
    {
      id: "image-fallback",
      title: "Image & fallback",
      description: "A user image alongside deterministic initials-only fallbacks.",
      code: `<div className="flex items-center gap-4">
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar>
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
    <Avatar key={initials} className="ring-2 ring-surface-raised">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  ))}
  <Avatar className="ring-2 ring-surface-raised">
    <AvatarFallback className="text-xs">+5</AvatarFallback>
  </Avatar>
</div>`,
      preview: (
        <div className="flex -space-x-3">
          {["CN", "AL", "JL", "MK"].map((initials) => (
            <Avatar key={initials} className="ring-2 ring-surface-raised">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar className="ring-2 ring-surface-raised">
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
      id: "basic",
      title: "Basic",
      description:
        "The smallest setup: pass `columns` + `data`. With no opt-in props it renders a plain, accessible table — no toolbar, pagination, or selection.",
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
    {
      id: "sortable",
      title: "Sortable",
      description:
        "Use the exported `DataTableColumnHeader` in a column header to get an accessible, three-state sort toggle (asc → desc → none) with the right icon and aria-label. Click any header to sort.",
      code: `import { DataTable, DataTableColumnHeader } from "@cooud/ui";

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium text-fg">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
  },
  {
    accessorKey: "seats",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Seats" />,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums text-fg-secondary">{row.getValue("seats")}</span>
    ),
  },
];

<DataTable columns={columns} data={members} />`,
      preview: <DataTable columns={memberColumns} data={memberData.slice(0, 6)} />,
    },
    {
      id: "search-filter",
      title: "Search & filter",
      description:
        "Opt into the toolbar with `searchable` for a debounce-free global search, and `facetedFilters` for multi-select column filters with live facet counts. A Reset clears everything.",
      code: `const statusOptions = [
  { label: "Active", value: "active", icon: Check },
  { label: "Invited", value: "invited", icon: CircleDashed },
  { label: "Suspended", value: "suspended", icon: CircleSlash },
];

const statusFilter: DataTableFacetedFilter = {
  columnId: "status",
  title: "Status",
  options: statusOptions,
};

<DataTable
  columns={columns}
  data={members}
  searchable
  searchPlaceholder="Search members…"
  facetedFilters={[statusFilter]}
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData}
          searchable
          searchPlaceholder="Search members…"
          facetedFilters={[memberStatusFilter]}
        />
      ),
    },
    {
      id: "pagination",
      title: "Pagination",
      description:
        "Set `pagination` to render the footer with a rows-per-page select, a row-range readout, and first/prev/next/last controls. Defaults are uncontrolled; pass `initialPageSize` and `pageSizeOptions` to tune.",
      code: `<DataTable
  columns={columns}
  data={members}
  pagination
  initialPageSize={5}
  pageSizeOptions={[5, 10, 20]}
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData}
          pagination
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
        />
      ),
    },
    {
      id: "selection-bulk",
      title: "Selection & bulk actions",
      description:
        "`enableRowSelection` prepends an accessible select-all/row checkbox column. Render contextual actions with `bulkActions` — a bar that appears only while rows are selected and receives the selected rows.",
      code: `<DataTable
  columns={columns}
  data={members}
  enableRowSelection
  pagination
  initialPageSize={5}
  bulkActions={(rows) => (
    <>
      <Button variant="outline" size="sm">
        <Mail aria-hidden="true" />
        Email {rows.length}
      </Button>
      <Button variant="destructive" size="sm">
        Remove
      </Button>
    </>
  )}
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData}
          enableRowSelection
          pagination
          initialPageSize={5}
          bulkActions={(rows) => (
            <>
              <Button variant="outline" size="sm">
                <Mail aria-hidden="true" />
                Email {rows.length}
              </Button>
              <Button variant="destructive" size="sm">
                Remove
              </Button>
            </>
          )}
        />
      ),
    },
    {
      id: "column-visibility",
      title: "Column visibility",
      description:
        "`enableColumnVisibility` adds a “View” menu that toggles each hideable column on or off, so users can tailor the table to what they care about.",
      code: `<DataTable
  columns={columns}
  data={members}
  searchable
  enableColumnVisibility
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData.slice(0, 6)}
          searchable
          enableColumnVisibility
        />
      ),
    },
    {
      id: "density",
      title: "Density",
      description:
        "`enableDensityToggle` exposes a comfortable/compact switch in the toolbar; the `aria-pressed` button trims cell padding for data-dense views without touching your columns.",
      code: `<DataTable
  columns={columns}
  data={members}
  searchable
  enableDensityToggle
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData.slice(0, 6)}
          searchable
          enableDensityToggle
        />
      ),
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "Pass `loading` to swap the body for shimmer rows that match your column count — no layout shift when the real data arrives. Toggle below to see the swap.",
      code: `const [loading, setLoading] = useState(true);

<DataTable
  columns={columns}
  data={members}
  loading={loading}
  loadingRowCount={4}
/>`,
      preview: <DataTableLoadingDemo />,
    },
    {
      id: "empty",
      title: "Empty",
      description:
        "With no rows, the table renders a centered empty state. Override the copy — or drop in a full `Empty` composition — via the `emptyState` prop.",
      code: `<DataTable
  columns={columns}
  data={[]}
  emptyState={
    <Empty>
      <EmptyIcon>
        <Inbox aria-hidden="true" />
      </EmptyIcon>
      <EmptyTitle>No members yet</EmptyTitle>
      <EmptyDescription>Invite teammates to see them listed here.</EmptyDescription>
    </Empty>
  }
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={[]}
          emptyState={
            <Empty>
              <EmptyIcon>
                <Inbox aria-hidden="true" />
              </EmptyIcon>
              <EmptyTitle>No members yet</EmptyTitle>
              <EmptyDescription>Invite teammates to see them listed here.</EmptyDescription>
            </Empty>
          }
        />
      ),
    },
    {
      id: "error",
      title: "Error",
      description:
        'Pass `error` to render an inline, `role="alert"` failure state. Provide `onRetry` to surface a Retry button — handy for refetching after a transient network error.',
      code: `const [failed, setFailed] = useState(true);

<DataTable
  columns={columns}
  data={failed ? [] : members}
  error={failed ? "Couldn't load team members. Check your connection and try again." : undefined}
  onRetry={() => setFailed(false)}
/>`,
      preview: <DataTableErrorDemo />,
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

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function DataDisplayExamples({ slug }: { slug: string }) {
  return <ExampleList examples={dataDisplayExamples[slug] ?? []} />;
}
