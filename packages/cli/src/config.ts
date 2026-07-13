import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const CONFIG_FILE = "cooud-ui.json";

export const CLI_VERSION = "0.3.0";

export const DEFAULT_REGISTRY = `https://raw.githubusercontent.com/pedrogbraz/cooud-ui/v${CLI_VERSION}/registry`;

/** Manifest entry `add`/`upgrade` record per installed registry item. */
export interface InstalledRecord {
  /** Registry release the files came from (git tag without the leading "v"). */
  version: string;
  /** Project-relative paths the item wrote (e.g. "components/ui/button.tsx"). */
  files: string[];
}

export interface CooudUIConfig {
  /** Import aliases used when rewriting component sources. */
  aliases: {
    ui: string;
    lib: string;
    blocks: string;
  };
  /** Filesystem paths (relative to cwd) where files are written. */
  paths: {
    ui: string;
    lib: string;
    blocks: string;
  };
  /** Registry source (http base URL or local directory). */
  registry: string;
  /** The app's theme preset + color mode (written by the scaffolder / `theme set`). */
  theme?: {
    name: string;
    mode: string;
  };
  /**
   * Install manifest: which items are installed, from which registry release,
   * and which files they own. `upgrade` uses the recorded version as the merge
   * base for its 3-way merge. Absent for installs made before this field
   * existed ("legacy") — `upgrade` then falls back to a 2-way diff.
   */
  installed?: Record<string, InstalledRecord>;
}

export const DEFAULT_CONFIG: CooudUIConfig = {
  aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
  paths: { ui: "components/ui", lib: "lib", blocks: "components/blocks" },
  registry: DEFAULT_REGISTRY,
};

export function configPath(cwd: string): string {
  return join(cwd, CONFIG_FILE);
}

export function hasConfig(cwd: string): boolean {
  return existsSync(configPath(cwd));
}

export async function readConfig(cwd: string): Promise<CooudUIConfig> {
  const raw = await readFile(configPath(cwd), "utf8");
  const parsed = JSON.parse(raw) as Partial<CooudUIConfig>;
  return {
    aliases: { ...DEFAULT_CONFIG.aliases, ...parsed.aliases },
    paths: { ...DEFAULT_CONFIG.paths, ...parsed.paths },
    registry: parsed.registry ?? DEFAULT_CONFIG.registry,
    // Preserve the theme block when present so `add`/`init` round-trips never drop it.
    ...(parsed.theme ? { theme: parsed.theme } : {}),
    // Same for the install manifest — dropping it would silently downgrade every
    // component to the legacy (2-way) upgrade path.
    ...(parsed.installed ? { installed: parsed.installed } : {}),
  };
}

export async function writeConfig(cwd: string, config: CooudUIConfig): Promise<void> {
  await writeFile(configPath(cwd), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}
