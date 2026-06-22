/**
 * Cooud design tokens — single source of truth.
 *
 * These TS objects mirror the CSS variables defined in `styles/tokens.css`.
 * They are consumed by the ThemeBuilder (to generate override snippets) and by
 * `@cooud/theme` (to apply runtime overrides). Components NEVER read these
 * directly — they use semantic Tailwind utilities that resolve to the CSS vars.
 *
 * Values are cherry-picked from the premium Aurora language (cooud-workforce /
 * cooud-exchange) and the Neutral language (dashboard / refund / status).
 */

export type ThemeName = "aurora" | "neutral";
export type Mode = "light" | "dark";

export interface ThemeTokens {
  // Brand
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  // Surfaces (low → high elevation)
  surfaceBase: string;
  surfaceInset: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  surfaceElevated: string;
  surfaceFloating: string;
  // Foreground / text
  fg: string;
  fgSecondary: string;
  fgTertiary: string;
  fgMuted: string;
  fgInverse: string;
  // Lines
  border: string;
  borderStrong: string;
  borderSoft: string;
  ring: string;
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
  // Shape
  radius: string;
  // Typography
  fontSans: string;
  fontDisplay: string;
  fontMono: string;
  // Data visualization
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  // Elevation
  shadowXs: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowGlow: string;
}

/** Subset of tokens a consumer can override per-scope at runtime. */
export type ThemeOverrides = Partial<ThemeTokens>;

const fonts = {
  sans: '"SF Pro Text", Geist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  display: '"SF Pro Display", Geist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
} as const;

const auroraDark: ThemeTokens = {
  primary: "oklch(0.685 0.169 237.3)", // sky-500 #0ea5e9
  primaryForeground: "oklch(0.145 0.005 285.8)",
  accent: "oklch(0.715 0.143 215.2)", // cyan-500 #06b6d4
  accentForeground: "oklch(0.145 0 0)",
  surfaceBase: "oklch(0.145 0.005 285.8)", // #09090b
  surfaceInset: "oklch(0.165 0.005 285.8)", // #0c0c0e
  surfaceRaised: "oklch(0.195 0.005 285.8)", // #111113
  surfaceOverlay: "oklch(0.235 0.006 285.9)", // #18181b
  surfaceElevated: "oklch(0.27 0.006 286)", // #1f1f23
  surfaceFloating: "oklch(0.31 0.006 286)", // #27272a
  fg: "oklch(0.985 0.001 106.4)", // #fafaf9
  fgSecondary: "oklch(0.705 0.015 286)", // #a1a1aa
  fgTertiary: "oklch(0.62 0.014 286)", // #83838c — WCAG AA: >=4.5:1 over dark surfaces (base/inset/raised/overlay)
  fgMuted: "oklch(0.442 0.013 286)", // #52525b
  fgInverse: "oklch(0.235 0.006 285.9)",
  border: "oklch(1 0 0 / 0.1)",
  borderStrong: "oklch(1 0 0 / 0.14)",
  borderSoft: "oklch(1 0 0 / 0.06)",
  ring: "oklch(0.685 0.169 237.3)",
  success: "oklch(0.715 0.155 162.5)", // emerald #10b981
  warning: "oklch(0.769 0.166 70.08)", // amber #f59e0b
  error: "oklch(0.645 0.222 16.44)", // rose #f43f5e
  info: "oklch(0.715 0.143 215.2)", // cyan #06b6d4
  radius: "14px",
  fontSans: fonts.sans,
  fontDisplay: fonts.display,
  fontMono: fonts.mono,
  chart1: "oklch(0.685 0.169 237.3)",
  chart2: "oklch(0.715 0.143 215.2)",
  chart3: "oklch(0.62 0.21 292)",
  chart4: "oklch(0.7 0.15 162)",
  chart5: "oklch(0.78 0.16 70)",
  shadowXs: "0 1px 2px rgba(0,0,0,0.20)",
  shadowSm: "0 2px 4px rgba(0,0,0,0.22)",
  shadowMd: "0 6px 12px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.16)",
  shadowLg: "0 12px 24px rgba(0,0,0,0.28), 0 4px 8px rgba(0,0,0,0.18)",
  shadowGlow: "0 12px 32px rgba(14,165,233,0.32)",
};

