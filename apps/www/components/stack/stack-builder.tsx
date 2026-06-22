"use client";

import { Badge, cn, Input, Label, Reveal } from "@cooud/ui";
import { FlaskConical, ListChecks, SlidersHorizontal } from "lucide-react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { catalog } from "@/lib/stack/catalog";
import { defaultSelection, randomize, resolve, select, toggleMulti } from "@/lib/stack/engine";
import type { Selection } from "@/lib/stack/types";
import { CategorySection } from "./category-section";
import { SelectedSummary } from "./selected-summary";
import { StackOutput } from "./stack-output";

type MobileView = "configure" | "output";

/**
 * The Cooud Stack Builder (BETA) — a Better-T-Stack-class configurator.
 *
 * Owns the raw {@link Selection} and runs every mutation through the pure engine
 * (`select` / `toggleMulti` / `randomize`), then re-resolves on render so the UI
 * always reflects the auto-corrected, valid stack. The resolved selection is the
 * single `StackConfig` handed to {@link StackOutput} for the generated artifacts.
 *
 * Renders the page's single `<main id="main-content">`.
 */
export function StackBuilder() {
  const [selection, setSelection] = useState<Selection>(() => defaultSelection(catalog));
  const [projectName, setProjectName] = useState("my-cooud-app");
  const [mobileView, setMobileView] = useState<MobileView>("configure");
  // A roll counter (not render state) so repeated Randomize presses vary, while
  // each individual roll stays deterministic for its derived seed.
  const rollRef = useRef(0);

  // Resolve on every render — pure + cheap, so it's safe per keystroke.
  const resolution = useMemo(() => resolve(catalog, selection), [selection]);
  const projectNameId = useId();

  const handleSelectSingle = useCallback((categoryId: string, optionId: string) => {
    setSelection((prev) => select(catalog, prev, categoryId, optionId));
  }, []);

  const handleToggleMulti = useCallback((categoryId: string, optionId: string) => {
    setSelection((prev) => toggleMulti(catalog, prev, categoryId, optionId));
  }, []);

  const handleToggleBoolean = useCallback((categoryId: string, next: boolean) => {
    setSelection((prev) => select(catalog, prev, categoryId, next));
  }, []);

  const handleReset = useCallback(() => {
    setSelection(defaultSelection(catalog));
  }, []);

  const handleRandomize = useCallback(() => {
    rollRef.current = (rollRef.current + 1) >>> 0;
    const seed = (Date.now() ^ (rollRef.current * 0x9e3779b1)) >>> 0;
    setSelection(randomize(catalog, seed));
  }, []);

  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] bg-surface-base text-fg">
      {/* --- BETA hero header ---------------------------------------------
          A clean, premium intro. A single aurora accent + a faint dotted grid
          (coherent with the site hero) sit behind the copy with parsimony — an
          accent, not decoration. Both are aria-hidden and reduced-motion safe
          (they're static; no animation to park). */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-64 bg-gradient-aurora opacity-[0.07] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--cooud-border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.35,
          }}
        />
        <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex max-w-3xl flex-col gap-5">
            {/* Eyebrow pill — frames the page + makes the BETA status prominent. */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-raised/60 py-1 pr-3 pl-1.5 text-xs font-medium text-fg-secondary backdrop-blur">
              <Badge
                variant="warning"
                className="gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
              >
                <FlaskConical className="size-3" aria-hidden="true" />
                Beta
              </Badge>
              <span>Experimental — generates a command, not a project</span>
            </div>

            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl">
              Stack Builder
            </h1>

            <p className="max-w-2xl text-pretty text-lg text-fg-secondary">
              Compose your full-stack app, layer by layer — every choice is validated live, so
              incompatible options disable themselves with a reason. Walk away with a scaffolding
              command and a Kickoff prompt for your coding agent.
            </p>

            <div
              role="note"
              className="flex w-fit items-start gap-2.5 rounded-xl border border-border bg-surface-raised/70 px-3.5 py-2.5 text-sm text-fg-secondary backdrop-blur"
            >
              <FlaskConical className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
              <span>
                <span className="font-medium text-fg">No project is generated yet.</span> The
                builder produces a{" "}
                <code className="rounded bg-surface-overlay px-1 py-0.5 font-mono text-xs text-fg">
                  bun create
                </code>{" "}
                command plus a Kickoff prompt you hand to your agent.
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- Builder body ------------------------------------------------- */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Mobile view switcher (configure ↔ output); hidden on desktop.
            A segmented control: an absolutely-positioned thumb slides under the
            active tab via a GPU transform (no layout shift). The buttons stay
            transparent so the thumb reads through them. */}
        <div className="mb-8 lg:hidden">
          <fieldset
            className="relative grid grid-cols-2 rounded-xl border border-border bg-surface-raised p-1"
            aria-label="Builder view"
          >
            <legend className="sr-only">Builder view</legend>
            {/* Sliding thumb */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg border border-border bg-surface-overlay shadow-xs transition-transform duration-300 ease-[var(--ease-out-quart)] motion-reduce:transition-none"
              style={{
                transform: mobileView === "output" ? "translateX(100%)" : "translateX(0)",
              }}
            />
            <button
              type="button"
              aria-pressed={mobileView === "configure"}
              onClick={() => setMobileView("configure")}
              className={cn(
                "relative z-10 inline-flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-medium outline-none transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
                mobileView === "configure" ? "text-fg" : "text-fg-tertiary hover:text-fg-secondary",
              )}
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Configure
            </button>
            <button
              type="button"
              aria-pressed={mobileView === "output"}
              onClick={() => setMobileView("output")}
              className={cn(
                "relative z-10 inline-flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-medium outline-none transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
                mobileView === "output" ? "text-fg" : "text-fg-tertiary hover:text-fg-secondary",
              )}
            >
              <ListChecks className="size-4" aria-hidden="true" />
              Summary &amp; output
            </button>
          </fieldset>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10">
          {/* Categories column */}
          <div
            key={`configure-${mobileView === "configure"}`}
            data-active={mobileView === "configure"}
            className={cn(
              "flex-col gap-10 lg:flex",
              // Mobile: show only the active view; desktop always shows both.
              // Soft enter on the mobile swap: a one-shot fade/slide from the
              // `starting:` state (Tailwind v4 @starting-style). Reduced-motion
              // safe and never affects the always-visible desktop layout.
              "transition-[opacity,transform] duration-300 ease-[var(--ease-out-quart)] starting:opacity-0 starting:translate-y-1 motion-reduce:transition-none motion-reduce:starting:opacity-100 motion-reduce:starting:translate-y-0",
              mobileView === "configure" ? "flex" : "hidden",
            )}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={projectNameId} className="text-sm font-semibold text-fg">
                Project name
              </Label>
              <Input
                id={projectNameId}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-cooud-app"
                spellCheck={false}
                autoComplete="off"
                aria-describedby={`${projectNameId}-hint`}
                className="max-w-sm font-mono"
              />
              <p id={`${projectNameId}-hint`} className="text-xs text-fg-tertiary">
                Used in the scaffolding command — sanitized to a safe slug.
              </p>
            </div>

            {catalog.map((cat, index) => {
              const rc = resolution.categories[cat.id];
              if (!rc) return null;
              return (
                // Subtle staggered reveal as each category scrolls into view.
                // `Reveal` fires once, fades up 16px, and is reduced-motion safe.
                // Cap the stagger so later sections don't feel delayed.
                <Reveal key={cat.id} delay={Math.min(index, 5) * 0.04}>
                  <CategorySection
                    resolved={rc}
                    onSelectSingle={handleSelectSingle}
                    onToggleMulti={handleToggleMulti}
                    onToggleBoolean={handleToggleBoolean}
                  />
                </Reveal>
              );
            })}
          </div>

          {/* Aside: summary + output. Sticky on desktop with a top offset that
              clears the 4rem sticky nav (top-20 = 5rem → 1rem breathing room).
              max-h + overflow lets a long rail scroll independently of the page
              without pushing the sticky context. */}
          <aside
            key={`output-${mobileView === "output"}`}
            data-active={mobileView === "output"}
            className={cn(
              "min-w-0 flex-col gap-6 lg:sticky lg:top-20 lg:flex lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain lg:pr-1",
              // Mobile: show only the active view; desktop always shows both.
              "transition-[opacity,transform] duration-300 ease-[var(--ease-out-quart)] starting:opacity-0 starting:translate-y-1 motion-reduce:transition-none motion-reduce:starting:opacity-100 motion-reduce:starting:translate-y-0",
              mobileView === "output" ? "flex" : "hidden",
            )}
            aria-label="Selected stack and output"
          >
            <SelectedSummary
              resolution={resolution}
              catalog={catalog}
              onReset={handleReset}
              onRandomize={handleRandomize}
            />
            <StackOutput
              config={resolution.selection}
              projectName={projectName}
              catalog={catalog}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
