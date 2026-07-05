import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { CONFIG_FILE, hasConfig, readConfig, writeConfig } from "../config.js";
import { log } from "../utils.js";

/** The theme presets shipped by @cooud-ui/theme. */
export const THEME_PRESETS = ["aurora", "neutral", "midnight", "sunset", "emerald"] as const;

/** The two color modes a preset can be pinned to. */
export const THEME_MODES = ["dark", "light"] as const;

/** Root-layout locations we probe, in priority order (relative to cwd). */
const LAYOUT_CANDIDATES = [
  "app/layout.tsx",
  "src/app/layout.tsx",
  "app/layout.jsx",
  "src/app/layout.jsx",
] as const;

/**
 * A layout only counts if it actually mounts the theme runtime — otherwise
 * rewriting attributes there would be pointless (and risk touching an unrelated
 * `layout.tsx`). Either the anti-flash script tag or the provider qualifies.
 */
const THEME_MARKERS = ["CooudThemeScript", "CooudUIProvider"];

interface ThemeSetOptions {
  name: string;
  mode?: string;
  cwd: string;
}

/**
 * Rewrite every `<attr>="…"` occurrence to `value`, preserving the original
 * quote style and only counting occurrences whose value actually changed (so a
 * re-run on an already-set attribute reports zero changes — idempotent).
 */
function rewriteAttr(
  source: string,
  attr: string,
  value: string,
): { content: string; changed: number } {
  let changed = 0;
  const re = new RegExp(`${attr}=(["'])(.*?)\\1`, "g");
  const content = source.replace(re, (match, quote: string, previous: string) => {
    if (previous === value) return match;
    changed += 1;
    return `${attr}=${quote}${value}${quote}`;
  });
  return { content, changed };
}

/** First existing candidate layout that mounts the Cooud theme runtime. */
async function findLayout(
  cwd: string,
): Promise<{ path: string; rel: string; content: string } | undefined> {
  for (const rel of LAYOUT_CANDIDATES) {
    const path = join(cwd, rel);
    if (!existsSync(path)) continue;
    const content = await readFile(path, "utf8");
    if (THEME_MARKERS.some((marker) => content.includes(marker))) {
      return { path, rel, content };
    }
  }
  return undefined;
}

export async function themeSet(options: ThemeSetOptions): Promise<void> {
  const { cwd, name } = options;

  if (!(THEME_PRESETS as readonly string[]).includes(name)) {
    log.err(`Unknown theme "${name}". Choose one of: ${THEME_PRESETS.join(", ")}.`);
    return;
  }
  if (options.mode !== undefined && !(THEME_MODES as readonly string[]).includes(options.mode)) {
    log.err(`Invalid mode "${options.mode}". Choose "${THEME_MODES.join('" or "')}".`);
    return;
  }
  const mode = options.mode;

  log.title(`Setting theme to ${name}${mode ? ` (${mode})` : ""}`);

  const layout = await findLayout(cwd);
  if (layout) {
    const theme = rewriteAttr(layout.content, "defaultThemeName", name);
    let next = theme.content;
    let changed = theme.changed;
    if (mode) {
      const colorMode = rewriteAttr(next, "defaultModeName", mode);
      next = colorMode.content;
      changed += colorMode.changed;
    }

    if (next !== layout.content) {
      await writeFile(layout.path, next, "utf8");
    }
    log.ok(`Updated ${layout.rel} (${changed} attribute(s) changed)`);
  } else {
    log.warn(
      "No app layout mounting <CooudThemeScript>/<CooudUIProvider> found — updating config only.",
    );
  }

  if (hasConfig(cwd)) {
    const config = await readConfig(cwd);
    // Preserve the current mode when --mode is omitted; fall back to "dark" only
    // when the config has never recorded a theme mode before.
    const nextMode = mode ?? config.theme?.mode ?? "dark";
    config.theme = { name, mode: nextMode };
    await writeConfig(cwd, config);
    log.ok(`Wrote theme to ${CONFIG_FILE}`);
  } else {
    log.step(`No ${CONFIG_FILE} — skipped config update.`);
  }

  log.title("Done");
}
