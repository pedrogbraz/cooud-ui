"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Separator,
  Switch,
} from "@cooud/ui";
import {
  Activity,
  ChartColumnIncreasing,
  Chrome,
  DollarSign,
  Github,
  MoreHorizontal,
  TrendingDown,
  UserMinus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Stats — dashboard KPI row
 * ────────────────────────────────────────────────────────────────────────── */

export function StatsBlock() {
  const stats = [
    {
      label: "Revenue",
      value: "$48,290",
      delta: "+12.4%",
      trend: "up" as const,
      icon: DollarSign,
      hint: "vs. last month",
    },
    {
      label: "Active users",
      value: "9,184",
      delta: "+5.2%",
      trend: "up" as const,
      icon: Users,
      hint: "vs. last month",
    },
    {
      label: "Conversion",
      value: "3.84%",
      delta: "+0.6%",
      trend: "up" as const,
      icon: Activity,
      hint: "vs. last month",
    },
    {
      label: "Churn",
      value: "1.92%",
      delta: "-0.3%",
      trend: "down" as const,
      icon: TrendingDown,
      hint: "vs. last month",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
      {stats.map(({ label, value, delta, trend, icon: Icon, hint }) => (
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
              <span className="text-xs text-fg-tertiary">{hint}</span>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const statsCode = `import {
  Card,
  CardContent,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
} from "@cooud/ui";
import { Activity, DollarSign, TrendingDown, Users } from "lucide-react";

export function StatsBlock() {
  const stats = [
    {
      label: "Revenue",
      value: "$48,290",
      delta: "+12.4%",
      trend: "up" as const,
      icon: DollarSign,
      hint: "vs. last month",
    },
    {
      label: "Active users",
      value: "9,184",
      delta: "+5.2%",
      trend: "up" as const,
      icon: Users,
      hint: "vs. last month",
    },
    {
      label: "Conversion",
      value: "3.84%",
      delta: "+0.6%",
      trend: "up" as const,
      icon: Activity,
      hint: "vs. last month",
    },
    {
      label: "Churn",
      value: "1.92%",
      delta: "-0.3%",
      trend: "down" as const,
      icon: TrendingDown,
      hint: "vs. last month",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
      {stats.map(({ label, value, delta, trend, icon: Icon, hint }) => (
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
              <span className="text-xs text-fg-tertiary">{hint}</span>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`;

export function StatsCompactBlock() {
  const stats = [
    { label: "Net revenue", value: "$128.4k", delta: "+18.2%", trend: "up" as const },
    { label: "New accounts", value: "1,482", delta: "+9.7%", trend: "up" as const },
    { label: "Expansion", value: "$24.1k", delta: "+4.1%", trend: "up" as const },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="font-display text-lg">Growth snapshot</CardTitle>
          <p className="mt-1 text-sm text-fg-secondary">Last 30 days</p>
        </div>
        <Badge variant="success">On track</Badge>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend }) => (
          <Metric key={label} className="gap-1.5">
            <MetricLabel>{label}</MetricLabel>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <MetricValue className="text-3xl">{value}</MetricValue>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
          </Metric>
        ))}
      </CardContent>
    </Card>
  );
}

const statsCompactCode = `import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
} from "@cooud/ui";

export function StatsCompactBlock() {
  const stats = [
    { label: "Net revenue", value: "$128.4k", delta: "+18.2%", trend: "up" as const },
    { label: "New accounts", value: "1,482", delta: "+9.7%", trend: "up" as const },
    { label: "Expansion", value: "$24.1k", delta: "+4.1%", trend: "up" as const },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="font-display text-lg">Growth snapshot</CardTitle>
          <p className="mt-1 text-sm text-fg-secondary">Last 30 days</p>
        </div>
        <Badge variant="success">On track</Badge>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend }) => (
          <Metric key={label} className="gap-1.5">
            <MetricLabel>{label}</MetricLabel>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <MetricValue className="text-3xl">{value}</MetricValue>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
          </Metric>
        ))}
      </CardContent>
    </Card>
  );
}`;

export function StatsPipelineBlock() {
  const stats = [
    {
      label: "Trials started",
      value: "2,184",
      delta: "+16.8%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: "Qualified demos",
      value: "642",
      delta: "+7.4%",
      trend: "up" as const,
      icon: Activity,
    },
    {
      label: "Paid upgrades",
      value: "238",
      delta: "+11.1%",
      trend: "up" as const,
      icon: DollarSign,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">Activation funnel</CardTitle>
        <p className="text-sm text-fg-secondary">Weekly product-led conversion</p>
      </CardHeader>
      <CardContent className="grid gap-0 overflow-hidden rounded-xl border border-border sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend, icon: Icon }, index) => (
          <div
            key={label}
            className="flex flex-col gap-4 border-border bg-surface-raised p-5 sm:border-l sm:first:border-l-0"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-fg-tertiary">Step {index + 1}</span>
            </div>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl">{value}</MetricValue>
            </Metric>
            <MetricDelta trend={trend}>{delta}</MetricDelta>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const statsPipelineCode = `import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
} from "@cooud/ui";
import { Activity, DollarSign, Users } from "lucide-react";

export function StatsPipelineBlock() {
  const stats = [
    {
      label: "Trials started",
      value: "2,184",
      delta: "+16.8%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: "Qualified demos",
      value: "642",
      delta: "+7.4%",
      trend: "up" as const,
      icon: Activity,
    },
    {
      label: "Paid upgrades",
      value: "238",
      delta: "+11.1%",
      trend: "up" as const,
      icon: DollarSign,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">Activation funnel</CardTitle>
        <p className="text-sm text-fg-secondary">Weekly product-led conversion</p>
      </CardHeader>
      <CardContent className="grid gap-0 overflow-hidden rounded-xl border border-border sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend, icon: Icon }, index) => (
          <div
            key={label}
            className="flex flex-col gap-4 border-border bg-surface-raised p-5 sm:border-l sm:first:border-l-0"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-fg-tertiary">Step {index + 1}</span>
            </div>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl">{value}</MetricValue>
            </Metric>
            <MetricDelta trend={trend}>{delta}</MetricDelta>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Login — centered auth card
 * ────────────────────────────────────────────────────────────────────────── */

export function LoginBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Welcome back</CardTitle>
            <p className="text-sm text-fg-secondary">Sign in to your Cooud workspace</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-remember"
              className="flex items-center gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="login-remember" defaultChecked />
              Remember me
            </Label>
            <a
              href="#forgot"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Sign in
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="#signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const loginCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
} from "@cooud/ui";
import { ChartColumnIncreasing, Chrome, Github } from "lucide-react";

export function LoginBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Welcome back</CardTitle>
            <p className="text-sm text-fg-secondary">Sign in to your Cooud workspace</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="login-remember" className="flex items-center gap-2 font-normal text-fg-secondary">
              <Checkbox id="login-remember" defaultChecked />
              Remember me
            </Label>
            <a
              href="#forgot"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Sign in
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="#signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Settings — account settings panel
 * ────────────────────────────────────────────────────────────────────────── */

interface Preference {
  id: string;
  label: string;
  description: string;
}

const preferences: Preference[] = [
  {
    id: "pref-product",
    label: "Product updates",
    description: "News about features and improvements.",
  },
  {
    id: "pref-security",
    label: "Security alerts",
    description: "Get notified about new sign-ins and suspicious activity.",
  },
  {
    id: "pref-digest",
    label: "Weekly digest",
    description: "A summary of your workspace activity, every Monday.",
  },
];

export function SettingsBlock() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "pref-product": true,
    "pref-security": true,
    "pref-digest": false,
  });

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Card className="mx-auto w-full max-w-xl shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Account settings</CardTitle>
        <p className="text-sm text-fg-secondary">
          Manage your profile and notification preferences.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Profile */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Mara Castillo" />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input id="settings-name" defaultValue="Mara Castillo" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" defaultValue="mara@cooud.io" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Preferences */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Preferences
          </h3>
          <div className="flex flex-col gap-4">
            {preferences.map(({ id, label, description }) => (
              <div key={id} className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={id}>{label}</Label>
                  <p className="text-sm text-fg-secondary">{description}</p>
                </div>
                <Switch
                  id={id}
                  checked={enabled[id]}
                  onCheckedChange={() => toggle(id)}
                  aria-label={label}
                />
              </div>
            ))}
          </div>
        </section>
      </CardContent>

      <Separator />

      <CardFooter className="justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="gradient">Save changes</Button>
      </CardFooter>
    </Card>
  );
}

const settingsCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
} from "@cooud/ui";
import { useState } from "react";

interface Preference {
  id: string;
  label: string;
  description: string;
}

const preferences: Preference[] = [
  {
    id: "pref-product",
    label: "Product updates",
    description: "News about features and improvements.",
  },
  {
    id: "pref-security",
    label: "Security alerts",
    description: "Get notified about new sign-ins and suspicious activity.",
  },
  {
    id: "pref-digest",
    label: "Weekly digest",
    description: "A summary of your workspace activity, every Monday.",
  },
];

export function SettingsBlock() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "pref-product": true,
    "pref-security": true,
    "pref-digest": false,
  });

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Card className="mx-auto w-full max-w-xl shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Account settings</CardTitle>
        <p className="text-sm text-fg-secondary">
          Manage your profile and notification preferences.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Profile */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Mara Castillo" />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input id="settings-name" defaultValue="Mara Castillo" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" defaultValue="mara@cooud.io" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Preferences */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Preferences
          </h3>
          <div className="flex flex-col gap-4">
            {preferences.map(({ id, label, description }) => (
              <div key={id} className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={id}>{label}</Label>
                  <p className="text-sm text-fg-secondary">{description}</p>
                </div>
                <Switch
                  id={id}
                  checked={enabled[id]}
                  onCheckedChange={() => toggle(id)}
                  aria-label={label}
                />
              </div>
            ))}
          </div>
        </section>
      </CardContent>

      <Separator />

      <CardFooter className="justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="gradient">Save changes</Button>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Team — team-members list
 * ────────────────────────────────────────────────────────────────────────── */

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  avatar?: string;
  initials: string;
}

const members: Member[] = [
  {
    id: "m1",
    name: "Mara Castillo",
    email: "mara@cooud.io",
    role: "Owner",
    roleVariant: "primary",
    avatar: "https://i.pravatar.cc/96?img=12",
    initials: "MC",
  },
  {
    id: "m2",
    name: "Devon Lane",
    email: "devon@cooud.io",
    role: "Admin",
    roleVariant: "info",
    avatar: "https://i.pravatar.cc/96?img=33",
    initials: "DL",
  },
  {
    id: "m3",
    name: "Priya Sharma",
    email: "priya@cooud.io",
    role: "Member",
    roleVariant: "secondary",
    initials: "PS",
  },
  {
    id: "m4",
    name: "Tobias Funke",
    email: "tobias@cooud.io",
    role: "Member",
    roleVariant: "secondary",
    avatar: "https://i.pravatar.cc/96?img=68",
    initials: "TF",
  },
  {
    id: "m5",
    name: "Aiko Tanaka",
    email: "aiko@cooud.io",
    role: "Member",
    roleVariant: "secondary",
    initials: "AT",
  },
];

export function TeamBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 py-0 shadow-md">
      <CardHeader className="items-center px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">Team members</CardTitle>
          <p className="text-sm text-fg-secondary">Invite and manage your workspace teammates.</p>
        </div>
        <Button variant="gradient" size="sm" className="col-start-2 row-span-2 self-center">
          <Users className="size-4" aria-hidden="true" />
          Invite
        </Button>
      </CardHeader>

      <Separator />

      <ul className="flex flex-col">
        {members.map((member, i) => (
          <li
            key={member.id}
            className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-overlay/60 ${
              i !== members.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Avatar>
              {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-fg">{member.name}</span>
              <span className="truncate text-sm text-fg-secondary">{member.email}</span>
            </div>

            <Badge variant={member.roleVariant}>{member.role}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`}>
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="size-4" aria-hidden="true" />
                  Change role
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error focus:text-error">
                  <UserMinus className="size-4" aria-hidden="true" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const teamCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@cooud/ui";
import { MoreHorizontal, UserMinus, Users } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  avatar?: string;
  initials: string;
}

const members: Member[] = [
  {
    id: "m1",
    name: "Mara Castillo",
    email: "mara@cooud.io",
    role: "Owner",
    roleVariant: "primary",
    avatar: "https://i.pravatar.cc/96?img=12",
    initials: "MC",
  },
  {
    id: "m2",
    name: "Devon Lane",
    email: "devon@cooud.io",
    role: "Admin",
    roleVariant: "info",
    avatar: "https://i.pravatar.cc/96?img=33",
    initials: "DL",
  },
  {
    id: "m3",
    name: "Priya Sharma",
    email: "priya@cooud.io",
    role: "Member",
    roleVariant: "secondary",
    initials: "PS",
  },
  {
    id: "m4",
    name: "Tobias Funke",
    email: "tobias@cooud.io",
    role: "Member",
    roleVariant: "secondary",
    avatar: "https://i.pravatar.cc/96?img=68",
    initials: "TF",
  },
  {
    id: "m5",
    name: "Aiko Tanaka",
    email: "aiko@cooud.io",
    role: "Member",
    roleVariant: "secondary",
    initials: "AT",
  },
];

export function TeamBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 py-0 shadow-md">
      <CardHeader className="items-center px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">Team members</CardTitle>
          <p className="text-sm text-fg-secondary">Invite and manage your workspace teammates.</p>
        </div>
        <Button variant="gradient" size="sm" className="col-start-2 row-span-2 self-center">
          <Users className="size-4" aria-hidden="true" />
          Invite
        </Button>
      </CardHeader>

      <Separator />

      <ul className="flex flex-col">
        {members.map((member, i) => (
          <li
            key={member.id}
            className={\`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-overlay/60 \${
              i !== members.length - 1 ? "border-b border-border" : ""
            }\`}
          >
            <Avatar>
              {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-fg">{member.name}</span>
              <span className="truncate text-sm text-fg-secondary">{member.email}</span>
            </div>

            <Badge variant={member.roleVariant}>{member.role}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={\`Actions for \${member.name}\`}>
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="size-4" aria-hidden="true" />
                  Change role
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error focus:text-error">
                  <UserMinus className="size-4" aria-hidden="true" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const applicationBlocks: BlockContentMap = {
  stats: {
    preview: <StatsBlock />,
    code: statsCode,
    variants: [
      {
        id: "kpi-grid",
        name: "KPI grid",
        description: "Four-card dashboard metrics with icons, deltas, and contextual hints.",
        appearance: "dark",
        preview: <StatsBlock />,
        code: statsCode,
      },
      {
        id: "compact-summary",
        name: "Compact summary",
        description: "A single-card metric summary for dense dashboards and overview panels.",
        appearance: "light",
        preview: <StatsCompactBlock />,
        code: statsCompactCode,
      },
      {
        id: "pipeline-funnel",
        name: "Pipeline funnel",
        description: "A segmented stats card for activation, pipeline, or conversion steps.",
        appearance: "dark",
        preview: <StatsPipelineBlock />,
        code: statsPipelineCode,
      },
    ],
  },
  login: { preview: <LoginBlock />, code: loginCode },
  settings: { preview: <SettingsBlock />, code: settingsCode },
  team: { preview: <TeamBlock />, code: teamCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function ApplicationGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(applicationBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function ApplicationView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(applicationBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
