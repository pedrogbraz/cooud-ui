import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const CONFIG_FILE = "cooud-ui.json";

export const CLI_VERSION = "0.1.0";

export const DEFAULT_REGISTRY = `https://raw.githubusercontent.com/pedrogbraz/cooud-ui/v${CLI_VERSION}/registry`;

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
  };
}

export async function writeConfig(cwd: string, config: CooudUIConfig): Promise<void> {
  const body = { $schema: "https://cooud-ui.dev/schema.json", ...config };
  await writeFile(configPath(cwd), `${JSON.stringify(body, null, 2)}\n`, "utf8");
}
