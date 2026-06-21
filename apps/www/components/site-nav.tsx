"use client";

import { useTheme } from "@cooud/theme";
import { Badge, Sheet, SheetContent, SheetTitle, SheetTrigger } from "@cooud/ui";
import { Github, Menu, Moon, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CommandSearch } from "./docs/command-search";
import { ComponentNavList } from "./docs/docs-sidebar";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface-base/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Left — logo + wordmark + version */}
        <Link
          href="/"
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
        </Link>

        {/* Center — nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — search + github + mode toggle + mobile menu */}
        <div className="flex items-center gap-2">
          <CommandSearch />

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

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu className="size-[18px]" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 max-w-[85vw] gap-0 overflow-y-auto"
              aria-label="Navigation"
            >
              <SheetTitle>Menu</SheetTitle>

              <ul className="mt-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <nav aria-label="Components" className="mt-6 text-sm">
                <ComponentNavList onNavigate={() => setMobileOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
