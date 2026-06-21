"use client";

import {
  AnimatedButton,
  AuroraBackground,
  Button,
  GlassCard,
  GradientBorder,
  GradientText,
  Reveal,
  Shimmer,
  SpotlightCard,
} from "@cooud/ui";
import { ArrowRight, Gauge, Palette, Sparkles, Wand2, Zap } from "lucide-react";
import { Cluster, Section, Subcard } from "./showcase-ui";

export function PremiumGallery() {
  return (
    <div className="mt-16 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
          Premium &amp; Brand
        </h2>
        <p className="max-w-2xl text-sm text-fg-secondary">
          Wave 4 — the showpiece surfaces. Aurora gradients, frosted glass, cursor-tracking
          spotlights, and motion that springs to life as you scroll. Every effect is token-driven
          and theme-aware.
        </p>
      </div>

      <GradientTextSection />
      <GlassCardSection />
      <GradientBorderSection />
      <SpotlightCardSection />
      <AuroraBackgroundSection />
      <AnimatedButtonSection />
      <RevealSection />
    </div>
  );
}

// ── 1. GradientText ────────────────────────────────────────────────
function GradientTextSection() {
  return (
    <Section
      title="Gradient Text"
      description="Display headings clipped to the Aurora gradient — brand voice at any scale."
    >
      <div className="flex flex-col gap-6">
        <GradientText asChild>
          <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Design that themes itself
          </h3>
        </GradientText>
        <GradientText asChild>
          <h3 className="font-display text-3xl font-semibold tracking-tight">
            One source of truth
          </h3>
        </GradientText>
        <GradientText asChild>
          <h3 className="font-display text-xl font-semibold">Built for the Cooud platform</h3>
        </GradientText>
      </div>
    </Section>
  );
}

