"use client";

import { cn } from "@cooud/ui";
import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

const MANAGERS = [
  { id: "bun", label: "bun", cmd: (p: string) => `bun add ${p}` },
  { id: "npm", label: "npm", cmd: (p: string) => `npm install ${p}` },
  { id: "pnpm", label: "pnpm", cmd: (p: string) => `pnpm add ${p}` },
  { id: "yarn", label: "yarn", cmd: (p: string) => `yarn add ${p}` },
] as const;

export function InstallTabs({ packages }: { packages: string }) {
  const [active, setActive] = useState(2); // pnpm
  const [copied, setCopied] = useState(false);
  const command = MANAGERS[active]?.cmd(packages) ?? "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-inset/80">
      <div className="flex items-center justify-between border-b border-border/60 pr-2">
        <div className="flex items-center">
          <span className="grid size-9 place-items-center text-fg-tertiary">
            <Terminal className="size-4" aria-hidden="true" />
          </span>
          {MANAGERS.map((manager, i) => (
            <button
              key={manager.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                i === active ? "font-medium text-fg" : "text-fg-tertiary hover:text-fg-secondary",
              )}
            >
              {manager.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy install command"
          className="grid size-8 place-items-center rounded-md text-fg-tertiary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-3 font-mono text-sm">
        <span className="text-primary">{command.split(" ")[0]}</span>
        <span className="text-fg-secondary"> {command.split(" ").slice(1).join(" ")}</span>
      </div>
    </div>
  );
}
