"use client";

import { useTheme } from "@cooud-ui/theme";
import { type ThemeName, themeNames } from "@cooud-ui/tokens";
import { Badge } from "@cooud-ui/ui/badge";
import { cn } from "@cooud-ui/ui/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@cooud-ui/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@cooud-ui/ui/sheet";
import { Github, Menu, Moon, Palette, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CooudMark } from "./brand/cooud-mark";
import { CommandSearch } from "./docs/command-search";
import { ComponentNavList } from "./docs/docs-sidebar";
import { DocumentationNavList } from "./docs/documentation-nav";

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Create", href: "/create" },
  { label: "Playground", href: "/#playground" },
  { label: "Stack", href: "/stack", badge: "BETA" },
  { label: "Changelog", href: "/changelog" },
] as const;

const GITHUB_URL = "https://github.com/pedrogbraz/cooud-ui";

/** Friendly Title Case label for each theme preset. */
const themeLabels: Record<ThemeName, string> = {
  aurora: "Aurora",
  neutral: "Neutral",
  midnight: "Midnight",
  sunset: "Sunset",
  emerald: "Emerald",
};

/** A representative swatch per theme, derived from each preset's `primary` token. */
const themeSwatches: Record<ThemeName, string> = {
  aurora: "oklch(0.685 0.169 237.3)",
  neutral: "oklch(0.62 0 0)",
  midnight: "oklch(0.55 0.205 280)",
  sunset: "oklch(0.78 0.16 65)",
  emerald: "oklch(0.74 0.16 160)",
};

/** Sun ⇄ moon glyph that crossfades with the active color mode (motion-reduce safe). */
function ModeIcon({ isDark }: { isDark: boolean }) {
  return (
    <span className="relative block size-[18px]" aria-hidden="true">
      <Sun
        className={cn(
          "absolute inset-0 size-[18px] transition-all duration-300 ease-out motion-reduce:transition-none",
          isDark
            ? "opacity-0 motion-safe:-rotate-90 motion-safe:scale-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute inset-0 size-[18px] transition-all duration-300 ease-out motion-reduce:transition-none",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "opacity-0 motion-safe:rotate-90 motion-safe:scale-0",
        )}
      />
    </span>
  );
}

export function SiteNav() {
  const { theme, mode, toggleMode, setTheme } = useTheme();
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
          <CooudMark className="h-5 w-10 text-fg transition-opacity group-hover:opacity-90" />
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
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
                {"badge" in link && (
                  <Badge
                    variant="secondary"
                    className="px-1 py-0 text-[9px] font-semibold uppercase tracking-wide"
                  >
                    {link.badge}
                  </Badge>
                )}
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

          {/* Theme preset selector */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Change theme (current: ${themeLabels[theme]})`}
              className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-surface-overlay data-[state=open]:text-fg"
            >
              <span className="relative grid size-[18px] place-items-center">
                <Palette className="size-[18px]" aria-hidden="true" />
                <span
                  className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full ring-2 ring-surface-base"
                  style={{ backgroundColor: themeSwatches[theme] }}
                  aria-hidden="true"
                />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[11rem]">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as ThemeName)}
              >
                {themeNames.map((name) => (
                  <DropdownMenuRadioItem key={name} value={name} className="gap-2.5">
                    <span
                      className="size-3.5 shrink-0 rounded-full ring-1 ring-inset ring-border shadow-xs"
                      style={{ backgroundColor: themeSwatches[name] }}
                      aria-hidden="true"
                    />
                    {themeLabels[name]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Light / dark mode toggle */}
          <button
            type="button"
            onClick={toggleMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ModeIcon isDark={isDark} />
          </button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
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
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                      {"badge" in link && (
                        <Badge
                          variant="secondary"
                          className="px-1 py-0 text-[9px] font-semibold uppercase tracking-wide"
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <nav aria-label="Documentation" className="mt-6 text-sm">
                <DocumentationNavList onNavigate={() => setMobileOpen(false)} />
              </nav>

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
