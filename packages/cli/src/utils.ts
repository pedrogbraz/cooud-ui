import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import pc from "picocolors";
import type { CooudUIConfig } from "./config.js";
import type { RegistryItem } from "./registry.js";

export const log = {
  info: (msg: string) => console.log(`${pc.cyan("ℹ")} ${msg}`),
  ok: (msg: string) => console.log(`${pc.green("✔")} ${msg}`),
  warn: (msg: string) => console.log(`${pc.yellow("⚠")} ${msg}`),
  err: (msg: string) => console.error(`${pc.red("✖")} ${msg}`),
  step: (msg: string) => console.log(`${pc.dim("›")} ${msg}`),
  title: (msg: string) => console.log(`\n${pc.bold(msg)}`),
};

export type PackageManager = "bun" | "pnpm" | "yarn" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installArgs(pm: PackageManager, deps: string[]): string[] {
  switch (pm) {
    case "bun":
      return ["add", ...deps];
    case "pnpm":
      return ["add", ...deps];
    case "yarn":
      return ["add", ...deps];
    default:
      return ["install", ...deps];
  }
}

export function runInstall(pm: PackageManager, deps: string[], cwd: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(pm, installArgs(pm, deps), { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${pm} exited with code ${code}`)),
    );
  });
}

/**
 * Rewrite a component's canonical specifiers to the consumer's aliases:
 *   "../lib/cn.js"  → `${aliases.lib}/cn`
 *   "./button.js"   → `${aliases.ui}/button`
 * npm imports are left untouched.
 */
export function rewriteImports(content: string, config: CooudUIConfig): string {
  return content
    .replace(/(["'])\.\.\/lib\/cn\.js\1/g, `"${config.aliases.lib}/cn"`)
    .replace(/(["'])\.\/([\w-]+)\.js\1/g, `"${config.aliases.ui}/$2"`);
}

export function targetDir(config: CooudUIConfig, target: "ui" | "lib"): string {
  return target === "ui" ? config.paths.ui : config.paths.lib;
}

export async function writeFileEnsured(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

/**
 * Resolve a registry-supplied `filePath` against `<cwd>/<dir>` while guaranteeing
 * the result stays inside that directory. `filePath` arrives raw from a remote
 * registry, so it is untrusted: reject absolute paths and any `..` traversal that
 * would escape the target root (e.g. "../escape" or "/etc/passwd").
 *
 * Returns the resolved absolute destination; throws a clear Error naming the
 * offending path otherwise.
 */
export function resolveSafeDest(cwd: string, dir: string, filePath: string): string {
  if (isAbsolute(filePath)) {
    throw new Error(`Refusing to write absolute registry path: ${filePath}`);
  }
  const resolvedRoot = resolve(join(cwd, dir));
  const resolvedDest = resolve(join(cwd, dir, filePath));
  if (resolvedDest !== resolvedRoot && !resolvedDest.startsWith(resolvedRoot + sep)) {
    throw new Error(`Refusing to write registry path outside target directory: ${filePath}`);
  }
  return resolvedDest;
}

/** Write all files of a resolved item, applying alias rewrites, return written paths. */
export async function writeItemFiles(
  item: RegistryItem,
  config: CooudUIConfig,
  cwd: string,
  { overwrite }: { overwrite: boolean },
): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = [];
  const skipped: string[] = [];
  for (const file of item.files) {
    const dir = targetDir(config, file.target);
    const dest = resolveSafeDest(cwd, dir, file.path);
    if (existsSync(dest) && !overwrite) {
      skipped.push(join(dir, file.path));
      continue;
    }
    await writeFileEnsured(dest, rewriteImports(file.content, config));
    written.push(join(dir, file.path));
  }
  return { written, skipped };
}

/** Collect + de-duplicate npm deps across resolved items. */
export function collectDependencies(items: RegistryItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) for (const dep of item.dependencies) set.add(dep);
  return [...set].sort();
}