const auroraLight: ThemeTokens = {
  ...auroraDark,
  primaryForeground: "oklch(0.145 0.005 285.8)",
  accentForeground: "oklch(0.145 0 0)",
  surfaceBase: "oklch(1 0 0)", // #ffffff
  surfaceInset: "oklch(0.985 0 0)", // #fafafa
  surfaceRaised: "oklch(1 0 0)",
  surfaceOverlay: "oklch(0.967 0.001 286)", // #f4f4f5
  surfaceElevated: "oklch(1 0 0)",
  surfaceFloating: "oklch(1 0 0)",
  fg: "oklch(0.235 0.006 285.9)", // #18181b
  fgSecondary: "oklch(0.442 0.013 286)", // #52525b
  fgTertiary: "oklch(0.552 0.014 286)",
  fgMuted: "oklch(0.705 0.015 286)",
  fgInverse: "oklch(0.985 0.001 106.4)",
  border: "oklch(0 0 0 / 0.1)",
  borderStrong: "oklch(0 0 0 / 0.14)",
  borderSoft: "oklch(0 0 0 / 0.06)",
  shadowXs: "0 1px 2px rgba(16,24,40,0.06)",
  shadowSm: "0 2px 4px rgba(16,24,40,0.08)",
  shadowMd: "0 6px 12px rgba(16,24,40,0.10), 0 2px 4px rgba(16,24,40,0.06)",
  shadowLg: "0 12px 24px rgba(16,24,40,0.12), 0 4px 8px rgba(16,24,40,0.08)",
  shadowGlow: "0 12px 32px rgba(14,165,233,0.22)",
  success: "oklch(0.52 0.15 162)",
  warning: "oklch(0.52 0.12 70)",
  info: "oklch(0.52 0.16 235)",
  error: "oklch(0.55 0.2 25)",
};

const neutralLight: ThemeTokens = {
  primary: "oklch(0.205 0 0)",
  primaryForeground: "oklch(0.985 0 0)",
  accent: "oklch(0.96 0 0)",
  accentForeground: "oklch(0.205 0 0)",
  surfaceBase: "oklch(0.985 0 0)",
  surfaceInset: "oklch(0.97 0 0)",
  surfaceRaised: "oklch(1 0 0)",
  surfaceOverlay: "oklch(0.96 0 0)",
  surfaceElevated: "oklch(1 0 0)",
  surfaceFloating: "oklch(1 0 0)",
  fg: "oklch(0.145 0 0)",
  fgSecondary: "oklch(0.43 0 0)",
  fgTertiary: "oklch(0.556 0 0)",
  fgMuted: "oklch(0.705 0 0)",
  fgInverse: "oklch(0.985 0 0)",
  border: "oklch(0.915 0 0)",
  borderStrong: "oklch(0.86 0 0)",
  borderSoft: "oklch(0.94 0 0)",
  ring: "oklch(0.705 0 0)",
  success: "oklch(0.52 0.15 162)",
  warning: "oklch(0.52 0.12 70)",
  error: "oklch(0.55 0.2 25)",
  info: "oklch(0.52 0.16 235)",
  radius: "14px",
  fontSans: fonts.sans,
  fontDisplay: fonts.display,
  fontMono: fonts.mono,
  chart1: "oklch(0.3 0 0)",
  chart2: "oklch(0.44 0 0)",
  chart3: "oklch(0.58 0 0)",
  chart4: "oklch(0.72 0 0)",
  chart5: "oklch(0.85 0 0)",
  shadowXs: "0 1px 2px rgba(16,24,40,0.05)",
  shadowSm: "0 1px 3px rgba(16,24,40,0.08)",
  shadowMd: "0 4px 8px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.04)",
  shadowLg: "0 12px 24px rgba(16,24,40,0.10), 0 4px 8px rgba(16,24,40,0.06)",
  shadowGlow: "0 0 0 4px oklch(0.705 0 0 / 0.18)",
};

