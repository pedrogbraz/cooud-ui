"use client";

import { Check, ChevronDown, Copy } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useState } from "react";

/** A token theme tuned to the Cooud dark surfaces. */
const theme: PrismTheme = {
  plain: { color: "var(--cooud-fg)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      // fg-tertiary (not fg-muted) keeps comments muted while clearing AA contrast
      // (>=4.5:1) on the dark code surface — fg-muted fails at ~2.5:1.
      style: { color: "var(--cooud-fg-tertiary)", fontStyle: "italic" },
    },
    { types: ["punctuation"], style: { color: "var(--cooud-fg-tertiary)" } },
    {
      types: ["tag", "operator", "keyword", "boolean", "selector"],
      style: { color: "oklch(0.72 0.15 235)" },
    },
    {
      types: ["function", "class-name", "maybe-class-name"],
      style: { color: "oklch(0.78 0.13 200)" },
    },
    {
      types: ["string", "char", "attr-value", "inserted"],
      style: { color: "oklch(0.78 0.14 150)" },
    },
    { types: ["attr-name", "property"], style: { color: "oklch(0.8 0.12 90)" } },
    { types: ["number", "constant", "symbol"], style: { color: "oklch(0.8 0.13 50)" } },
    { types: ["script", "plain"], style: { color: "var(--cooud-fg-secondary)" } },
  ],
};

export interface CodeBlockProps {
  code: string;
  language?: string;
  expandable?: boolean;
}

export function CodeBlock({ code, language = "tsx", expandable = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!expandable);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface-inset/80">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-tertiary">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-fg-tertiary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="relative">
        <div className={expanded ? "" : "max-h-64 overflow-hidden"}>
          <Highlight code={code.trim()} language={language} theme={theme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              // The horizontally scrollable container must be keyboard-reachable
              // (axe `scrollable-region-focusable`, WCAG 2.1.1). A focusable
              // <section> (a native region) owns the scroll + accessible name, so
              // we satisfy both axe and biome's no-tabindex-on-<pre> rule.
              <section
                // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region is intentionally focusable so keyboard users can scroll it.
                tabIndex={0}
                aria-label="Code sample"
                className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <pre
                  className={`${className} p-4 font-mono text-[0.8rem] leading-relaxed`}
                  style={{ ...style, background: "transparent" }}
                >
                  {tokens.map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: tokenized source lines are positional and stable.
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: tokens within a line are positional and stable.
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              </section>
            )}
          </Highlight>
        </div>

        {expandable && !expanded && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-surface-inset to-transparent pb-3 pt-10">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-fg shadow-sm outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Expand code <ChevronDown className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
