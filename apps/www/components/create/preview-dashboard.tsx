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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Input,
  Label,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Textarea,
} from "@cooud/ui";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Briefcase,
  Coffee,
  CreditCard,
  PiggyBank,
  Plane,
  Plus,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

/* ──────────────────────────────────────────────────────────────────────────
 * Shared helpers
 * ────────────────────────────────────────────────────────────────────────── */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Contribution / activity chart
 * ────────────────────────────────────────────────────────────────────────── */

const activityData = [
  { month: "Jan", contributions: 1840 },
  { month: "Feb", contributions: 2210 },
  { month: "Mar", contributions: 1960 },
  { month: "Apr", contributions: 2680 },
  { month: "May", contributions: 3120 },
  { month: "Jun", contributions: 3480 },
];

const activityConfig = {
  contributions: { label: "Contributions", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Contribution activity</CardTitle>
        <CardDescription>Deposits across the last 6 months</CardDescription>
        <CardAction>
          <MetricDelta trend="up">+18.4%</MetricDelta>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={activityConfig} className="aspect-[16/9] w-full">
          <BarChart accessibilityLayer data={activityData} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="contributions" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <Button variant="outline" className="w-full">
          View full report
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Payout threshold
 * ────────────────────────────────────────────────────────────────────────── */

const PAYOUT_MIN = 50;
const PAYOUT_MAX = 5000;

function PayoutCard() {
  const [currency, setCurrency] = useState<string | null>("usd");
  const [amount, setAmount] = useState<number>(1250);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Payout threshold</CardTitle>
        <CardDescription>Auto-withdraw once your balance clears this amount.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="payout-currency">Preferred currency</Label>
          <Select value={currency ?? ""} onValueChange={setCurrency}>
            <SelectTrigger id="payout-currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD — US Dollar</SelectItem>
              <SelectItem value="eur">EUR — Euro</SelectItem>
              <SelectItem value="brl">BRL — Brazilian Real</SelectItem>
              <SelectItem value="gbp">GBP — British Pound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between">
            <Label htmlFor="payout-amount">Trigger at</Label>
            <Metric className="items-end gap-0">
              <MetricValue className="text-2xl">{usd.format(amount)}</MetricValue>
            </Metric>
          </div>
          <Slider
            id="payout-amount"
            min={PAYOUT_MIN}
            max={PAYOUT_MAX}
            step={50}
            value={[amount]}
            onValueChange={(v) => setAmount(v[0] ?? PAYOUT_MIN)}
            aria-label="Payout threshold amount"
          />
          <div className="flex justify-between text-xs text-fg-tertiary tabular-nums">
            <span>{usd.format(PAYOUT_MIN)}</span>
            <span>{usd.format(PAYOUT_MAX)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="payout-notes">Notes</Label>
          <Textarea
            id="payout-notes"
            rows={2}
            placeholder="Add an internal note for your finance team…"
            defaultValue="Route to operating account ending 4821."
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <Button variant="gradient" className="w-full">
          Save threshold
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Savings targets
 * ────────────────────────────────────────────────────────────────────────── */

interface Goal {
  id: string;
  label: string;
  saved: number;
  target: number;
  icon: typeof PiggyBank;
}

const goals: Goal[] = [
  { id: "g1", label: "Emergency fund", saved: 8400, target: 12000, icon: PiggyBank },
  { id: "g2", label: "Office relocation", saved: 21300, target: 45000, icon: Briefcase },
];

function SavingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Savings targets</CardTitle>
        <CardDescription>Progress toward your quarterly goals</CardDescription>
        <CardAction>
          <Badge variant="primary" className="gap-1">
            <Plus className="size-3" aria-hidden="true" />
            New goal
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {goals.map((goal) => {
          const pct = Math.round((goal.saved / goal.target) * 100);
          const Icon = goal.icon;
          return (
            <div key={goal.id} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium text-fg">{goal.label}</span>
                  <span className="text-xs text-fg-tertiary">of {usd.format(goal.target)}</span>
                </div>
                <Metric className="items-end gap-0">
                  <MetricValue className="text-xl">{usd.format(goal.saved)}</MetricValue>
                </Metric>
              </div>
              <Progress value={pct} aria-label={`${goal.label} progress`} />
              <div className="flex justify-between text-xs">
                <span className="font-medium text-success">{pct}% achieved</span>
                <span className="text-fg-tertiary tabular-nums">
                  {usd.format(goal.target - goal.saved)} to go
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Buy investment
 * ────────────────────────────────────────────────────────────────────────── */

const SHARE_PRICE = 184.62;

function InvestCard() {
  const [amount, setAmount] = useState<string>("2500");
  const [orderType, setOrderType] = useState<string | null>("market");

  const estimatedShares = useMemo(() => {
    const value = Number.parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      return 0;
    }
    return value / SHARE_PRICE;
  }, [amount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Buy investment</CardTitle>
        <CardDescription>Cooud Growth Index — CGX</CardDescription>
        <CardAction>
          <Badge variant="success" className="gap-1">
            <TrendingUp className="size-3" aria-hidden="true" />
            +2.4%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="invest-amount">Amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-fg-tertiary">
              $
            </span>
            <Input
              id="invest-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 tabular-nums"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="invest-order">Order type</Label>
          <Select value={orderType ?? ""} onValueChange={setOrderType}>
            <SelectTrigger id="invest-order" className="w-full">
              <SelectValue placeholder="Select order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market order</SelectItem>
              <SelectItem value="limit">Limit order</SelectItem>
              <SelectItem value="recurring">Recurring buy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-fg-secondary">
          Executes immediately at the best available price. Settlement in 2 business days.
        </p>

        <div className="flex items-center justify-between rounded-lg bg-surface-overlay px-3.5 py-3">
          <span className="text-sm text-fg-secondary">Estimated shares</span>
          <span className="font-display text-sm font-semibold text-fg tabular-nums">
            {estimatedShares.toFixed(4)} @ {usdCents.format(SHARE_PRICE)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <Button variant="gradient" className="w-full">
          Review order
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 5. Recent transactions
 * ────────────────────────────────────────────────────────────────────────── */

interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  icon: typeof Coffee;
}

const transactions: Transaction[] = [
  {
    id: "t1",
    name: "Stripe payout",
    category: "Income",
    date: "Jun 21",
    amount: 4820.0,
    icon: Banknote,
  },
  {
    id: "t2",
    name: "Figma",
    category: "Software",
    date: "Jun 20",
    amount: -45.0,
    icon: CreditCard,
  },
  {
    id: "t3",
    name: "Blue Bottle Coffee",
    category: "Meals",
    date: "Jun 19",
    amount: -18.4,
    icon: Coffee,
  },
  {
    id: "t4",
    name: "Delta Air Lines",
    category: "Travel",
    date: "Jun 18",
    amount: -612.3,
    icon: Plane,
  },
  {
    id: "t5",
    name: "Acme Corp invoice",
    category: "Income",
    date: "Jun 17",
    amount: 2150.0,
    icon: ShoppingBag,
  },
];

function TransactionsCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-6 py-5">
        <CardTitle className="font-display text-base">Recent transactions</CardTitle>
        <CardDescription>Across all connected accounts</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <ul className="flex flex-col">
        {transactions.map((tx, i) => {
          const income = tx.amount > 0;
          const Icon = tx.icon;
          return (
            <li
              key={tx.id}
              className={`flex items-center gap-3.5 px-6 py-3.5 ${
                i !== transactions.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span
                className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${
                  income ? "bg-success/10 text-success" : "bg-surface-overlay text-fg-secondary"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-fg">{tx.name}</span>
                <span className="truncate text-xs text-fg-tertiary">{tx.category}</span>
              </div>
              <span className="text-xs text-fg-tertiary tabular-nums">{tx.date}</span>
              <span
                className={`flex items-center gap-0.5 text-sm font-semibold tabular-nums ${
                  income ? "text-success" : "text-error"
                }`}
              >
                {income ? (
                  <ArrowDownLeft className="size-3.5" aria-hidden="true" />
                ) : (
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                )}
                {income ? "+" : "−"}
                {usdCents.format(Math.abs(tx.amount))}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 6. Stat row
 * ────────────────────────────────────────────────────────────────────────── */

const stats = [
  {
    label: "Net revenue",
    value: "$48,290",
    delta: "+12.4%",
    trend: "up" as const,
    icon: Wallet,
  },
  {
    label: "Active users",
    value: "9,184",
    delta: "+5.2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Churn rate",
    value: "1.92%",
    delta: "-0.3%",
    trend: "down" as const,
    icon: TrendingDown,
  },
];

function StatRow() {
  return (
    <div className="grid grid-cols-1 gap-5">
      {stats.map(({ label, value, delta, trend, icon: Icon }) => (
        <Card key={label} className="gap-3 py-5">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
            <Metric className="gap-1">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-2xl">{value}</MetricValue>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 7. Team / recent activity
 * ────────────────────────────────────────────────────────────────────────── */

interface Member {
  id: string;
  name: string;
  handle: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  avatar?: string;
  initials: string;
}

const members: Member[] = [
  {
    id: "m1",
    name: "Mara Castillo",
    handle: "@mara",
    role: "Owner",
    roleVariant: "primary",
    avatar: "https://i.pravatar.cc/96?img=12",
    initials: "MC",
  },
  {
    id: "m2",
    name: "Devon Lane",
    handle: "@devon",
    role: "Admin",
    roleVariant: "info",
    avatar: "https://i.pravatar.cc/96?img=33",
    initials: "DL",
  },
  {
    id: "m3",
    name: "Priya Sharma",
    handle: "@priya",
    role: "Member",
    roleVariant: "secondary",
    initials: "PS",
  },
  {
    id: "m4",
    name: "Tobias Funke",
    handle: "@tobias",
    role: "Member",
    roleVariant: "secondary",
    avatar: "https://i.pravatar.cc/96?img=68",
    initials: "TF",
  },
];

function TeamCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-6 py-5">
        <CardTitle className="font-display text-base">Team</CardTitle>
        <CardDescription>4 people in this workspace</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Users className="size-4" aria-hidden="true" />
            Invite
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <ul className="flex flex-col">
        {members.map((member, i) => (
          <li
            key={member.id}
            className={`flex items-center gap-3.5 px-6 py-3.5 ${
              i !== members.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Avatar className="size-9">
              {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-fg">{member.name}</span>
              <span className="truncate text-xs text-fg-tertiary">{member.handle}</span>
            </div>
            <Badge variant={member.roleVariant}>{member.role}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 8a. Revenue area chart
 * ────────────────────────────────────────────────────────────────────────── */

const revenueData = [
  { day: "Mon", revenue: 4200 },
  { day: "Tue", revenue: 5100 },
  { day: "Wed", revenue: 4800 },
  { day: "Thu", revenue: 6300 },
  { day: "Fri", revenue: 7400 },
  { day: "Sat", revenue: 6900 },
  { day: "Sun", revenue: 8100 },
];

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

function RevenueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Weekly revenue</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
        <CardAction>
          <Metric className="items-end gap-0">
            <MetricValue className="text-xl">{usd.format(42800)}</MetricValue>
          </Metric>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="aspect-[16/7] w-full">
          <AreaChart accessibilityLayer data={revenueData} margin={{ left: 4, right: 4 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 8b. Spending breakdown donut
 * ────────────────────────────────────────────────────────────────────────── */

const spendData = [
  { category: "Payroll", value: 42, fill: "var(--color-chart-1)" },
  { category: "Software", value: 24, fill: "var(--color-chart-2)" },
  { category: "Marketing", value: 18, fill: "var(--color-chart-3)" },
  { category: "Travel", value: 16, fill: "var(--color-chart-4)" },
];

const spendConfig = {
  value: { label: "Share" },
  Payroll: { label: "Payroll", color: "var(--color-chart-1)" },
  Software: { label: "Software", color: "var(--color-chart-2)" },
  Marketing: { label: "Marketing", color: "var(--color-chart-3)" },
  Travel: { label: "Travel", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

function SpendingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Spending breakdown</CardTitle>
        <CardDescription>This month by category</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5 sm:flex-row">
        <ChartContainer config={spendConfig} className="aspect-square h-40 w-40 shrink-0">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="category" hideLabel />}
            />
            <Pie
              data={spendData}
              dataKey="value"
              nameKey="category"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              strokeWidth={2}
            >
              {spendData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="flex w-full flex-col gap-2.5">
          {spendData.map((entry) => (
            <li key={entry.category} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: entry.fill }}
                aria-hidden="true"
              />
              <span className="flex-1 text-fg-secondary">{entry.category}</span>
              <span className="font-medium text-fg tabular-nums">{entry.value}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Dashboard
 * ────────────────────────────────────────────────────────────────────────── */

export function PreviewDashboard() {
  return (
    <div className="w-full columns-1 gap-5 2xl:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
      <StatRow />
      <ActivityCard />
      <PayoutCard />
      <RevenueCard />
      <SavingsCard />
      <TransactionsCard />
      <InvestCard />
      <SpendingCard />
      <TeamCard />
    </div>
  );
}
