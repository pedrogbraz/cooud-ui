/**
 * The Create studio config model — a full design-system definition the user can
 * tweak, bundle into a named Style preset, save, and export.
 */

export type Mode = "light" | "dark";

export interface DesignConfig {
  /** Name of the active Style preset (or "Custom"). */
  style: string;
  mode: Mode;
  /** Neutral ramp id (drives surfaces / fg / borders). */
  baseColor: string;
  /** Brand color id (drives primary / accent / ring). */
  brand: string;
  /** Chart palette id (drives --chart-1..5). */
  chart: string;
  /** Heading font id. */
  headingFont: string;
  /** Body font id. */
  bodyFont: string;
  /** Optional freeform CSS color overriding the selected brand's primary. */
  primaryColor?: string;
  /** Optional freeform CSS color overriding the selected brand's accent. */
  accentColor?: string;
  /** Corner radius in px. */
  radius: number;
}

/** A neutral surface ramp for one mode (light or dark). */
export interface BaseRamp {
  surfaceBase: string;
  surfaceInset: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  surfaceElevated: string;
  surfaceFloating: string;
  fg: string;
  fgSecondary: string;
  fgTertiary: string;
  fgMuted: string;
  border: string;
  borderStrong: string;
  borderSoft: string;
}

export interface BaseColor {
  id: string;
  name: string;
  /** A swatch color for the control chip. */
  swatch: string;
  light: BaseRamp;
  dark: BaseRamp;
}

export interface BrandColor {
  id: string;
  name: string;
  swatch: string;
  /** Vivid values for dark mode. */
  primary: string;
  accent: string;
  /** Darker, readable values for light mode (foreground-safe). */
  primaryLight: string;
  accentLight: string;
  primaryForeground: string;
}

export interface ChartPalette {
  id: string;
  name: string;
  /** Five chart series colors. */
  colors: [string, string, string, string, string];
}

export interface FontChoice {
  id: string;
  name: string;
  /** CSS font-family stack (uses a CSS var the page wires to next/font where available). */
  stack: string;
}

/** A named Style preset = a full DesignConfig bundle. */
export interface StylePreset {
  id: string;
  name: string;
  description: string;
  version?: 1;
  config: Omit<DesignConfig, "style">;
  custom?: boolean;
  createdAt?: string;
}
