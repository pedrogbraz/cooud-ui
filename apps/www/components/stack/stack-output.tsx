"use client";

import {
  CodeBlock,
  type CodeBlockProps,
  CopyButton,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cooud-ui/ui";
import { Check, FileCode2, Sparkles, Terminal } from "lucide-react";
import { type HTMLAttributes, useId, useMemo, useState } from "react";
import { generateCommand, generateKickoff, generateStackJson } from "@/lib/stack/kickoff";
import type { Catalog, StackConfig } from "@/lib/stack/types";

/**
 * Props for {@link StackOutput}.
 *
 * The picker resolves a {@link StackConfig} (and the project name the user
 * typed) and hands it straight to this panel. Everything rendered here is
 * derived purely from `config` + `projectName` via the `generate*` helpers in
 * `lib/stack/kickoff.ts`, so there is no internal selection state to keep in
 * sync — re-render with a new `config` and the three artifacts update.
 */
export interface StackOutputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The fully resolved stack — the single source of truth for all artifacts. */
  config: StackConfig;
  /**
   * The user-supplied project name. Sanitized to a safe slug inside the
   * generators, so it is fine to pass raw input. Defaults to "my-cooud-app".
   */
  projectName?: string;
  /**
   * Optional catalog override forwarded to {@link generateKickoff} (used to
   * resolve option ids to human names). Defaults to the built-in catalog.
   */
  catalog?: Catalog;
}

const TABS = [
  { value: "cli", label: "Command", icon: Terminal },
  { value: "kickoff", label: "Kickoff", icon: Sparkles },
  { value: "json", label: "JSON", icon: FileCode2 },
] as const;

type TabValue = (typeof TABS)[number]["value"];

/**
 * Panel enter for a newly activated tab: Radix keeps inactive `TabsContent`
 * mounted but `hidden`, so flipping to visible re-runs `@starting-style` and
 * the panel gently fades/rises in. Tailwind v4 maps `translate-y-*` to the CSS
 * `translate` property, so that (not `transform`) is what we transition.
 * Reduced motion pins both starting values for an instant swap.
 */
const TAB_PANEL_ENTER =
  "transition-[opacity,translate] duration-300 ease-[var(--ease-out-quart)] starting:opacity-0 starting:translate-y-1 motion-reduce:transition-none motion-reduce:starting:opacity-100 motion-reduce:starting:translate-y-0";

/** Shared chrome for a secondary tab: a description row + a copy action. */
function CopyRow({
  description,
  value,
  copyLabel,
}: {
  description: string;
  value: string;
  copyLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised px-3 py-2">
      <p className="min-w-0 text-sm text-fg-secondary">{description}</p>
      <CopyButton
        value={value}
        variant="secondary"
        size="icon-sm"
        className="shrink-0"
        copyLabel={copyLabel}
        copiedLabel="Copied to clipboard"
      />
    </div>
  );
}

/**
 * The builder's output panel. Renders the three artifacts a user leaves the
 * Cooud Stack Builder with — the scaffolding command, the KICKOFF.md prompt,
 * and the machine-readable stack snapshot — each in its own accessible tab with
 * a one-click copy. The Kickoff Prompt is the signature artifact and is the
 * default, highlighted tab.
 */
