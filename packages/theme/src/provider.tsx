"use client";

import {
  defaultMode,
  defaultTheme,
  type Mode,
  type ThemeName,
  type ThemeOverrides,
  tokensToCssVars,
} from "@cooud/tokens";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext, type ThemeContextValue } from "./use-theme.js";

export interface CooudUIProviderProps {
  children: ReactNode;
  /** Initial theme. @default "aurora" */
  defaultThemeName?: ThemeName;
  /** Initial mode. @default "dark" */
  defaultModeName?: Mode;
  /** Per-scope token overrides (radius, primary, border, ...). */
  overrides?: ThemeOverrides;
  /**
   * When true, attributes are written to <html> so the whole document is
   * themed. When false (default), they are written to a wrapper <div> so a
   * subtree can be themed independently (useful for the ThemeBuilder preview).
   */
  asRoot?: boolean;
  /** Persist theme/mode choice to localStorage under this key. */
  storageKey?: string;
  className?: string;
}

function applyRootAttributes(theme: ThemeName, mode: Mode) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.dataset.cooudTheme = theme;
  el.dataset.cooudMode = mode;
  el.classList.toggle("dark", mode === "dark");
}

/**
 * Themes its subtree purely via CSS custom properties — no per-component
 * re-render, no context churn beyond the controls themselves. Overriding
 * `radius`, `primary`, `border`, etc. updates the entire subtree instantly.
 */
export function CooudUIProvider({
  children,
  defaultThemeName = defaultTheme,
  defaultModeName = defaultMode,
  overrides = {},
  asRoot = false,
  storageKey,
  className,
}: CooudUIProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultThemeName);
  const [mode, setModeState] = useState<Mode>(defaultModeName);
  const [scopedOverrides, setScopedOverrides] = useState<ThemeOverrides>(overrides);

  // Hydrate from storage once on mount.
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as { theme?: ThemeName; mode?: Mode };
      if (saved.theme) setThemeState(saved.theme);
      if (saved.mode) setModeState(saved.mode);
    } catch {
      // ignore malformed storage
    }
  }, [storageKey]);

  // Keep external `overrides` prop in sync (controlled usage).
  useEffect(() => {
    setScopedOverrides(overrides);
  }, [overrides]);

  const persist = useCallback(
    (next: { theme: ThemeName; mode: Mode }) => {
      if (!storageKey || typeof window === "undefined") return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore quota / privacy errors
      }
    },
    [storageKey],
  );

  const setTheme = useCallback(
    (next: ThemeName) => {
      setThemeState(next);
      persist({ theme: next, mode });
    },
    [mode, persist],
  );

  const setMode = useCallback(
    (next: Mode) => {
      setModeState(next);
      persist({ theme, mode: next });
    },
    [theme, persist],
  );

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persist({ theme, mode: next });
      return next;
    });
  }, [theme, persist]);

  // Sync <html> attributes + overrides when used as the document root.
  useEffect(() => {
    if (!asRoot) return;
    applyRootAttributes(theme, mode);
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const vars = tokensToCssVars(scopedOverrides);
    for (const [prop, val] of Object.entries(vars)) el.style.setProperty(prop, val);
    return () => {
      for (const prop of Object.keys(vars)) el.style.removeProperty(prop);
    };
  }, [asRoot, theme, mode, scopedOverrides]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      overrides: scopedOverrides,
      setTheme,
      setMode,
      toggleMode,
      setOverrides: setScopedOverrides,
    }),
    [theme, mode, scopedOverrides, setTheme, setMode, toggleMode],
  );

  const style = useMemo(() => tokensToCssVars(scopedOverrides), [scopedOverrides]);

  return (
    <ThemeContext.Provider value={value}>
      {asRoot ? (
        children
      ) : (
        <div
          data-cooud-theme={theme}
          data-cooud-mode={mode}
          className={mode === "dark" ? `dark ${className ?? ""}` : className}
          style={style}
        >
          {children}
        </div>
      )}
    </ThemeContext.Provider>
  );
}