// ── 2. GlassCard ───────────────────────────────────────────────────
function GlassCardSection() {
  const cards = [
    {
      icon: Palette,
      title: "Living tokens",
      body: "Every surface, border, and shadow flows from a single semantic palette you can re-theme live.",
    },
    {
      icon: Gauge,
      title: "Effortless speed",
      body: "Server-first rendering and zero-runtime styling keep the frosted layers buttery smooth.",
    },
    {
      icon: Sparkles,
      title: "Premium by default",
      body: "Aurora gradients and frosted blur ship out of the box — no design debt to pay down.",
    },
  ];

  return (
    <Section
      title="Glass Card"
      description="Frosted-glass surfaces floating over a colorful Aurora backdrop — the blur reveals the depth."
    >
      <div className="relative overflow-hidden rounded-2xl">
        <AuroraBackground className="absolute inset-0" />
        <div className="relative grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <GlassCard key={card.title} className="flex flex-col gap-3 p-5">
              <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                <card.icon className="size-4" aria-hidden="true" />
              </span>
              <h4 className="font-display text-base font-semibold text-fg">{card.title}</h4>
              <p className="text-sm text-fg-secondary">{card.body}</p>
              <Button variant="outline" size="sm" className="mt-1 w-fit">
                Learn more
                <ArrowRight aria-hidden="true" />
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── 3. GradientBorder ──────────────────────────────────────────────
function GradientBorderSection() {
  return (
    <Section
      title="Gradient Border"
      description="An Aurora gradient ring around any panel — with or without an ambient glow."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Subcard label="With glow">
          <GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
            <h4 className="font-display text-base font-semibold text-fg">Pro plan</h4>
            <p className="text-sm text-fg-secondary">
              The glowing border draws the eye to your highest-value surface.
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-fg">$29</span>
              <span className="text-sm text-fg-tertiary">/ month</span>
            </div>
          </GradientBorder>
        </Subcard>

        <Subcard label="Without glow">
          <GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
            <h4 className="font-display text-base font-semibold text-fg">Starter plan</h4>
            <p className="text-sm text-fg-secondary">
              The same gradient ring, kept calm and flat for secondary surfaces.
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-fg">$0</span>
              <span className="text-sm text-fg-tertiary">/ forever</span>
            </div>
          </GradientBorder>
        </Subcard>
      </div>
    </Section>
  );
}

// ── 4. SpotlightCard ───────────────────────────────────────────────
function SpotlightCardSection() {
  const features = [
    {
      icon: Wand2,
      title: "Live theming",
      body: "Re-skin the entire system from one control panel — no rebuild required.",
    },
    {
      icon: Zap,
      title: "Motion built in",
      body: "Spring presets and scroll reveals come wired to your tokens.",
    },
    {
      icon: Gauge,
      title: "Accessible core",
      body: "Radix primitives and focus-visible rings ship on by default.",
    },
  ];

  return (
    <Section
      title="Spotlight Card"
      description="A radial spotlight follows your cursor across each card — hover to bring it to life."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <SpotlightCard key={feature.title} className="flex flex-col gap-3 p-5">
            <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-accent">
              <feature.icon className="size-4" aria-hidden="true" />
            </span>
            <h4 className="font-display text-base font-semibold text-fg">{feature.title}</h4>
            <p className="text-sm text-fg-secondary">{feature.body}</p>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}

// ── 5. AuroraBackground ────────────────────────────────────────────
function AuroraBackgroundSection() {
  return (
    <Section
      title="Aurora Background"
      description="An animated aurora backdrop wrapping a hero banner — the brand's signature first impression."
    >
      <AuroraBackground className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl">
        <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
          <GradientText asChild>
            <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Ship something beautiful
            </h3>
          </GradientText>
          <p className="text-balance text-sm text-fg-secondary">
            Accessible, token-driven React components with premium motion baked in. Re-theme the
            whole experience from a single source of truth.
          </p>
          <AnimatedButton variant="gradient" size="lg">
            Get started
            <ArrowRight aria-hidden="true" />
          </AnimatedButton>
        </div>
      </AuroraBackground>
    </Section>
  );
}

// ── 6. AnimatedButton ──────────────────────────────────────────────
function AnimatedButtonSection() {
  return (
    <Section
      title="Animated Button"
      description="Motion-spring buttons that lift on hover and settle on tap — across every variant."
    >
      <Cluster label="Variants">
        <AnimatedButton variant="primary">Primary</AnimatedButton>
        <AnimatedButton variant="gradient">
          <Sparkles aria-hidden="true" />
          Gradient
        </AnimatedButton>
        <AnimatedButton variant="outline">Outline</AnimatedButton>
        <AnimatedButton variant="secondary">Secondary</AnimatedButton>
      </Cluster>
    </Section>
  );
}

// ── 7. Reveal (+ Shimmer) ──────────────────────────────────────────
function RevealSection() {
  const rows = [
    {
      delay: 0,
      title: "Reveal as you scroll",
      body: "Each row fades and slides into view the moment it enters the viewport.",
    },
    {
      delay: 0.1,
      title: "Stagger with delay",
      body: "Increasing delays cascade the rows for a polished, intentional reveal.",
    },
    {
      delay: 0.2,
      title: "Once and done",
      body: "Reveals fire a single time, so the section settles instead of replaying.",
    },
  ];

  return (
    <Section
      title="Reveal &amp; Shimmer"
      description="Scroll-into-view reveals with staggered delays, plus a premium shimmer loading surface."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <Reveal
              key={row.title}
              delay={row.delay}
              className="flex flex-col gap-1 rounded-xl border border-border-soft bg-surface-inset p-5"
            >
              <h4 className="font-display text-base font-semibold text-fg">{row.title}</h4>
              <p className="text-sm text-fg-secondary">{row.body}</p>
            </Reveal>
          ))}
        </div>

        <Subcard label="Shimmer">
          <div className="flex flex-col gap-3">
            <Shimmer className="h-8 w-48 rounded-lg" />
            <Shimmer className="h-4 w-full rounded-md" />
            <Shimmer className="h-4 w-3/4 rounded-md" />
            <Shimmer className="h-10 w-32 rounded-lg" />
          </div>
        </Subcard>
      </div>
    </Section>
  );
}
