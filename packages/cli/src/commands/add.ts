import { hasConfig, readConfig } from "../config.js";
import { Registry } from "../registry.js";
import {
  collectDependencies,
  detectPackageManager,
  log,
  runInstall,
  writeItemFiles,
} from "../utils.js";

interface AddOptions {
  cwd: string;
  overwrite?: boolean;
  skipInstall?: boolean;
  registry?: string;
}

export async function add(names: string[], options: AddOptions): Promise<void> {
  const { cwd } = options;

  if (!hasConfig(cwd)) {
    log.err("No cooud-ui.json found. Run `cooud-ui init` first.");
    process.exitCode = 1;
    return;
  }
  if (names.length === 0) {
    log.err("Specify at least one component, e.g. `cooud-ui add button card`.");
    process.exitCode = 1;
    return;
  }

  const config = await readConfig(cwd);
  const registry = new Registry(options.registry ?? config.registry);

  let items: Awaited<ReturnType<Registry["resolve"]>>;
  try {
    items = await registry.resolve(names);
  } catch (err) {
    log.err(`Failed to resolve from registry: ${(err as Error).message}`);
    process.exitCode = 1;
    return;
  }

  const requested = new Set(names);
  const pulledIn = items.filter((i) => !requested.has(i.name) && i.type === "registry:ui");
  log.title(`Adding ${names.length} component(s)`);
  if (pulledIn.length > 0) {
    log.step(`Pulling in dependencies: ${pulledIn.map((i) => i.name).join(", ")}`);
  }

  const allWritten: string[] = [];
  const allSkipped: string[] = [];
  for (const item of items) {
    const { written, skipped } = await writeItemFiles(item, config, cwd, {
      overwrite: options.overwrite ?? false,
    });
    allWritten.push(...written);
    allSkipped.push(...skipped);
  }

  for (const path of allWritten) log.ok(`Added ${path}`);
  for (const path of allSkipped) log.warn(`Skipped ${path} (exists — use --overwrite)`);

  const deps = collectDependencies(items);
  if (deps.length > 0 && !options.skipInstall) {
    const pm = detectPackageManager(cwd);
    log.step(`Installing ${deps.length} dependencies with ${pm}…`);
    try {
      await runInstall(pm, deps, cwd);
      log.ok("Installed dependencies");
    } catch (err) {
      log.warn(`Install failed: ${(err as Error).message}`);
      log.step(`Install manually: ${pm} add ${deps.join(" ")}`);
    }
  } else if (deps.length > 0) {
    log.step(`Dependencies to install: ${deps.join(" ")}`);
  }

  log.title(`Done — ${allWritten.length} file(s) written.`);
}
