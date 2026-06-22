"use client";

import {
  AppShell,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud/ui";
import {
  Activity,
  Bell,
  ChartColumnIncreasing,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  LineChart,
  Search,
  Settings,
  ShoppingCart,
  TrendingDown,
  Users,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * Shared host
 *
 * AppShell / Sidebar use `min-h-svh` / `h-svh` internally for full-page
 * layouts. Inside the fixed-width, scaled block-preview canvas those svh
 * heights blow out the frame, so we render the whole shell inside a host with
 * an EXPLICIT height (h-[40rem]) and neutralize the internal svh via targeted
 * data-slot overrides — no svh leaks into the block itself.
 * ────────────────────────────────────────────────────────────────────────── */

const SHELL_HOST_CLASS =
  "h-[40rem] w-full overflow-hidden rounded-xl border border-border bg-surface-base " +
  "[&_[data-slot=sidebar-wrapper]]:!min-h-0 [&_[data-slot=sidebar-wrapper]]:h-full " +
  "[&_[data-slot=sidebar]]:!h-full " +
  "[&_[data-slot=app-shell-content]]:!min-h-0 [&_[data-slot=app-shell-content]]:h-full " +
  "[&_[data-slot=app-shell-body]]:overflow-y-auto";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Analytics — full app shell with sidebar nav, topbar, KPIs, chart & table
 * ────────────────────────────────────────────────────────────────────────── */

interface NavLink {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const analyticsNav: NavLink[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const analyticsKpis = [
  {
    label: "Total revenue",
    value: "$84,210",
    delta: "+14.2%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    label: "Active users",
    value: "12,840",
    delta: "+6.8%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Conversion",
    value: "4.21%",
    delta: "+0.9%",
    trend: "up" as const,
    icon: Activity,
  },
  {
    label: "Churn",
    value: "1.64%",
    delta: "-0.4%",
    trend: "down" as const,
    icon: TrendingDown,
  },
];

const revenueData = [
  { month: "Jan", revenue: 42_100 },
  { month: "Feb", revenue: 48_400 },
  { month: "Mar", revenue: 45_900 },
  { month: "Apr", revenue: 56_200 },
  { month: "May", revenue: 61_800 },
  { month: "Jun", revenue: 72_400 },
  { month: "Jul", revenue: 84_210 },
];

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

interface ActivityRow {
  id: string;
  customer: string;
  email: string;
  initials: string;
  avatar?: string;
  amount: string;
  status: "Paid" | "Pending" | "Refunded";
  statusVariant: "success" | "warning" | "secondary";
}

const recentActivity: ActivityRow[] = [
  {
    id: "INV-2048",
    customer: "Mara Castillo",
    email: "mara@northwind.io",
    initials: "MC",
    avatar: "https://i.pravatar.cc/96?img=12",
    amount: "$1,290.00",
    status: "Paid",
    statusVariant: "success",
  },
  {
    id: "INV-2047",
    customer: "Devon Lane",
    email: "devon@acme.dev",
    initials: "DL",
    avatar: "https://i.pravatar.cc/96?img=33",
    amount: "$640.00",
    status: "Pending",
    statusVariant: "warning",
  },
  {
    id: "INV-2046",
    customer: "Priya Sharma",
    email: "priya@lumon.co",
    initials: "PS",
    amount: "$2,180.00",
    status: "Paid",
    statusVariant: "success",
  },
  {
    id: "INV-2045",
    customer: "Tobias Funke",
    email: "tobias@bluth.com",
    initials: "TF",
    avatar: "https://i.pravatar.cc/96?img=68",
    amount: "$320.00",
    status: "Refunded",
    statusVariant: "secondary",
  },
];

const topbarNav = [
  { id: "dashboard", label: "Dashboard", current: true },
  { id: "customers", label: "Customers", current: false },
  { id: "billing", label: "Billing", current: false },
];

export function DashboardAnalyticsBlock() {
  const sidebar = (
    <Sidebar collapsible="none" aria-label="Primary">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-4" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-fg">Cooud Analytics</span>
            <span className="truncate text-xs text-fg-tertiary">Acme Inc.</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsNav.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={index === 1}>
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <Avatar className="size-8">
            <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Lena Park" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-fg">Lena Park</span>
            <span className="truncate text-xs text-fg-tertiary">lena@acme.dev</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <NavigationMenu aria-label="Primary" className="hidden md:flex">
        <NavigationMenuList>
          {topbarNav.map((item) => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink
                href={`#${item.id}`}
                active={item.current}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-auto flex items-center gap-2">
        <label className="relative hidden sm:block">
          <span className="sr-only">Search</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-48 rounded-lg border border-border bg-surface-inset pl-8 pr-3 text-sm text-fg outline-none placeholder:text-fg-tertiary focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <Avatar className="size-8">
          <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Lena Park" />
          <AvatarFallback>LP</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );

  return (
    <div className={SHELL_HOST_CLASS}>
      <AppShell
        sidebar={sidebar}
        header={header}
        className="!min-h-0 h-full"
        providerProps={{ enableKeyboardShortcut: false }}
      >
        <div className="flex flex-col gap-6 p-6">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                Analytics
              </h2>
              <p className="text-sm text-fg-secondary">
                Performance across your workspace, last 7 months.
              </p>
            </div>
            <Badge variant="success">Live</Badge>
          </header>

          {/* KPI grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
            {analyticsKpis.map(({ label, value, delta, trend, icon: Icon }) => (
              <Card key={label} className="gap-4 py-5">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <MetricDelta trend={trend}>{delta}</MetricDelta>
                  </div>
                  <Metric className="gap-1.5">
                    <MetricLabel>{label}</MetricLabel>
                    <MetricValue className="text-3xl">{value}</MetricValue>
                  </Metric>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart + table */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-display text-base">Revenue trend</CardTitle>
                  <p className="text-sm text-fg-secondary">Monthly recurring revenue</p>
                </div>
                <MetricDelta trend="up">+99.8% YoY</MetricDelta>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="aspect-[16/9] w-full">
                  <BarChart accessibilityLayer data={revenueData} margin={{ left: 4, right: 4 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="gap-0 py-0">
              <CardHeader className="px-6 py-5">
                <CardTitle className="font-display text-base">Recent activity</CardTitle>
                <p className="text-sm text-fg-secondary">Latest invoices and payments</p>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            {row.avatar ? (
                              <AvatarImage src={row.avatar} alt={row.customer} />
                            ) : null}
                            <AvatarFallback>{row.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-fg">
                              {row.customer}
                            </span>
                            <span className="truncate text-xs text-fg-tertiary">{row.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums text-fg">
                        {row.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.statusVariant}>{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

const dashboardAnalyticsCode = `"use client";

import {
  AppShell,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud/ui";
import {
  Activity,
  Bell,
  ChartColumnIncreasing,
  DollarSign,
  FileText,
  LayoutDashboard,
  LineChart,
  Search,
  Settings,
  TrendingDown,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const kpis = [
  { label: "Total revenue", value: "$84,210", delta: "+14.2%", trend: "up" as const, icon: DollarSign },
  { label: "Active users", value: "12,840", delta: "+6.8%", trend: "up" as const, icon: Users },
  { label: "Conversion", value: "4.21%", delta: "+0.9%", trend: "up" as const, icon: Activity },
  { label: "Churn", value: "1.64%", delta: "-0.4%", trend: "down" as const, icon: TrendingDown },
];

const revenueData = [
  { month: "Jan", revenue: 42100 },
  { month: "Feb", revenue: 48400 },
  { month: "Mar", revenue: 45900 },
  { month: "Apr", revenue: 56200 },
  { month: "May", revenue: 61800 },
  { month: "Jun", revenue: 72400 },
  { month: "Jul", revenue: 84210 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

const activity = [
  { id: "INV-2048", customer: "Mara Castillo", email: "mara@northwind.io", initials: "MC", avatar: "https://i.pravatar.cc/96?img=12", amount: "$1,290.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2047", customer: "Devon Lane", email: "devon@acme.dev", initials: "DL", avatar: "https://i.pravatar.cc/96?img=33", amount: "$640.00", status: "Pending", statusVariant: "warning" as const },
  { id: "INV-2046", customer: "Priya Sharma", email: "priya@lumon.co", initials: "PS", amount: "$2,180.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2045", customer: "Tobias Funke", email: "tobias@bluth.com", initials: "TF", avatar: "https://i.pravatar.cc/96?img=68", amount: "$320.00", status: "Refunded", statusVariant: "secondary" as const },
];

const topbar = [
  { id: "dashboard", label: "Dashboard", current: true },
  { id: "customers", label: "Customers", current: false },
  { id: "billing", label: "Billing", current: false },
];

export function DashboardAnalyticsBlock() {
  const sidebar = (
    <Sidebar collapsible="none" aria-label="Primary">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-4" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-fg">Cooud Analytics</span>
            <span className="truncate text-xs text-fg-tertiary">Acme Inc.</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={index === 1}>
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <Avatar className="size-8">
            <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Lena Park" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-fg">Lena Park</span>
            <span className="truncate text-xs text-fg-tertiary">lena@acme.dev</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <NavigationMenu aria-label="Primary" className="hidden md:flex">
        <NavigationMenuList>
          {topbar.map((item) => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink
                href={\`#\${item.id}\`}
                active={item.current}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="ml-auto flex items-center gap-2">
        <label className="relative hidden sm:block">
          <span className="sr-only">Search</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-48 rounded-lg border border-border bg-surface-inset pl-8 pr-3 text-sm text-fg outline-none placeholder:text-fg-tertiary focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <Avatar className="size-8">
          <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Lena Park" />
          <AvatarFallback>LP</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );

  return (
    <div className="h-[40rem] w-full overflow-hidden rounded-xl border border-border bg-surface-base">
      <AppShell sidebar={sidebar} header={header} className="h-full" providerProps={{ enableKeyboardShortcut: false }}>
        <div className="flex flex-col gap-6 p-6">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">Analytics</h2>
              <p className="text-sm text-fg-secondary">Performance across your workspace, last 7 months.</p>
            </div>
            <Badge variant="success">Live</Badge>
          </header>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
            {kpis.map(({ label, value, delta, trend, icon: Icon }) => (
              <Card key={label} className="gap-4 py-5">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <MetricDelta trend={trend}>{delta}</MetricDelta>
                  </div>
                  <Metric className="gap-1.5">
                    <MetricLabel>{label}</MetricLabel>
                    <MetricValue className="text-3xl">{value}</MetricValue>
                  </Metric>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-display text-base">Revenue trend</CardTitle>
                  <p className="text-sm text-fg-secondary">Monthly recurring revenue</p>
                </div>
                <MetricDelta trend="up">+99.8% YoY</MetricDelta>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
                  <BarChart accessibilityLayer data={revenueData} margin={{ left: 4, right: 4 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="gap-0 py-0">
              <CardHeader className="px-6 py-5">
                <CardTitle className="font-display text-base">Recent activity</CardTitle>
                <p className="text-sm text-fg-secondary">Latest invoices and payments</p>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            {row.avatar ? <AvatarImage src={row.avatar} alt={row.customer} /> : null}
                            <AvatarFallback>{row.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-fg">{row.customer}</span>
                            <span className="truncate text-xs text-fg-tertiary">{row.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums text-fg">{row.amount}</TableCell>
                      <TableCell>
                        <Badge variant={row.statusVariant}>{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </AppShell>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Admin overview — icon-collapsed sidebar, status cards, larger table
 * ────────────────────────────────────────────────────────────────────────── */

const adminNav: NavLink[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

const adminStatus = [
  {
    label: "Monthly volume",
    value: "$312.8k",
    delta: "+8.4%",
    trend: "up" as const,
    badge: { text: "Healthy", variant: "success" as const },
  },
  {
    label: "Open orders",
    value: "184",
    delta: "+12",
    trend: "up" as const,
    badge: { text: "Processing", variant: "info" as const },
  },
  {
    label: "Refund rate",
    value: "2.1%",
    delta: "+0.5%",
    trend: "up" as const,
    badge: { text: "Watch", variant: "warning" as const },
  },
];

const signupsData = [
  { day: "Mon", signups: 142 },
  { day: "Tue", signups: 188 },
  { day: "Wed", signups: 164 },
  { day: "Thu", signups: 221 },
  { day: "Fri", signups: 276 },
  { day: "Sat", signups: 198 },
  { day: "Sun", signups: 152 },
];

const signupsConfig = {
  signups: { label: "Signups", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

interface AdminRow {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  orders: number;
  spend: string;
  status: "Active" | "Invited" | "Suspended";
  statusVariant: "success" | "warning" | "error";
}

const adminRows: AdminRow[] = [
  {
    id: "u1",
    name: "Mara Castillo",
    email: "mara@northwind.io",
    initials: "MC",
    avatar: "https://i.pravatar.cc/96?img=12",
    role: "Owner",
    roleVariant: "primary",
    orders: 42,
    spend: "$18,240",
    status: "Active",
    statusVariant: "success",
  },
  {
    id: "u2",
    name: "Devon Lane",
    email: "devon@acme.dev",
    initials: "DL",
    avatar: "https://i.pravatar.cc/96?img=33",
    role: "Admin",
    roleVariant: "info",
    orders: 28,
    spend: "$9,610",
    status: "Active",
    statusVariant: "success",
  },
  {
    id: "u3",
    name: "Priya Sharma",
    email: "priya@lumon.co",
    initials: "PS",
    role: "Member",
    roleVariant: "secondary",
    orders: 11,
    spend: "$3,180",
    status: "Invited",
    statusVariant: "warning",
  },
  {
    id: "u4",
    name: "Tobias Funke",
    email: "tobias@bluth.com",
    initials: "TF",
    avatar: "https://i.pravatar.cc/96?img=68",
    role: "Member",
    roleVariant: "secondary",
    orders: 6,
    spend: "$1,420",
    status: "Suspended",
    statusVariant: "error",
  },
  {
    id: "u5",
    name: "Aiko Tanaka",
    email: "aiko@hooli.com",
    initials: "AT",
    role: "Member",
    roleVariant: "secondary",
    orders: 19,
    spend: "$6,050",
    status: "Active",
    statusVariant: "success",
  },
];

export function DashboardAdminOverviewBlock() {
  const sidebar = (
    <Sidebar collapsible="icon" aria-label="Admin">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1.5 py-1.5 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-semibold text-fg group-data-[collapsible=icon]/sidebar:hidden">
            Cooud Admin
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={index === 1} tooltip={item.label}>
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Lena Park">
              <Avatar className="size-6">
                <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Lena Park" />
                <AvatarFallback>LP</AvatarFallback>
              </Avatar>
              <span>Lena Park</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <SidebarTrigger />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-fg">Admin overview</span>
        <span className="text-xs text-fg-tertiary">Toggle the sidebar to collapse to icons</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="gradient" size="sm">
          New user
        </Button>
      </div>
    </div>
  );

  return (
    <div className={SHELL_HOST_CLASS}>
      <AppShell
        sidebar={sidebar}
        header={header}
        className="!min-h-0 h-full"
        providerProps={{ defaultOpen: false, enableKeyboardShortcut: false }}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Status cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {adminStatus.map(({ label, value, delta, trend, badge }) => (
              <Card key={label} className="gap-4 py-5">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <MetricLabel>{label}</MetricLabel>
                    <Badge variant={badge.variant}>{badge.text}</Badge>
                  </div>
                  <Metric className="gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <MetricValue className="text-3xl">{value}</MetricValue>
                      <MetricDelta trend={trend}>{delta}</MetricDelta>
                    </div>
                  </Metric>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Signups chart */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="font-display text-base">New signups</CardTitle>
                <p className="text-sm text-fg-secondary">Last 7 days</p>
              </div>
              <MetricDelta trend="up">+11.2%</MetricDelta>
            </CardHeader>
            <CardContent>
              <ChartContainer config={signupsConfig} className="aspect-[16/5] w-full">
                <AreaChart accessibilityLayer data={signupsData} margin={{ left: 4, right: 4 }}>
                  <defs>
                    <linearGradient id="fillSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="signups"
                    type="natural"
                    fill="url(#fillSignups)"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Users table */}
          <Card className="gap-0 py-0">
            <CardHeader className="flex-row items-center justify-between gap-3 px-6 py-5">
              <div className="flex flex-col gap-1">
                <CardTitle className="font-display text-base">Users &amp; orders</CardTitle>
                <p className="text-sm text-fg-secondary">All workspace accounts</p>
              </div>
              <Badge variant="secondary">{adminRows.length} total</Badge>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {row.avatar ? <AvatarImage src={row.avatar} alt={row.name} /> : null}
                          <AvatarFallback>{row.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-fg">{row.name}</span>
                          <span className="truncate text-xs text-fg-tertiary">{row.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.roleVariant}>{row.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-fg-secondary">
                      {row.orders}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-fg">
                      {row.spend}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.statusVariant}>{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </AppShell>
    </div>
  );
}

const dashboardAdminOverviewCode = `"use client";

import {
  AppShell,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud/ui";
import {
  ChartColumnIncreasing,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

const status = [
  { label: "Monthly volume", value: "$312.8k", delta: "+8.4%", trend: "up" as const, badge: { text: "Healthy", variant: "success" as const } },
  { label: "Open orders", value: "184", delta: "+12", trend: "up" as const, badge: { text: "Processing", variant: "info" as const } },
  { label: "Refund rate", value: "2.1%", delta: "+0.5%", trend: "up" as const, badge: { text: "Watch", variant: "warning" as const } },
];

const signupsData = [
  { day: "Mon", signups: 142 },
  { day: "Tue", signups: 188 },
  { day: "Wed", signups: 164 },
  { day: "Thu", signups: 221 },
  { day: "Fri", signups: 276 },
  { day: "Sat", signups: 198 },
  { day: "Sun", signups: 152 },
];

const signupsConfig = {
  signups: { label: "Signups", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const rows = [
  { id: "u1", name: "Mara Castillo", email: "mara@northwind.io", initials: "MC", avatar: "https://i.pravatar.cc/96?img=12", role: "Owner", roleVariant: "primary" as const, orders: 42, spend: "$18,240", status: "Active", statusVariant: "success" as const },
  { id: "u2", name: "Devon Lane", email: "devon@acme.dev", initials: "DL", avatar: "https://i.pravatar.cc/96?img=33", role: "Admin", roleVariant: "info" as const, orders: 28, spend: "$9,610", status: "Active", statusVariant: "success" as const },
  { id: "u3", name: "Priya Sharma", email: "priya@lumon.co", initials: "PS", role: "Member", roleVariant: "secondary" as const, orders: 11, spend: "$3,180", status: "Invited", statusVariant: "warning" as const },
  { id: "u4", name: "Tobias Funke", email: "tobias@bluth.com", initials: "TF", avatar: "https://i.pravatar.cc/96?img=68", role: "Member", roleVariant: "secondary" as const, orders: 6, spend: "$1,420", status: "Suspended", statusVariant: "error" as const },
  { id: "u5", name: "Aiko Tanaka", email: "aiko@hooli.com", initials: "AT", role: "Member", roleVariant: "secondary" as const, orders: 19, spend: "$6,050", status: "Active", statusVariant: "success" as const },
];

export function DashboardAdminOverviewBlock() {
  const sidebar = (
    <Sidebar collapsible="icon" aria-label="Admin">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1.5 py-1.5 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-semibold text-fg group-data-[collapsible=icon]/sidebar:hidden">
            Cooud Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={index === 1} tooltip={item.label}>
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Lena Park">
              <Avatar className="size-6">
                <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Lena Park" />
                <AvatarFallback>LP</AvatarFallback>
              </Avatar>
              <span>Lena Park</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <SidebarTrigger />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-fg">Admin overview</span>
        <span className="text-xs text-fg-tertiary">Toggle the sidebar to collapse to icons</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">Export</Button>
        <Button variant="gradient" size="sm">New user</Button>
      </div>
    </div>
  );

  return (
    <div className="h-[40rem] w-full overflow-hidden rounded-xl border border-border bg-surface-base">
      <AppShell sidebar={sidebar} header={header} className="h-full" providerProps={{ defaultOpen: false, enableKeyboardShortcut: false }}>
        <div className="flex flex-col gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {status.map(({ label, value, delta, trend, badge }) => (
              <Card key={label} className="gap-4 py-5">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <MetricLabel>{label}</MetricLabel>
                    <Badge variant={badge.variant}>{badge.text}</Badge>
                  </div>
                  <Metric className="gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <MetricValue className="text-3xl">{value}</MetricValue>
                      <MetricDelta trend={trend}>{delta}</MetricDelta>
                    </div>
                  </Metric>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="font-display text-base">New signups</CardTitle>
                <p className="text-sm text-fg-secondary">Last 7 days</p>
              </div>
              <MetricDelta trend="up">+11.2%</MetricDelta>
            </CardHeader>
            <CardContent>
              <ChartContainer config={signupsConfig} className="aspect-[16/5] w-full">
                <AreaChart accessibilityLayer data={signupsData} margin={{ left: 4, right: 4 }}>
                  <defs>
                    <linearGradient id="fillSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area dataKey="signups" type="natural" fill="url(#fillSignups)" stroke="var(--color-chart-2)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="gap-0 py-0">
            <CardHeader className="flex-row items-center justify-between gap-3 px-6 py-5">
              <div className="flex flex-col gap-1">
                <CardTitle className="font-display text-base">Users &amp; orders</CardTitle>
                <p className="text-sm text-fg-secondary">All workspace accounts</p>
              </div>
              <Badge variant="secondary">{rows.length} total</Badge>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {row.avatar ? <AvatarImage src={row.avatar} alt={row.name} /> : null}
                          <AvatarFallback>{row.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-fg">{row.name}</span>
                          <span className="truncate text-xs text-fg-tertiary">{row.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={row.roleVariant}>{row.role}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums text-fg-secondary">{row.orders}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-fg">{row.spend}</TableCell>
                    <TableCell><Badge variant={row.statusVariant}>{row.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </AppShell>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const dashboardBlocks: BlockContentMap = {
  dashboard: {
    preview: <DashboardAnalyticsBlock />,
    code: dashboardAnalyticsCode,
    variants: [
      {
        id: "analytics",
        name: "Analytics dashboard",
        description:
          "A full application shell — sidebar nav, search topbar, KPI cards, a revenue chart and a recent-activity table.",
        appearance: "dark",
        preview: <DashboardAnalyticsBlock />,
        code: dashboardAnalyticsCode,
      },
      {
        id: "admin-overview",
        name: "Admin overview",
        description:
          "An admin console with an icon-collapsible sidebar, status cards, a signups trend and a larger users & orders table.",
        appearance: "light",
        preview: <DashboardAdminOverviewBlock />,
        code: dashboardAdminOverviewCode,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function DashboardGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(dashboardBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function DashboardView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(dashboardBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
