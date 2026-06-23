"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@cooud-ui/ui";
import {
  ArrowRight,
  BarChart3,
  Check,
  Layers,
  Lock,
  Palette,
  Send,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────
   1. HERO
   ────────────────────────────────────────────────────────────────── */

function HeroBlock() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 bg-gradient-primary opacity-20 blur-3xl"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="primary" className="gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Now in public beta
        </Badge>

        <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
          Ship products your team is{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">proud of</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-fg-secondary">
          A modern toolkit for building accessible, themeable interfaces — so you spend less time on
          plumbing and more time on the product your customers love.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button variant="gradient" size="lg">
            Start free trial
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg">
            Book a demo
          </Button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {["AK", "MR", "JD", "SL"].map((initials) => (
              <Avatar key={initials} className="size-9 border-2 border-surface-base shadow-xs">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm text-fg-tertiary">
            Loved by <span className="font-medium text-fg">9,000+</span> builders
          </p>
        </div>
      </div>
    </section>
  );
}

const heroCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
} from "@cooud-ui/ui";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroBlock() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 bg-gradient-primary opacity-20 blur-3xl"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="primary" className="gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Now in public beta
        </Badge>

        <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
          Ship products your team is{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">proud of</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-fg-secondary">
          A modern toolkit for building accessible, themeable interfaces — so you spend less time on
          plumbing and more time on the product your customers love.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button variant="gradient" size="lg">
            Start free trial
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg">
            Book a demo
          </Button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {["AK", "MR", "JD", "SL"].map((initials) => (
              <Avatar key={initials} className="size-9 border-2 border-surface-base shadow-xs">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm text-fg-tertiary">
            Loved by <span className="font-medium text-fg">9,000+</span> builders
          </p>
        </div>
      </div>
    </section>
  );
}`;

function SplitHeroBlock() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Design systems in minutes
          </Badge>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.04] tracking-tight text-fg sm:text-6xl">
            Build the product surface before the backlog catches up.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary">
            Compose accessible primitives, tokenized themes, and production-ready sections without
            re-solving every interaction from scratch.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="gradient" size="lg">
              Start building
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg">
              View templates
            </Button>
          </div>
        </div>

        <Card className="border-border bg-surface-raised/85 shadow-glow backdrop-blur">
          <CardHeader>
            <CardTitle>Release quality</CardTitle>
            <CardDescription>Everything tokenized before handoff.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              ["Components", "52 ready"],
              ["Themes", "Aurora + Neutral"],
              ["Coverage", "A11y pass"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-inset px-4 py-3"
              >
                <span className="text-sm text-fg-secondary">{label}</span>
                <span className="text-sm font-medium text-fg">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

const splitHeroCode = `import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cooud-ui/ui";
import { ArrowRight, Sparkles } from "lucide-react";

export function SplitHeroBlock() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Design systems in minutes
          </Badge>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.04] tracking-tight text-fg sm:text-6xl">
            Build the product surface before the backlog catches up.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary">
            Compose accessible primitives, tokenized themes, and production-ready sections.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="gradient" size="lg">Start building <ArrowRight aria-hidden="true" /></Button>
            <Button variant="outline" size="lg">View templates</Button>
          </div>
        </div>

        <Card className="border-border bg-surface-raised/85 shadow-glow backdrop-blur">
          <CardHeader>
            <CardTitle>Release quality</CardTitle>
            <CardDescription>Everything tokenized before handoff.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              ["Components", "52 ready"],
              ["Themes", "Aurora + Neutral"],
              ["Coverage", "A11y pass"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-surface-inset px-4 py-3">
                <span className="text-sm text-fg-secondary">{label}</span>
                <span className="text-sm font-medium text-fg">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}`;

function CompactHeroBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-lg sm:p-12">
        <Badge variant="primary">New registry</Badge>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          Copy polished product sections into any React app.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-fg-secondary">
          Blocks inherit your theme, radius, color scale, and typography automatically.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="gradient" size="lg">
            Browse blocks
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="lg">
            Read docs
          </Button>
        </div>
        <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {["Accessible", "Themeable", "Composable"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl bg-surface-inset px-3 py-2"
            >
              <Check className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm text-fg-secondary">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const compactHeroCode = `import { Badge, Button } from "@cooud-ui/ui";
import { ArrowRight, Check } from "lucide-react";

export function CompactHeroBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-lg sm:p-12">
        <Badge variant="primary">New registry</Badge>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          Copy polished product sections into any React app.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-fg-secondary">
          Blocks inherit your theme, radius, color scale, and typography automatically.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="gradient" size="lg">Browse blocks <ArrowRight aria-hidden="true" /></Button>
          <Button variant="ghost" size="lg">Read docs</Button>
        </div>
        <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {["Accessible", "Themeable", "Composable"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl bg-surface-inset px-3 py-2">
              <Check className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm text-fg-secondary">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   2. PRICING
   ────────────────────────────────────────────────────────────────── */

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ month",
    description: "Everything you need to launch your first project.",
    features: ["Up to 3 projects", "Community support", "1 GB storage", "Basic analytics"],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    description: "For growing teams that need more power and polish.",
    features: [
      "Unlimited projects",
      "Priority support",
      "50 GB storage",
      "Advanced analytics",
      "Custom domains",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "Dedicated infrastructure and support at scale.",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated success manager", "99.99% uptime SLA"],
    cta: "Contact sales",
    featured: false,
  },
] as const;

function PricingBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Pricing</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Start for free and scale as you grow. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] items-start gap-6">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={
              tier.featured
                ? "relative border-primary shadow-glow lg:-translate-y-3"
                : "border-border"
            }
          >
            {tier.featured ? (
              <Badge
                variant="primary"
                className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1.5"
              >
                <Sparkles aria-hidden="true" className="size-3.5" />
                Most popular
              </Badge>
            ) : null}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-fg">
                  {tier.price}
                </span>
                {tier.cadence ? (
                  <span className="text-sm text-fg-tertiary">{tier.cadence}</span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-fg-secondary">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15">
                      <Check aria-hidden="true" className="size-3 text-primary" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={tier.featured ? "gradient" : "outline"} className="w-full">
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const pricingCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cooud-ui/ui";
import { Check, Sparkles } from "lucide-react";

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ month",
    description: "Everything you need to launch your first project.",
    features: ["Up to 3 projects", "Community support", "1 GB storage", "Basic analytics"],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    description: "For growing teams that need more power and polish.",
    features: [
      "Unlimited projects",
      "Priority support",
      "50 GB storage",
      "Advanced analytics",
      "Custom domains",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "Dedicated infrastructure and support at scale.",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated success manager", "99.99% uptime SLA"],
    cta: "Contact sales",
    featured: false,
  },
] as const;

export function PricingBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Pricing</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Start for free and scale as you grow. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] items-start gap-6">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={
              tier.featured
                ? "relative border-primary shadow-glow lg:-translate-y-3"
                : "border-border"
            }
          >
            {tier.featured ? (
              <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1.5">
                <Sparkles aria-hidden="true" className="size-3.5" />
                Most popular
              </Badge>
            ) : null}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-fg">
                  {tier.price}
                </span>
                {tier.cadence ? (
                  <span className="text-sm text-fg-tertiary">{tier.cadence}</span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-fg-secondary">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15">
                      <Check aria-hidden="true" className="size-3 text-primary" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={tier.featured ? "gradient" : "outline"} className="w-full">
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

function PricingToggleBlock() {
  const tiers = [
    {
      name: "Launch",
      price: "$19",
      description: "For focused teams shipping one product.",
      features: ["Unlimited blocks", "Theme presets", "Email support"],
    },
    {
      name: "Scale",
      price: "$59",
      description: "For teams running multiple surfaces.",
      features: ["Everything in Launch", "Private registry", "Priority support"],
    },
  ] as const;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Plans</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Pick the pace that matches your team.
        </h2>
        <div className="mx-auto mt-6 inline-flex rounded-full border border-border bg-surface-inset p-1">
          <Button variant="secondary" size="sm" className="rounded-full">
            Monthly
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Annual - save 20%
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-6">
        {tiers.map((tier, index) => (
          <Card
            key={tier.name}
            className={index === 1 ? "border-primary shadow-glow" : "border-border"}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-fg">{tier.price}</span>
                <span className="text-sm text-fg-tertiary">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={index === 1 ? "gradient" : "outline"} className="w-full">
                Choose {tier.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const pricingToggleCode = `import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@cooud-ui/ui";
import { Check } from "lucide-react";

export function PricingToggleBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Plans</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Pick the pace that matches your team.
        </h2>
        <div className="mx-auto mt-6 inline-flex rounded-full border border-border bg-surface-inset p-1">
          <Button variant="secondary" size="sm" className="rounded-full">Monthly</Button>
          <Button variant="ghost" size="sm" className="rounded-full">Annual - save 20%</Button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-6">
        {/* Map your plans here */}
      </div>
    </section>
  );
}`;

function UsagePricingBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-6 shadow-lg sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Badge variant="primary">Usage based</Badge>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
              Start small, pay only when your product grows.
            </h2>
            <p className="mt-4 max-w-2xl text-fg-secondary">
              A pricing layout for APIs, infrastructure, and usage-metered products.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["10k events", "5 seats", "99.9% SLA"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-surface-inset px-4 py-3 text-sm text-fg-secondary"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-primary bg-surface-floating shadow-glow">
            <CardHeader>
              <CardTitle>Growth</CardTitle>
              <CardDescription>Best for teams validating scale.</CardDescription>
              <div className="mt-2">
                <span className="font-display text-4xl font-semibold text-fg">$0.08</span>
                <span className="text-sm text-fg-tertiary"> / 1k events</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {["Unlimited projects", "Realtime analytics", "Priority queues"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-fg-secondary">
                  <Check className="size-4 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="gradient" className="w-full">
                Estimate usage
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

const usagePricingCode = `import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@cooud-ui/ui";
import { Check } from "lucide-react";

export function UsagePricingBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-6 shadow-lg sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Badge variant="primary">Usage based</Badge>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
              Start small, pay only when your product grows.
            </h2>
            <p className="mt-4 max-w-2xl text-fg-secondary">
              A pricing layout for APIs, infrastructure, and usage-metered products.
            </p>
          </div>
          <Card className="border-primary bg-surface-floating shadow-glow">
            {/* Highlight your metered plan here */}
          </Card>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   3. FEATURE GRID
   ────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Optimized rendering and zero-runtime styling keep every interaction instant.",
  },
  {
    icon: Palette,
    title: "Themeable by design",
    description: "Swap a palette and every surface, border, and gradient updates live.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "SOC 2 compliant infrastructure with end-to-end encryption on every request.",
  },
  {
    icon: Layers,
    title: "Composable primitives",
    description: "Build complex layouts from small, predictable, accessible building blocks.",
  },
  {
    icon: BarChart3,
    title: "Insightful analytics",
    description: "Understand how people use your product with real-time usage dashboards.",
  },
  {
    icon: Workflow,
    title: "Automate anything",
    description: "Connect your favorite tools and wire up workflows without writing glue code.",
  },
] as const;

function FeatureGridBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Features</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          A thoughtfully crafted set of tools that scales from your first prototype to production.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border">
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

const featureGridCode = `import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cooud-ui/ui";
import {
  BarChart3,
  Layers,
  Lock,
  Palette,
  Workflow,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Optimized rendering and zero-runtime styling keep every interaction instant.",
  },
  {
    icon: Palette,
    title: "Themeable by design",
    description: "Swap a palette and every surface, border, and gradient updates live.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "SOC 2 compliant infrastructure with end-to-end encryption on every request.",
  },
  {
    icon: Layers,
    title: "Composable primitives",
    description: "Build complex layouts from small, predictable, accessible building blocks.",
  },
  {
    icon: BarChart3,
    title: "Insightful analytics",
    description: "Understand how people use your product with real-time usage dashboards.",
  },
  {
    icon: Workflow,
    title: "Automate anything",
    description: "Connect your favorite tools and wire up workflows without writing glue code.",
  },
] as const;

export function FeatureGridBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Features</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          A thoughtfully crafted set of tools that scales from your first prototype to production.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border">
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

function BentoFeatureBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Platform</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          A bento grid for product capabilities.
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-6">
        {FEATURES.slice(0, 4).map((feature, index) => (
          <Card
            key={feature.title}
            className={[
              "border-border bg-surface-raised",
              index === 0 ? "md:col-span-4 md:row-span-2" : "md:col-span-2",
              index === 3 ? "md:col-span-3" : "",
            ].join(" ")}
          >
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <Card className="border-primary bg-gradient-primary text-primary-foreground shadow-glow md:col-span-3">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Production ready</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              Compose, theme, and ship from one registry.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}

const bentoFeatureCode = `import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@cooud-ui/ui";
import { BarChart3, Layers, Lock, Palette, Zap } from "lucide-react";

export function BentoFeatureBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Platform</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          A bento grid for product capabilities.
        </h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-6">
        {/* Use md:col-span-* and md:row-span-* to shape the bento layout */}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   4. CTA
   ────────────────────────────────────────────────────────────────── */

function CtaBlock() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center shadow-glow sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Ready to build something great?
          </h2>
          <p className="mt-4 text-balance text-lg text-primary-foreground/80">
            Join thousands of teams shipping faster. Drop your email and we&apos;ll send you a free
            starter kit.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1 text-left">
              <Label htmlFor="cta-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="cta-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="h-11 border-transparent bg-surface-base text-fg placeholder:text-fg-tertiary"
              />
            </div>
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-4 text-sm text-primary-foreground/70">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

const ctaCode = `import { Button, Input, Label } from "@cooud-ui/ui";
import { Send } from "lucide-react";

export function CtaBlock() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center shadow-glow sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Ready to build something great?
          </h2>
          <p className="mt-4 text-balance text-lg text-primary-foreground/80">
            Join thousands of teams shipping faster. Drop your email and we'll send you a
            free starter kit.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1 text-left">
              <Label htmlFor="cta-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="cta-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="h-11 border-transparent bg-surface-base text-fg placeholder:text-fg-tertiary"
              />
            </div>
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-4 text-sm text-primary-foreground/70">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   Export map
   ────────────────────────────────────────────────────────────────── */

export const marketingBlocks: BlockContentMap = {
  hero: {
    preview: <HeroBlock />,
    code: heroCode,
    variants: [
      {
        id: "centered",
        name: "Centered launch",
        description: "Classic centered SaaS hero with trust proof and two CTAs.",
        appearance: "dark",
        preview: <HeroBlock />,
        code: heroCode,
      },
      {
        id: "split",
        name: "Split dashboard",
        description: "Two-column hero with a compact product-quality panel.",
        appearance: "dark",
        preview: <SplitHeroBlock />,
        code: splitHeroCode,
      },
      {
        id: "compact",
        name: "Compact registry",
        description: "Contained hero card for docs, registries and template libraries.",
        appearance: "light",
        preview: <CompactHeroBlock />,
        code: compactHeroCode,
      },
    ],
  },
  pricing: {
    preview: <PricingBlock />,
    code: pricingCode,
    variants: [
      {
        id: "tiers",
        name: "Three tiers",
        description: "A responsive three-plan grid with a highlighted popular tier.",
        appearance: "dark",
        preview: <PricingBlock />,
        code: pricingCode,
      },
      {
        id: "toggle",
        name: "Plan toggle",
        description: "Two-plan pricing with a monthly/annual segmented control.",
        appearance: "light",
        preview: <PricingToggleBlock />,
        code: pricingToggleCode,
      },
      {
        id: "usage",
        name: "Usage based",
        description: "A metered pricing layout for API, infra and event-based products.",
        appearance: "dark",
        preview: <UsagePricingBlock />,
        code: usagePricingCode,
      },
    ],
  },
  "feature-grid": {
    preview: <FeatureGridBlock />,
    code: featureGridCode,
    variants: [
      {
        id: "cards",
        name: "Card grid",
        description: "Six balanced feature cards for broad capability overviews.",
        appearance: "dark",
        preview: <FeatureGridBlock />,
        code: featureGridCode,
      },
      {
        id: "bento",
        name: "Bento grid",
        description: "Editorial bento layout for showcasing a platform narrative.",
        appearance: "light",
        preview: <BentoFeatureBlock />,
        code: bentoFeatureCode,
      },
    ],
  },
  cta: { preview: <CtaBlock />, code: ctaCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function MarketingGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(marketingBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function MarketingView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(marketingBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
