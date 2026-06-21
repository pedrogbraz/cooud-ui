"use client";

import { useTheme } from "@cooud/theme";
import { Badge } from "@cooud/ui";
import { Github, Moon, Search, Sparkles, Sun } from "lucide-react";

const navLinks = [
  { label: "Components", href: "/components" },
  { label: "Theme", href: "/#playground" },
  { label: "Tokens", href: "/#tokens" },
  { label: "CLI", href: "/#cli" },
] as const;

const GITHUB_URL = "https://github.com/pedrogbraz/cooud-ui";

export function SiteNav() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface-base/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Left — logo + wordmark + version */}
        <a
          href="#top"
          className="group flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="flex items-center gap-2">
            <span className="font-display text-base font-semibold tracking-tight text-fg">
              Cooud UI
            </span>
            <Badge variant="secondary" className="hidden px-1.5 py-0 text-[10px] sm:inline-flex">
              v0.1
            </Badge>
          </span>
        </a>

        {/* Center — nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right — search chip + github + mode toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search components"
            className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface-inset px-3 text-xs text-fg-tertiary outline-none transition-colors hover:border-border-strong hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <Search className="size-3.5" aria-hidden="true" />
            <span>Search…</span>
            <kbd className="ml-2 rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-fg-tertiary">
              ⌘K
            </kbd>
          </button>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View Cooud UI on GitHub"
            className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="size-[18px]" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={toggleMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isDark ? (
              <Sun className="size-[18px]" aria-hidden="true" />
            ) : (
              <Moon className="size-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