const neutralDark: ThemeTokens = {
  ...neutralLight,
  primary: "oklch(0.93 0 0)",
  primaryForeground: "oklch(0.11 0 0)",
  accent: "oklch(0.27 0 0)",
  accentForeground: "oklch(0.93 0 0)",
  surfaceBase: "oklch(0.11 0 0)",
  surfaceInset: "oklch(0.13 0 0)",
  surfaceRaised: "oklch(0.16 0 0)",
  surfaceOverlay: "oklch(0.2 0 0)",
  surfaceElevated: "oklch(0.23 0 0)",
  surfaceFloating: "oklch(0.27 0 0)",
  fg: "oklch(0.93 0 0)",
  fgSecondary: "oklch(0.7 0 0)",
  fgTertiary: "oklch(0.62 0 0)",
  fgMuted: "oklch(0.44 0 0)",
  fgInverse: "oklch(0.11 0 0)",
  border: "oklch(1 0 0 / 0.1)",
  borderStrong: "oklch(1 0 0 / 0.16)",
  borderSoft: "oklch(1 0 0 / 0.06)",
  ring: "oklch(0.55 0 0)",
  success: "oklch(0.715 0.155 162.5)",
  warning: "oklch(0.769 0.166 70.08)",
  info: "oklch(0.715 0.143 215.2)",
  error: "oklch(0.704 0.191 22.216)",
  shadowGlow: "0 0 0 4px oklch(0.6 0 0 / 0.3)",
};

export const themes: Record<ThemeName, Record<Mode, ThemeTokens>> = {
  aurora: { light: auroraLight, dark: auroraDark },
  neutral: { light: neutralLight, dark: neutralDark },
};

export const themeNames: ThemeName[] = ["aurora", "neutral"];
export const modes: Mode[] = ["light", "dark"];
export const defaultTheme: ThemeName = "aurora";
export const defaultMode: Mode = "dark";

/** Maps a ThemeTokens key to its runtime CSS custom property name. */
export const cssVarMap: Record<keyof ThemeTokens, string> = {
  primary: "--cooud-primary",
  primaryForeground: "--cooud-primary-foreground",
  accent: "--cooud-accent",
  accentForeground: "--cooud-accent-foreground",
  surfaceBase: "--cooud-surface-base",
  surfaceInset: "--cooud-surface-inset",
  surfaceRaised: "--cooud-surface-raised",
  surfaceOverlay: "--cooud-surface-overlay",
  surfaceElevated: "--cooud-surface-elevated",
  surfaceFloating: "--cooud-surface-floating",
  fg: "--cooud-fg",
  fgSecondary: "--cooud-fg-secondary",
  fgTertiary: "--cooud-fg-tertiary",
  fgMuted: "--cooud-fg-muted",
  fgInverse: "--cooud-fg-inverse",
  border: "--cooud-border",
  borderStrong: "--cooud-border-strong",
  borderSoft: "--cooud-border-soft",
  ring: "--cooud-ring",
  success: "--cooud-success",
  warning: "--cooud-warning",
  error: "--cooud-error",
  info: "--cooud-info",
  radius: "--cooud-radius",
  fontSans: "--cooud-font-sans",
  fontDisplay: "--cooud-font-display",
  fontMono: "--cooud-font-mono",
  chart1: "--cooud-chart-1",
  chart2: "--cooud-chart-2",
  chart3: "--cooud-chart-3",
  chart4: "--cooud-chart-4",
  chart5: "--cooud-chart-5",
  shadowXs: "--cooud-shadow-xs",
  shadowSm: "--cooud-shadow-sm",
  shadowMd: "--cooud-shadow-md",
  shadowLg: "--cooud-shadow-lg",
  shadowGlow: "--cooud-shadow-glow",
};

/** Convert a (partial) token set into a `{ "--cooud-*": value }` style object. */
export function tokensToCssVars(tokens: ThemeOverrides): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(tokens) as (keyof ThemeTokens)[]) {
    const value = tokens[key];
    if (value != null) out[cssVarMap[key]] = value;
  }
  return out;
}

/** Render overrides as a copy-pasteable CSS block (used by the ThemeBuilder). */
export function serializeOverrides(tokens: ThemeOverrides, selector = ":root"): string {
  const vars = tokensToCssVars(tokens);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

export const fontStacks = fonts;
