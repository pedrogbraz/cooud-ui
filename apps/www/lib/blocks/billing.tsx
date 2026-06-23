"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { Check, CreditCard, Download } from "lucide-react";
import { useState } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Subscription — current plan, usage meters, payment method, invoices
 * ────────────────────────────────────────────────────────────────────────── */

interface UsageMeter {
  id: string;
  label: string;
  used: number;
  limit: number;
  display: string;
  value: number;
}

const usageMeters: UsageMeter[] = [
  { id: "usage-seats", label: "Seats", used: 18, limit: 25, display: "18 / 25", value: 72 },
  {
    id: "usage-storage",
    label: "Storage",
    used: 164,
    limit: 250,
    display: "164 GB / 250 GB",
    value: 66,
  },
  {
    id: "usage-api",
    label: "API calls",
    used: 842_000,
    limit: 1_000_000,
    display: "842K / 1M",
    value: 84,
  },
];

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
}

const invoices: Invoice[] = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$245.00", status: "Pending" },
];

export function SubscriptionBlock() {
  return (
    <section
      aria-label="Subscription and billing"
      className="mx-auto flex w-full max-w-3xl flex-col gap-6"
    >
      {/* Current plan */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Current plan</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Your workspace is on the Team plan, billed monthly.
          </p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl font-semibold text-fg">Team</span>
            <span className="text-sm text-fg-secondary">Renews Jul 1, 2026</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$290</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="outline" size="sm">
            Change plan
          </Button>
          <Button variant="ghost" size="sm">
            Cancel subscription
          </Button>
        </CardFooter>
      </Card>

      {/* Usage meters */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Usage</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Current billing period · resets Jul 1, 2026.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {usageMeters.map(({ id, label, display, value }) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-fg">{label}</span>
                <span className="text-fg-secondary">{display}</span>
              </div>
              <Progress value={value} aria-label={`${label} usage: ${display}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment method</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Visa ending in 4242</span>
              <span className="text-sm text-fg-tertiary">Expires 08 / 2028</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Invoices</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Download receipts for your past payments.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{invoice.id}</TableCell>
                  <TableCell className="text-fg-secondary">{invoice.date}</TableCell>
                  <TableCell className="text-fg">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right sm:pr-6">
                    <Button variant="ghost" size="icon-sm" aria-label={`Download ${invoice.id}`}>
                      <Download className="size-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

const subscriptionCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { CreditCard, Download } from "lucide-react";

interface UsageMeter {
  id: string;
  label: string;
  display: string;
  value: number;
}

const usageMeters: UsageMeter[] = [
  { id: "usage-seats", label: "Seats", display: "18 / 25", value: 72 },
  { id: "usage-storage", label: "Storage", display: "164 GB / 250 GB", value: 66 },
  { id: "usage-api", label: "API calls", display: "842K / 1M", value: 84 },
];

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
}

const invoices: Invoice[] = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$245.00", status: "Pending" },
];

export function SubscriptionBlock() {
  return (
    <section aria-label="Subscription and billing" className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Current plan */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Current plan</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Your workspace is on the Team plan, billed monthly.
          </p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl font-semibold text-fg">Team</span>
            <span className="text-sm text-fg-secondary">Renews Jul 1, 2026</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$290</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="outline" size="sm">
            Change plan
          </Button>
          <Button variant="ghost" size="sm">
            Cancel subscription
          </Button>
        </CardFooter>
      </Card>

      {/* Usage meters */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Usage</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Current billing period · resets Jul 1, 2026.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {usageMeters.map(({ id, label, display, value }) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-fg">{label}</span>
                <span className="text-fg-secondary">{display}</span>
              </div>
              <Progress value={value} aria-label={\`\${label} usage: \${display}\`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment method</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Visa ending in 4242</span>
              <span className="text-sm text-fg-tertiary">Expires 08 / 2028</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Invoices</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Download receipts for your past payments.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{invoice.id}</TableCell>
                  <TableCell className="text-fg-secondary">{invoice.date}</TableCell>
                  <TableCell className="text-fg">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right sm:pr-6">
                    <Button variant="ghost" size="icon-sm" aria-label={\`Download \${invoice.id}\`}>
                      <Download className="size-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Plans — three-tier plan selector with monthly/annual toggle
 * ────────────────────────────────────────────────────────────────────────── */

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For individuals shipping their first project.",
    monthly: 0,
    annual: 0,
    features: ["1 workspace", "Up to 3 seats", "5 GB storage", "Community support"],
    cta: "Get started",
  },
  {
    id: "team",
    name: "Team",
    tagline: "For growing teams that need room to scale.",
    monthly: 29,
    annual: 24,
    features: [
      "Unlimited workspaces",
      "Up to 25 seats",
      "250 GB storage",
      "Priority email support",
      "Usage analytics",
    ],
    cta: "Upgrade to Team",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations with advanced controls.",
    monthly: 89,
    annual: 74,
    features: [
      "Everything in Team",
      "SSO & SCIM",
      "Unlimited storage",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact sales",
  },
];

export function PlansBlock() {
  const [annual, setAnnual] = useState(true);

  return (
    <section aria-label="Choose a plan" className="flex w-full flex-col gap-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Pick the plan that fits</h2>
          <p className="text-sm text-fg-secondary">
            Switch plans or cancel anytime. Annual billing saves you up to 17%.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={annual ? "text-sm text-fg-tertiary" : "text-sm font-medium text-fg"}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Bill annually" />
          <span className={annual ? "text-sm font-medium text-fg" : "text-sm text-fg-tertiary"}>
            Annual
          </span>
          <Badge variant="primary">Save 17%</Badge>
        </div>
      </header>

      <div className="grid items-start gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative gap-5 border-primary shadow-glow"
                  : "relative gap-5 shadow-sm"
              }
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">Popular</Badge>
                </div>
              ) : null}
              <CardHeader>
                <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                <p className="col-span-full text-sm text-fg-secondary">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-fg">${price}</span>
                  <span className="text-sm text-fg-tertiary">
                    {price === 0 ? "forever" : annual ? "/ mo, billed yearly" : "/ month"}
                  </span>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-fg">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.popular ? "gradient" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

const plansCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Switch,
} from "@cooud-ui/ui";
import { Check } from "lucide-react";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For individuals shipping their first project.",
    monthly: 0,
    annual: 0,
    features: ["1 workspace", "Up to 3 seats", "5 GB storage", "Community support"],
    cta: "Get started",
  },
  {
    id: "team",
    name: "Team",
    tagline: "For growing teams that need room to scale.",
    monthly: 29,
    annual: 24,
    features: [
      "Unlimited workspaces",
      "Up to 25 seats",
      "250 GB storage",
      "Priority email support",
      "Usage analytics",
    ],
    cta: "Upgrade to Team",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations with advanced controls.",
    monthly: 89,
    annual: 74,
    features: [
      "Everything in Team",
      "SSO & SCIM",
      "Unlimited storage",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact sales",
  },
];

export function PlansBlock() {
  const [annual, setAnnual] = useState(true);

  return (
    <section aria-label="Choose a plan" className="flex w-full flex-col gap-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Pick the plan that fits</h2>
          <p className="text-sm text-fg-secondary">
            Switch plans or cancel anytime. Annual billing saves you up to 17%.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={annual ? "text-sm text-fg-tertiary" : "text-sm font-medium text-fg"}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Bill annually" />
          <span className={annual ? "text-sm font-medium text-fg" : "text-sm text-fg-tertiary"}>
            Annual
          </span>
          <Badge variant="primary">Save 17%</Badge>
        </div>
      </header>

      <div className="grid items-start gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative gap-5 border-primary shadow-glow"
                  : "relative gap-5 shadow-sm"
              }
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">Popular</Badge>
                </div>
              ) : null}
              <CardHeader>
                <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                <p className="col-span-full text-sm text-fg-secondary">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-fg">\${price}</span>
                  <span className="text-sm text-fg-tertiary">
                    {price === 0 ? "forever" : annual ? "/ mo, billed yearly" : "/ month"}
                  </span>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-fg">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.popular ? "gradient" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const billingBlocks: BlockContentMap = {
  billing: {
    preview: <SubscriptionBlock />,
    code: subscriptionCode,
    variants: [
      {
        id: "subscription",
        name: "Subscription",
        description:
          "Current plan, usage meters, payment method, and a downloadable invoice history.",
        appearance: "dark",
        preview: <SubscriptionBlock />,
        code: subscriptionCode,
      },
      {
        id: "plans",
        name: "Plan selector",
        description:
          "Three-tier plan picker with a highlighted popular plan and a monthly/annual toggle.",
        appearance: "light",
        preview: <PlansBlock />,
        code: plansCode,
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

export function BillingGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(billingBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function BillingView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(billingBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
