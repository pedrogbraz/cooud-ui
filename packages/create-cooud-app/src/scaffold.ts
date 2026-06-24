import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageManager } from "./utils.js";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Locate the bundled `templates/` dir. In the published package, sources live
 * in `dist/` and templates are a sibling (`../templates`). When running from
 * source (tests/ts-node), they're one level up from `src/` as well.
 */
function templateRoot(): string {
  const candidates = [
    join(HERE, "..", "templates", "default"),
    join(HERE, "..", "..", "templates", "default"),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error(`Could not locate bundled templates (looked in: ${candidates.join(", ")}).`);
  }
  return found;
}

/**
 * Files whose dot-prefixed name npm strips when packing a template. We store
 * them undotted in the template and restore the leading "." on scaffold.
 * `gitignore` → `.gitignore`; a `_`-prefixed file → its dotted form.
 */
const DOTFILE_RENAMES: Record<string, string> = {
  gitignore: ".gitignore",
  npmrc: ".npmrc",
};

function restoreDotfileName(base: string): string {
  if (base in DOTFILE_RENAMES) return DOTFILE_RENAMES[base] as string;
  if (base.startsWith("_") && base.length > 1) return `.${base.slice(1)}`;
  return base;
}

/** Text extensions that get token replacement. Everything else is copied raw. */
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".txt",
  ".html",
]);

function isTextFile(path: string): boolean {
  const dot = path.lastIndexOf(".");
  return dot !== -1 && TEXT_EXTENSIONS.has(path.slice(dot));
}

/** Replace template tokens. Currently just the app name. */
export function applyTokens(content: string, name: string): string {
  return content.replaceAll("__APP_NAME__", name);
}

export interface ScaffoldOptions {
  /** Absolute path of the directory to create. */
  targetDir: string;
  /** Package name written into package.json / README (may be scoped). */
  name: string;
}

export interface ScaffoldResult {
  fileCount: number;
}

/**
 * Recursively copy the default template into `targetDir`, replacing tokens in
 * text files and restoring stripped dotfile names. Returns the file count.
 */
export function scaffold(options: ScaffoldOptions): ScaffoldResult {
  const src = templateRoot();
  const { targetDir, name } = options;
  mkdirSync(targetDir, { recursive: true });
  const fileCount = copyDir(src, targetDir, name);
  return { fileCount };
}

function copyDir(srcDir: string, destDir: string, name: string): number {
  mkdirSync(destDir, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, restoreDotfileName(entry));
    if (statSync(srcPath).isDirectory()) {
      count += copyDir(srcPath, destPath, name);
      continue;
    }
    if (isTextFile(srcPath)) {
      const content = applyTokens(readFileSync(srcPath, "utf8"), name);
      writeFileSync(destPath, content);
    } else {
      cpSync(srcPath, destPath);
    }
    count += 1;
  }
  return count;
}

/** Run the package manager's install in `cwd`. Throws if it exits non-zero. */
export function runInstall(pm: PackageManager, cwd: string): void {
  const result = spawnSync(pm, ["install"], {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (typeof result.status === "number" && result.status !== 0) {
    throw new Error(`${pm} install exited with code ${result.status}`);
  }
}
