"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * A `$`-prefixed one-line command with a copy button — the same chip pattern as
 * the homepage Get Started section, sized for theme cards. Long permalinks
 * truncate visually but copy in full.
 */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="relative flex w-full min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-xl border border-border bg-surface-inset px-3.5 py-2.5 pr-11 font-mono text-xs">
      <span aria-hidden="true" className="select-none text-fg-tertiary">
        $
      </span>
      <code className="min-w-0 flex-1 truncate text-fg" title={command}>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied to clipboard" : "Copy the theme add command"}
        className="absolute right-1.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-surface-raised text-fg-tertiary outline-none transition-colors hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? (
          <Check className="size-3.5 text-fg" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
