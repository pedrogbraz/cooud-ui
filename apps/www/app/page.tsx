"use client";

import { useTheme } from "@cooud/theme";
import { Badge, Button } from "@cooud/ui";
import { ArrowRight, Github, Moon, Sparkles, Sun } from "lucide-react";
import { ComponentGallery } from "../components/component-gallery";
import { DataGallery } from "../components/data-gallery";
import { FormsGallery } from "../components/forms-gallery";
import { OverlaysGallery } from "../components/overlays-gallery";
import { PremiumGallery } from "../components/premium-gallery";
import { ThemeBuilder } from "../components/theme-builder";

export default function Page() {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="min-h-screen bg-surface-base text-fg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <a
            href="#top"
            className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cooud UI</span>
          </a>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="#buttons">Components</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="#theme-builder">Theme</a>
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleMode}
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            >
              {mode === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-border bg-surface-inset"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-aurora opacity-20 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-7 px-6 py-24 text-center sm:py-32">
          <Badge variant="primary" className="gap-1.5">
            <Sparkles className="size-3" aria-hidden="true" />
            Wave 0 · Aurora + Neutral
          </Badge>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            The design system that{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">themes itself</span>
          </h1>
          <p className="max-w-2xl text-balance text-lg text-fg-secondary">
            Accessible, token-driven React components for the Cooud platform. Every color, radius,
            and shadow flows from a single source of truth — re-theme the entire page live.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient" size="lg">
              <a href="#buttons">
                Explore components
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#theme-builder">
                <Sparkles aria-hidden="true" />
                Build a theme
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="https://github.com/cooud" target="_blank" rel="noreferrer">
                <Github aria-hidden="true" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Two-column workbench */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="lg:order-1">
            <ThemeBuilder />
          </div>
          <div className="lg:order-2 min-w-0">
            <ComponentGallery />
            <FormsGallery />
            <OverlaysGallery />
            <DataGallery />
            <PremiumGallery />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-inset">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-fg-tertiary sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
            <span className="font-display font-medium text-fg-secondary">Cooud UI</span>
          </div>
          <p>Built with semantic tokens. Re-theme everything from one place.</p>
        </div>
      </footer>
    </div>
  );
}
