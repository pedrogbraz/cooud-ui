"use client";

import {
  AnimatedNumber,
  AuroraBackground,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  GlassCard,
  GradientBorder,
  GradientText,
  LogoCarousel,
  MorphingPopover,
  MorphingPopoverBody,
  MorphingPopoverButton,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverFooter,
  MorphingPopoverTrigger,
  Reveal,
  SegmentedControl,
  SegmentedControlItem,
  Shimmer,
  SpotlightCard,
  TextEffect,
} from "@cooud-ui/ui";
import {
  ArrowRight,
  Copy,
  Gauge,
  MessageSquarePlus,
  Pencil,
  Plus,
  RotateCw,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useId, useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Stateful demos                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Feedback popover: the trigger morphs into a small dialog with an accessible
 * textarea (labelled via a visually-bound `<label>`) and a footer that pairs a
 * Close with a submit. Submit is local-only — it flips to a thank-you state and
 * auto-closes, demonstrating controlled open state without leaving the demo
 * frame.
 */
function MorphingPopoverFeedbackDemo() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSent(false);
      }}
      reducedMotion="never"
      className="flex min-h-[15rem] w-full items-start justify-center pt-8"
    >
      <MorphingPopoverTrigger>
        <MessageSquarePlus aria-hidden="true" className="size-4" />
        Feedback
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Send feedback" className="w-[22rem]">
        {sent ? (
          <MorphingPopoverBody className="items-center gap-1 py-10 text-center">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <p className="text-sm font-medium text-fg">Thanks for the note!</p>
            <p className="text-xs text-fg-tertiary">We read every message.</p>
          </MorphingPopoverBody>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setNote("");
              window.setTimeout(() => setOpen(false), 1200);
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={fieldId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Add feedback"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-sm text-fg outline-none placeholder:text-fg-tertiary"
            />
            <MorphingPopoverFooter className="justify-between border-t-0 px-3 pb-3 pt-1">
              <MorphingPopoverClose />
              <Button type="submit" size="sm" variant="outline" disabled={note.trim().length === 0}>
                Submit
              </Button>
            </MorphingPopoverFooter>
          </form>
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

/**
 * Quick-actions menu: the trigger morphs into a compact menu of
 * {@link MorphingPopoverButton} rows with leading lucide icons. Each row closes
 * the surface on activation via the local `setOpen`.
 */
function MorphingPopoverQuickActionsDemo() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <MorphingPopover
      open={open}
      onOpenChange={setOpen}
      reducedMotion="never"
      className="flex min-h-[15rem] w-full items-start justify-center pt-8"
    >
      <MorphingPopoverTrigger>
        Actions
        <ArrowRight aria-hidden="true" className="size-4" />
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Quick actions" className="w-56">
        <MorphingPopoverBody className="gap-0.5 p-1.5">
          {actions.map(({ id, label, icon: Icon }) => (
            <MorphingPopoverButton key={id} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />
              {label}
            </MorphingPopoverButton>
          ))}
          <div className="my-1 h-px bg-border" />
          <MorphingPopoverButton
            onClick={() => setOpen(false)}
            className="text-fg-secondary hover:text-fg"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </MorphingPopoverButton>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

const heroLogos = [
  {
    id: "next",
    label: "Next.js",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 180"
        className="block size-16 shrink-0 sm:size-20"
        fill="none"
      >
        <circle cx="90" cy="90" r="87" fill="#050505" stroke="white" strokeWidth="6" />
        <path
          d="M149.5 157.5 69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.3Z"
          fill="white"
        />
        <rect x="115" y="54" width="12" height="72" fill="white" />
      </svg>
    ),
  },
  {
    id: "bmw",
    label: "BMW",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 80 80"
        className="block size-16 shrink-0 sm:size-20"
        fill="none"
      >
        <circle cx="40" cy="40" r="38" fill="white" />
        <circle cx="40" cy="40" r="33" fill="#111111" />
        <circle cx="40" cy="40" r="22" fill="white" />
        <path d="M40 18a22 22 0 0 1 22 22H40V18Z" fill="#009ADA" />
        <path d="M18 40a22 22 0 0 1 22-22v22H18Z" fill="white" />
        <path d="M40 40h22a22 22 0 0 1-22 22V40Z" fill="white" />
        <path d="M18 40h22v22a22 22 0 0 1-22-22Z" fill="#009ADA" />
        <circle cx="40" cy="40" r="22" stroke="#111111" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "typescript",
    label: "TypeScript",
    node: (
      <span className="grid size-16 place-items-center rounded-md bg-[#3178c6] text-3xl font-black text-white sm:size-20 sm:text-4xl">
        TS
      </span>
    ),
  },
  {
    id: "stripe",
    label: "Stripe",
    node: (
      <span className="text-4xl font-black tracking-tight text-[#635bff] sm:text-5xl">stripe</span>
    ),
  },
  {
    id: "spiral",
    label: "Spiral",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 96 96"
        className="block size-20 shrink-0 sm:size-24"
        fill="none"
      >
        <path
          d="M72.5 20.5C59.5 10.6 39.5 12.8 28 25.8 16.2 39.2 18.6 59.5 32.7 69.3c9.3 6.5 23 6.3 31.5-1.4 8.7-7.9 9.2-20.7 1.3-28.6-7.3-7.2-19.2-7.2-26.5 0"
          stroke="#96f3cc"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.5 75.5C36.5 85.4 56.5 83.2 68 70.2 79.8 56.8 77.4 36.5 63.3 26.7c-9.3-6.5-23-6.3-31.5 1.4-8.7 7.9-9.2 20.7-1.3 28.6 7.3 7.2 19.2 7.2 26.5 0"
          stroke="#00d6a3"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 814 1000"
        className="block h-16 w-14 shrink-0 fill-white sm:h-20 sm:w-16"
      >
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
      </svg>
    ),
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    node: (
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 54 33"
        className="block h-12 w-20 shrink-0 sm:h-14 sm:w-24"
      >
        <path
          fill="#38bdf8"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2Z"
        />
      </svg>
    ),
  },
  {
    id: "vercel",
    label: "Vercel",
    node: (
      <span className="block h-0 w-0 shrink-0 border-x-[34px] border-b-[58px] border-x-transparent border-b-fg sm:border-x-[42px] sm:border-b-[72px]" />
    ),
  },
];

/**
 * AnimatedNumber: a revenue tile whose value springs to each new total. Click
 * "Nova venda" to add a sale and watch it count up (reduced-motion snaps).
 */
function AnimatedNumberDemo() {
  const [total, setTotal] = useState(12480);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-1 p-6 text-center">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Receita do mês
          </span>
          <AnimatedNumber
            value={total}
            locale="pt-BR"
            formatOptions={{ style: "currency", currency: "BRL" }}
            reducedMotion="never"
            className="font-display text-4xl font-semibold text-fg"
          />
        </CardContent>
      </Card>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setTotal((t) => t + 200 + Math.round(Math.random() * 1800))}
      >
        <Plus aria-hidden="true" className="size-4" />
        Nova venda
      </Button>
    </div>
  );
}