export function StackOutput({
  config,
  projectName = "my-cooud-app",
  catalog,
  className,
  ...props
}: StackOutputProps) {
  const command = useMemo(() => generateCommand(config, projectName), [config, projectName]);
  const kickoff = useMemo(
    () => generateKickoff(config, projectName, catalog),
    [config, projectName, catalog],
  );
  const stackJson = useMemo(() => generateStackJson(config, projectName), [config, projectName]);

  const titleId = useId();

  // Controlled so the sliding tab indicator below can be derived (pure CSS
  // transform from the active index — no measurement, no layout shift).
  const [tab, setTab] = useState<TabValue>("kickoff");
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.value === tab),
  );

  // CodeBlock already exposes its own header copy button + a keyboard-reachable
  // scroll region; we share one set of styling props across the tabs.
  const codeBlockBase: Partial<CodeBlockProps> = {
    className: "w-full min-w-0 border-border",
  };

  return (
    // A single restrained accent border marks the finished artifact as the payoff
    // — a quiet primary tint, no gradient and no glow, so it stays clean and modern.
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-primary/25 bg-surface-base",
        className,
      )}
      data-slot="stack-output-frame"
    >
      <section
        data-slot="stack-output"
        aria-labelledby={titleId}
        className="flex min-w-0 flex-col gap-4 rounded-[inherit] p-4 sm:p-6"
        {...props}
      >
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* A soft "ready" status dot — a calm accent, not a spinner. */}
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
            >
              <Check className="size-4" />
            </span>
            <h2 id={titleId} className="text-base font-semibold text-fg">
              Your stack is ready
            </h2>
          </div>
        </header>

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="gap-4">
          <TabsList aria-label="Stack output artifacts" className="relative w-full">
            {/* Sliding active-tab thumb: the three triggers are equal thirds
                (flex-1), so the thumb's position is a pure transform of the
                active index — one trigger width (its own 100%) + the 0.25rem
                list gap per step. Width = (100% − 0.5rem padding − 0.5rem gaps)
                ÷ 3. Transform-only, so switching tabs never shifts layout; the
                thumb also warms to the primary wash on the signature Kickoff
                tab. Decorative — Radix keeps the real active state on the
                triggers, which paint above it (they are positioned). */}
            <span
              aria-hidden="true"
              data-slot="tabs-thumb"
              className={cn(
                "pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-1rem)/3)] rounded-md shadow-xs",
                "transition-[transform,background-color] duration-300 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
                tab === "kickoff" ? "bg-primary/10" : "bg-surface-floating",
              )}
              style={{ transform: `translateX(calc(${activeIndex} * (100% + 0.25rem)))` }}
            />
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  // The thumb below carries the active surface, so the trigger
                  // itself stays transparent (relative → it paints above the
                  // thumb) and only its text color changes.
                  "relative min-w-0 flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  // The Kickoff Prompt is the signature artifact: when it is the
                  // active tab its label takes the primary accent (AA-tuned
                  // `-strong` so it clears contrast on the primary/10 tab thumb).
                  value === "kickoff" && "data-[state=active]:text-primary-strong",
                )}
              >
                <Icon aria-hidden="true" className="shrink-0" />
                <span className="truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 1) CLI command — the scaffolding command. */}
          <TabsContent
            value="cli"
            className={cn("flex min-w-0 flex-col gap-3 outline-none", TAB_PANEL_ENTER)}
            data-slot="stack-output-cli"
          >
            <CopyRow
              description="Run this in your terminal to scaffold the project."
              value={command}
              copyLabel="Copy CLI command"
            />
            <CodeBlock {...codeBlockBase} code={command} language="bash" filename="terminal" />
          </TabsContent>

          {/* 2) Kickoff Prompt — the signature artifact (the hero tab). */}
          <TabsContent
            value="kickoff"
            className={cn("flex min-w-0 flex-col gap-3 outline-none", TAB_PANEL_ENTER)}
            data-slot="stack-output-kickoff"
          >
            {/* The hero call-to-action: a primary-tinted banner with the Sparkles
                lifted into its own tile so the signature artifact reads loudest. */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-inset ring-primary/25"
                >
                  <Sparkles className="size-4" />
                </span>
                <p className="min-w-0 text-sm text-fg">
                  <span className="font-medium text-fg">Hand this to your coding agent.</span>{" "}
                  <span className="text-fg-secondary">
                    KICKOFF.md is the single source of truth for the build.
                  </span>
                </p>
              </div>
              {/* `outline` keeps the copy action AA-legible on the tinted banner
                  (never `primary`, which would fail contrast on this surface). */}
              <CopyButton
                value={kickoff}
                variant="outline"
                size="icon-sm"
                className="shrink-0"
                copyLabel="Copy Kickoff prompt"
                copiedLabel="Copied to clipboard"
              />
            </div>
            {/* No inner height cap: the code flows full-height and the sticky
                rail (the `aside`) is the single scroll region, so there is never
                a nested-scroll trap on the KICKOFF brief. */}
            <CodeBlock
              {...codeBlockBase}
              code={kickoff}
              language="markdown"
              filename="KICKOFF.md"
            />
          </TabsContent>

          {/* 3) Stack (JSON) — machine-readable snapshot. */}
          <TabsContent
            value="json"
            className={cn("flex min-w-0 flex-col gap-3 outline-none", TAB_PANEL_ENTER)}
            data-slot="stack-output-json"
          >
            <CopyRow
              description="A machine-readable snapshot of the resolved stack."
              value={stackJson}
              copyLabel="Copy stack JSON"
            />
            <CodeBlock {...codeBlockBase} code={stackJson} language="json" filename="stack.json" />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
