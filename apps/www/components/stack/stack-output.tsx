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
import { type HTMLAttributes, useId, useMemo } from "react";
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

        <Tabs defaultValue="kickoff" className="gap-4">
          <TabsList aria-label="Stack output artifacts" className="w-full">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "min-w-0 flex-1",
                  // The Kickoff Prompt is the signature artifact: when it is the
                  // active tab it gets a faint primary wash so the eye lands there.
                  value === "kickoff" &&
                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
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
            className="flex min-w-0 flex-col gap-3 outline-none data-[state=active]:motion-safe:animate-in data-[state=active]:motion-safe:fade-in-0 data-[state=active]:motion-safe:duration-200"
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
            className="flex min-w-0 flex-col gap-3 outline-none data-[state=active]:motion-safe:animate-in data-[state=active]:motion-safe:fade-in-0 data-[state=active]:motion-safe:duration-200"
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
            <CodeBlock
              {...codeBlockBase}
              code={kickoff}
              language="markdown"
              filename="KICKOFF.md"
              className="w-full min-w-0 border-border [&_[data-slot=code-block-scroll]]:max-h-[28rem] [&_[data-slot=code-block-scroll]]:overflow-auto"
            />
          </TabsContent>

          {/* 3) Stack (JSON) — machine-readable snapshot. */}
          <TabsContent
            value="json"
            className="flex min-w-0 flex-col gap-3 outline-none data-[state=active]:motion-safe:animate-in data-[state=active]:motion-safe:fade-in-0 data-[state=active]:motion-safe:duration-200"
            data-slot="stack-output-json"
          >
            <CopyRow
              description="A machine-readable snapshot of the resolved stack."
              value={stackJson}
              copyLabel="Copy stack JSON"
            />
            <CodeBlock
              {...codeBlockBase}
              code={stackJson}
              language="json"
              filename="stack.json"
              className="w-full min-w-0 border-border [&_[data-slot=code-block-scroll]]:max-h-[28rem] [&_[data-slot=code-block-scroll]]:overflow-auto"
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