/**
 * Carousel: a native scroll-snap gallery with prev/next, dots, and keyboard
 * support. Drag/swipe works on touch; the OS reduced-motion setting governs the
 * smooth scroll.
 */
function CarouselDemo() {
  const slides = [
    { id: "onboarding", n: 1, label: "Onboarding" },
    { id: "checkout", n: 2, label: "Checkout" },
    { id: "payout", n: 3, label: "Repasse" },
    { id: "insights", n: 4, label: "Insights" },
    { id: "growth", n: 5, label: "Growth" },
  ];
  return (
    <Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface-raised">
              <span className="font-display text-4xl font-semibold text-fg">{slide.n}</span>
              <span className="text-xs text-fg-tertiary">{slide.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </div>
    </Carousel>
  );
}

/**
 * SegmentedControl: a period filter whose thumb slides between options. The
 * selected value is mirrored below to show the controlled state.
 */
function SegmentedControlDemo() {
  const [period, setPeriod] = useState("30d");
  const labels: Record<string, string> = {
    "7d": "7 dias",
    "30d": "30 dias",
    "12m": "12 meses",
  };
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SegmentedControl
        value={period}
        onValueChange={setPeriod}
        reducedMotion="never"
        aria-label="Período"
      >
        <SegmentedControlItem value="7d">7 dias</SegmentedControlItem>
        <SegmentedControlItem value="30d">30 dias</SegmentedControlItem>
        <SegmentedControlItem value="12m">12 meses</SegmentedControlItem>
      </SegmentedControl>
      <p className="text-sm text-fg-secondary">
        Período: <span className="font-medium text-fg">{labels[period]}</span>
      </p>
    </div>
  );
}

