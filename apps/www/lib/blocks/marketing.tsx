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
} from "@cooud/ui";
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
} from "@cooud/ui";
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

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-3">
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
} from "@cooud/ui";
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

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-3">
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

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
} from "@cooud/ui";
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

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

const ctaCode = `import { Button, Input, Label } from "@cooud/ui";
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
  hero: { preview: <HeroBlock />, code: heroCode },
  pricing: { preview: <PricingBlock />, code: pricingCode },
  "feature-grid": { preview: <FeatureGridBlock />, code: featureGridCode },
  cta: { preview: <CtaBlock />, code: ctaCode },
};
