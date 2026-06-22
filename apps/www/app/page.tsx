"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Slider,
  Switch,
} from "@cooud/ui";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { CooudMark } from "../components/brand/cooud-mark";
import { Hero } from "../components/hero";
import { Eyebrow } from "../components/showcase-ui";
import { SiteNav } from "../components/site-nav";
import { ThemeBuilder } from "../components/theme-builder";
import { CATEGORIES, COMPONENT_COUNT } from "../lib/components-index";

export default function Page() {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <Hero />

      {/* Playground — theming + tokens */}
      <section id="playground" className="relative border-t border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-aurora opacity-[0.08] blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div id="tokens" className="flex flex-col gap-3 scroll-mt-24">
            <Eyebrow>Tokens &amp; theming</Eyebrow>
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Theme it your way
            </h2>
            <p className="max-w-2xl text-fg-secondary">
              Every component reads semantic tokens, so one change re-themes the entire page — live,
              with no re-render. Drag the radius, pick a brand color, switch Aurora ↔ Neutral.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
            <ThemeBuilder />
            <PlaygroundPreview />
          </div>
        </div>
      </section>

      {/* Components CTA */}
      <section id="components" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-3">
            <Eyebrow>Component library</Eyebrow>
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {CATEGORIES.reduce((n, c) => n + c.items.length, 0)} components, fully documented
            </h2>
            <p className="max-w-2xl text-fg-secondary">
              Browse every component with live previews, variants, states and copy-paste code —
              organized by category.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/components#${category.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-sm text-fg-secondary outline-none transition-colors hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                {category.name}
                <span className="text-fg-tertiary">{category.items.length}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild variant="gradient" size="lg">
              <Link href="/components">
                Explore all components
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function PlaygroundPreview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Live preview</CardTitle>
          <CardDescription>These update as you tweak the tokens.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" size="sm">
              Gradient
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Inputs, switches and sliders.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pg-email">Email</Label>
            <Input id="pg-email" placeholder="you@cooud.com" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pg-switch">Notifications</Label>
            <Switch id="pg-switch" defaultChecked />
          </div>
          <Slider defaultValue={[60]} max={100} step={1} />
        </CardContent>
      </Card>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer id="cli" className="border-t border-border/60 bg-surface-inset/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <CooudMark className="h-4 w-8 text-fg" />
              <span className="font-display text-lg font-semibold tracking-tight">Cooud UI</span>
            </div>
            <p className="mt-4 text-sm text-fg-secondary">
              The Cooud design system. {COMPONENT_COUNT} themeable, accessible React components — as
              an npm package or copy-paste registry.
            </p>
            <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-fg-secondary">
              <span className="text-fg-tertiary">$</span> npx cooud-ui add button
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            <FooterCol
              title="Library"
              links={[
                { label: "Components", href: "#components" },
                { label: "Theming", href: "#playground" },
                { label: "Tokens", href: "#tokens" },
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                { label: "GitHub", href: "https://github.com/pedrogbraz/cooud-ui" },
                { label: "Aurora theme", href: "#playground" },
                { label: "CLI registry", href: "#cli" },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-fg-tertiary sm:flex-row">
          <span>Built with Cooud UI · Aurora + Neutral</span>
          <a
            href="https://github.com/pedrogbraz/cooud-ui"
            className="inline-flex items-center gap-1.5 rounded-md text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="size-4" aria-hidden="true" /> pedrogbraz/cooud-ui
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
        {title}
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="rounded-md text-sm text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