/**
 * TextEffect: staggers a headline in by character (blur) and a subtitle by word
 * (slide). "Replay" remounts the block so the mount-triggered animation runs
 * again.
 */
function TextEffectDemo() {
  const [runId, setRunId] = useState(0);
  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <div key={runId} className="flex flex-col gap-2">
        <TextEffect
          as="h3"
          per="char"
          preset="blur"
          trigger="mount"
          reducedMotion="never"
          className="font-display text-3xl font-semibold text-fg"
        >
          Ship premium by default
        </TextEffect>
        <TextEffect
          as="p"
          per="word"
          preset="slide"
          trigger="mount"
          delay={0.35}
          reducedMotion="never"
          className="text-sm text-fg-secondary"
        >
          Every surface arrives with intent.
        </TextEffect>
      </div>
      <Button size="sm" variant="outline" onClick={() => setRunId((n) => n + 1)}>
        <RotateCw aria-hidden="true" className="size-4" />
        Replay
      </Button>
    </div>
  );
}

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
  "logo-carousel": [
    {
      id: "hero-lockup",
      title: "Hero lockup",
      description:
        "Large ghost logos that rotate in place for launch pages, waitlists and social-proof heroes. Each slot cross-fades upward with Motion, pauses on hover/focus and becomes static for reduced-motion users.",
      install: {
        registryItem: "logo-carousel",
        dependencies: ["motion"],
      },
      code: `const logos = [
  {
    id: "stripe",
    label: "Stripe",
    node: <span className="text-5xl font-black text-[#635bff]">stripe</span>,
  },
  {
    id: "bmw",
    label: "BMW",
    node: <span className="grid size-16 place-items-center rounded-full bg-white text-sm font-black text-black">BMW</span>,
  },
  {
    id: "typescript",
    label: "TypeScript",
    node: <span className="grid size-16 place-items-center rounded-md bg-[#3178c6] text-3xl font-black text-white">TS</span>,
  },
  {
    id: "next",
    label: "Next.js",
    node: <span className="grid size-16 place-items-center rounded-full border-2 border-fg text-3xl font-semibold">N</span>,
  },
];

<section className="flex flex-col items-center gap-8 py-12 text-center">
  <div className="space-y-2">
    <p className="font-display text-2xl font-semibold text-fg">
      The best teams are already here
    </p>
    <h3 className="font-display text-6xl font-semibold leading-none text-fg">
      Join Cooud UI
    </h3>
  </div>
  <LogoCarousel items={logos} columns={3} ariaLabel="Customer logos" />
</section>`,
      preview: (
        <section className="mx-auto flex min-h-[360px] w-full max-w-4xl flex-col items-center justify-center gap-8 py-8 text-center">
          <div className="space-y-2">
            <p className="font-display text-2xl font-semibold leading-tight text-fg sm:text-3xl">
              The best teams are already here
            </p>
            <h3 className="font-display text-6xl font-semibold leading-none text-fg sm:text-8xl">
              Join Cooud UI
            </h3>
          </div>
          <LogoCarousel
            items={heroLogos}
            columns={3}
            interval={1600}
            staggerDelay={0.12}
            motionPreference="always"
            ariaLabel="Customer logos"
          />
        </section>
      ),
    },
  ],
  "morphing-popover": [
    {
      id: "feedback",
      title: "Feedback",
      description:
        "The trigger physically morphs into a small non-modal dialog instead of fading in beside it. Inside: an accessible, labelled textarea and a footer that pairs Close with a submit. Focus moves into the surface on open and returns to the trigger on close; Escape and outside-click both dismiss. Submit is local-only — it flips to a thank-you state and auto-closes. Honours reduced-motion.",
      install: {
        registryItem: "morphing-popover",
        dependencies: ["motion"],
      },
      code: `function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSent(false);
      }}
    >
      <MorphingPopoverTrigger>
        <MessageSquarePlus aria-hidden="true" className="size-4" />
        Feedback
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Send feedback" className="w-[22rem]">
        {sent ? (
          <MorphingPopoverBody className="items-center gap-1 py-10 text-center">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <p className="text-sm font-medium text-fg">Thanks for the note!</p>
            <p className="text-xs text-fg-tertiary">We read every message.</p>
          </MorphingPopoverBody>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setNote("");
              window.setTimeout(() => setOpen(false), 1200);
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={fieldId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Add feedback"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-sm text-fg outline-none placeholder:text-fg-tertiary"
            />
            <MorphingPopoverFooter className="justify-between border-t-0 px-3 pb-3 pt-1">
              <MorphingPopoverClose />
              <Button type="submit" size="sm" variant="outline" disabled={note.trim().length === 0}>
                Submit
              </Button>
            </MorphingPopoverFooter>
          </form>
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}`,
      preview: <MorphingPopoverFeedbackDemo />,
    },
    {
      id: "quick-actions",
      title: "Quick actions",
      description:
        "A poppy menu: the trigger morphs into a compact list of MorphingPopoverButton rows with leading lucide icons. Each row closes the surface on activation. Full keyboard + screen-reader support comes from the dialog wiring (aria-haspopup/expanded/controls, focus trap-in/return).",
      install: {
        registryItem: "morphing-popover",
        dependencies: ["motion"],
      },
      code: `function QuickActions() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <MorphingPopover open={open} onOpenChange={setOpen}>
      <MorphingPopoverTrigger>
        Actions
        <ArrowRight aria-hidden="true" className="size-4" />
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Quick actions" className="w-56">
        <MorphingPopoverBody className="gap-0.5 p-1.5">
          {actions.map(({ id, label, icon: Icon }) => (
            <MorphingPopoverButton key={id} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />
              {label}
            </MorphingPopoverButton>
          ))}
          <div className="my-1 h-px bg-border" />
          <MorphingPopoverButton
            onClick={() => setOpen(false)}
            className="text-fg-secondary hover:text-fg"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </MorphingPopoverButton>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}`,
      preview: <MorphingPopoverQuickActionsDemo />,
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
  <Card className="w-full">
    <CardHeader>
      <span className="mb-1 grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <CardTitle className="text-2xl">Reveal as you scroll</CardTitle>
      <CardDescription className="text-base">
        This card fades and slides into view the moment it enters the viewport. Give it room
        so the entrance is unmistakable.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-5 text-sm text-fg-secondary">
      <p className="leading-relaxed">
        Wrap any block — a hero, a pricing tier, a feature grid — and it arrives with intent
        instead of popping in. Reveals fire a single time, so the section settles instead of
        replaying as you scroll past.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Fade</p>
          <p className="mt-1 text-xs text-fg-tertiary">opacity 0 → 1</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Slide</p>
          <p className="mt-1 text-xs text-fg-tertiary">y 24 → 0</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Once</p>
          <p className="mt-1 text-xs text-fg-tertiary">no replay</p>
        </div>
      </div>
    </CardContent>
  </Card>
</Reveal>`,
      preview: (
        <Reveal>
          <Card className="w-full">
            <CardHeader>
              <span className="mb-1 grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-2xl">Reveal as you scroll</CardTitle>
              <CardDescription className="text-base">
                This card fades and slides into view the moment it enters the viewport. Give it room
                so the entrance is unmistakable.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 text-sm text-fg-secondary">
              <p className="leading-relaxed">
                Wrap any block — a hero, a pricing tier, a feature grid — and it arrives with intent
                instead of popping in. Reveals fire a single time, so the section settles instead of
                replaying as you scroll past.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-surface-raised p-4">
                  <p className="font-display text-2xl font-semibold text-fg">Fade</p>
                  <p className="mt-1 text-xs text-fg-tertiary">opacity 0 → 1</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-raised p-4">
                  <p className="font-display text-2xl font-semibold text-fg">Slide</p>
                  <p className="mt-1 text-xs text-fg-tertiary">y 24 → 0</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-raised p-4">
                  <p className="font-display text-2xl font-semibold text-fg">Once</p>
                  <p className="mt-1 text-xs text-fg-tertiary">no replay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ),
    },
  ],
  "animated-number": [
    {
      id: "count-up",
      title: "Count up",
      description:
        "Springs toward the target whenever it changes, so a balance or KPI counts up instead of snapping. Honours reduced-motion (snaps) and formats through Intl. Click to add a sale.",
      code: `function Revenue() {
  const [total, setTotal] = useState(12480);
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedNumber
        value={total}
        locale="pt-BR"
        formatOptions={{ style: "currency", currency: "BRL" }}
        className="font-display text-4xl font-semibold text-fg"
      />
      <Button size="sm" variant="outline" onClick={() => setTotal((t) => t + 850)}>
        Nova venda
      </Button>
    </div>
  );
}`,
      preview: <AnimatedNumberDemo />,
    },
  ],
  carousel: [
    {
      id: "slides",
      title: "Slides",
      description:
        "Native scroll-snap gallery — swipe or drag on touch, prev/next + dots and full keyboard support on desktop, reduced-motion handled by the OS. Set `basis` on CarouselItem for multi-up views.",
      code: `<Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
  <CarouselContent>
    {slides.map((slide) => (
      <CarouselItem key={slide.id}>
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-surface-raised">
          <span className="font-display text-4xl font-semibold text-fg">{slide.n}</span>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className="mt-4 flex items-center justify-center gap-3">
    <CarouselPrevious />
    <CarouselDots />
    <CarouselNext />
  </div>
</Carousel>`,
      preview: <CarouselDemo />,
    },
  ],
  "segmented-control": [
    {
      id: "single-select",
      title: "Single select",
      description:
        "A thumb that slides between options via a shared layoutId — radiogroup semantics with full arrow-key navigation. Ideal for period filters and view toggles.",
      code: `<SegmentedControl defaultValue="30d" aria-label="Período">
  <SegmentedControlItem value="7d">7 dias</SegmentedControlItem>
  <SegmentedControlItem value="30d">30 dias</SegmentedControlItem>
  <SegmentedControlItem value="12m">12 meses</SegmentedControlItem>
</SegmentedControl>`,
      preview: <SegmentedControlDemo />,
    },
  ],
  "text-effect": [
    {
      id: "headline",
      title: "Headline",
      description:
        "Staggers words or characters in with a fade, blur, or slide — on scroll-into-view or on mount. The full string stays in the a11y tree via aria-label, so screen readers read it once.",
      code: `<TextEffect as="h3" per="char" preset="blur" className="font-display text-3xl font-semibold text-fg">
  Ship premium by default
</TextEffect>`,
      preview: <TextEffectDemo />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function PremiumExamples({ slug }: { slug: string }) {
  return <ExampleList examples={premiumExamples[slug] ?? []} />;
}
