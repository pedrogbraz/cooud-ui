"use client";

import {
  AuroraBackground,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  GlassCard,
  GradientBorder,
  GradientText,
  Reveal,
  Shimmer,
  SpotlightCard,
} from "@cooud/ui";
import { ArrowRight, Gauge, Sparkles } from "lucide-react";
import type { ExampleMap } from "./types";

export const premiumExamples: ExampleMap = {
  "glass-card": [
    {
      id: "frosted-surface",
      title: "Frosted surface",
      description:
        "A frosted-glass panel floating over a colorful backdrop — the backdrop-blur is what reveals the depth, so always give it something vivid to sit on.",
      code: `<div className="relative overflow-hidden rounded-2xl">
  <AuroraBackground className="absolute inset-0" />
  <div className="relative p-6">
    <GlassCard className="flex flex-col gap-3 p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold text-fg">Premium by default</h3>
      <p className="text-sm text-fg-secondary">
        Aurora gradients and frosted blur ship out of the box — no design debt to pay down.
      </p>
    </GlassCard>
  </div>
</div>`,
      preview: (
        <div className="relative overflow-hidden rounded-2xl">
          <AuroraBackground className="absolute inset-0" />
          <div className="relative p-6">
            <GlassCard className="flex flex-col gap-3 p-5">
              <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold text-fg">Premium by default</h3>
              <p className="text-sm text-fg-secondary">
                Aurora gradients and frosted blur ship out of the box — no design debt to pay down.
              </p>
            </GlassCard>
          </div>
        </div>
      ),
    },
  ],
  "gradient-border": [
    {
      id: "with-glow",
      title: "With glow",
      description: "Pass `glow` to add an ambient shadow that draws the eye to a hero surface.",
      code: `<GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
  <h3 className="font-display text-base font-semibold text-fg">Pro plan</h3>
  <p className="text-sm text-fg-secondary">
    The glowing border draws the eye to your highest-value surface.
  </p>
  <div className="flex items-baseline gap-1">
    <span className="font-display text-2xl font-semibold text-fg">$29</span>
    <span className="text-sm text-fg-tertiary">/ month</span>
  </div>
</GradientBorder>`,
      preview: (
        <GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
          <h3 className="font-display text-base font-semibold text-fg">Pro plan</h3>
          <p className="text-sm text-fg-secondary">
            The glowing border draws the eye to your highest-value surface.
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold text-fg">$29</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </div>
        </GradientBorder>
      ),
    },
    {
      id: "flat",
      title: "Flat",
      description: "Omit `glow` for the same gradient ring, kept calm for secondary surfaces.",
      code: `<GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
  <h3 className="font-display text-base font-semibold text-fg">Starter plan</h3>
  <p className="text-sm text-fg-secondary">
    The same gradient ring, kept calm and flat for secondary surfaces.
  </p>
  <div className="flex items-baseline gap-1">
    <span className="font-display text-2xl font-semibold text-fg">$0</span>
    <span className="text-sm text-fg-tertiary">/ forever</span>
  </div>
</GradientBorder>`,
      preview: (
        <GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
          <h3 className="font-display text-base font-semibold text-fg">Starter plan</h3>
          <p className="text-sm text-fg-secondary">
            The same gradient ring, kept calm and flat for secondary surfaces.
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold text-fg">$0</span>
            <span className="text-sm text-fg-tertiary">/ forever</span>
          </div>
        </GradientBorder>
      ),
    },
  ],
  "gradient-text": [
    {
      id: "headline",
      title: "Headline",
      description:
        "Use `asChild` to clip your own heading element to the Aurora gradient — the typography stays yours, the fill is the brand's.",
      code: `<GradientText asChild>
  <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
    Design that themes itself
  </h3>
</GradientText>`,
      preview: (
        <GradientText asChild>
          <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Design that themes itself
          </h3>
        </GradientText>
      ),
    },
  ],
  "spotlight-card": [
    {
      id: "hover-spotlight",
      title: "Hover spotlight",
      description:
        "A radial spotlight tracks your cursor across the card — hover anywhere over it to bring the surface to life.",
      code: `<SpotlightCard className="flex flex-col gap-3 p-5">
  <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-primary">
    <Gauge className="size-4" aria-hidden="true" />
  </span>
  <h3 className="font-display text-base font-semibold text-fg">Accessible core</h3>
  <p className="text-sm text-fg-secondary">
    Radix primitives and focus-visible rings ship on by default.
  </p>
</SpotlightCard>`,
      preview: (
        <SpotlightCard className="flex flex-col gap-3 p-5">
          <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-primary">
            <Gauge className="size-4" aria-hidden="true" />
          </span>
          <h3 className="font-display text-base font-semibold text-fg">Accessible core</h3>
          <p className="text-sm text-fg-secondary">
            Radix primitives and focus-visible rings ship on by default.
          </p>
        </SpotlightCard>
      ),
    },
  ],
  "aurora-background": [
    {
      id: "animated-backdrop",
      title: "Animated backdrop",
      description:
        "An animated aurora gradient wrapping centered hero content — the brand's signature first impression.",
      code: `<AuroraBackground className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl">
  <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
    <GradientText asChild>
      <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
        Ship something beautiful
      </h3>
    </GradientText>
    <p className="text-balance text-sm text-fg-secondary">
      Accessible, token-driven React components with premium motion baked in.
    </p>
    <Button variant="gradient" size="lg">
      Get started
      <ArrowRight aria-hidden="true" />
    </Button>
  </div>
</AuroraBackground>`,
      preview: (
        <AuroraBackground className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl">
          <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
            <GradientText asChild>
              <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                Ship something beautiful
              </h3>
            </GradientText>
            <p className="text-balance text-sm text-fg-secondary">
              Accessible, token-driven React components with premium motion baked in.
            </p>
            <Button variant="gradient" size="lg">
              Get started
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </AuroraBackground>
      ),
    },
  ],
  shimmer: [
    {
      id: "loading-sheen",
      title: "Loading sheen",
      description:
        "Sized skeleton blocks with a sweeping sheen — give each Shimmer explicit height and width to match the content it stands in for.",
      code: `<div className="flex flex-col gap-3">
  <Shimmer className="h-8 w-48 rounded-lg" />
  <Shimmer className="h-4 w-full rounded-md" />
  <Shimmer className="h-4 w-3/4 rounded-md" />
  <Shimmer className="h-10 w-32 rounded-lg" />
</div>`,
      preview: (
        <div className="flex flex-col gap-3">
          <Shimmer className="h-8 w-48 rounded-lg" />
          <Shimmer className="h-4 w-full rounded-md" />
          <Shimmer className="h-4 w-3/4 rounded-md" />
          <Shimmer className="h-10 w-32 rounded-lg" />
        </div>
      ),
    },
  ],
  reveal: [
    {
      id: "scroll-reveal",
      title: "Scroll reveal",
      description:
        "Wrap any content to fade and slide it into view as it enters the viewport. The reveal fires once, then settles. Scroll it into frame to see it animate.",
      code: `<Reveal>
  <Card>
    <CardHeader>
      <CardTitle>Reveal as you scroll</CardTitle>
      <CardDescription>
        This card fades and slides into view the moment it enters the viewport.
      </CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-fg-secondary">
      Reveals fire a single time, so the section settles instead of replaying.
    </CardContent>
  </Card>
</Reveal>`,
      preview: (
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Reveal as you scroll</CardTitle>
              <CardDescription>
                This card fades and slides into view the moment it enters the viewport.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-fg-secondary">
              Reveals fire a single time, so the section settles instead of replaying.
            </CardContent>
          </Card>
        </Reveal>
      ),
    },
  ],
};
