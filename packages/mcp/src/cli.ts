import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { SERVER_VERSION } from "./version.js";

/**
 * The pinned CLI spec the write tools execute. The MCP server and the CLI are
 * released in lockstep from the same repo tag, so pinning `cooud-ui` to the
 * server's own version guarantees the spawned CLI resolves items from the same
 * registry release the read tools describe.
 */
export const PINNED_CLI = `cooud-ui@${SERVER_VERSION}`;

/** Default wall-clock budget for one CLI run (registry fetch + npm install). */
export const DEFAULT_CLI_TIMEOUT_MS = 120_000;

/**
 * Launcher command lines to try, in order. Each entry is an argv prefix the
 * CLI subcommand args are appended to.
 *
 * - `COOUD_MCP_CLI_CMD` (whitespace-split, e.g. "bun /repo/packages/cli/src/index.ts")
 *   replaces the launchers entirely — used by tests and local development.
 *   Paths containing spaces are not supported in this seam.
 * - Otherwise: `bunx --bun cooud-ui@<version>`, falling back to
 *   `npx -y cooud-ui@<version>` when `bunx` is not installed.
 */
export function resolveCliInvocations(env: NodeJS.ProcessEnv = process.env): string[][] {
  const seam = env.COOUD_MCP_CLI_CMD?.trim();
  if (seam) return [seam.split(/\s+/)];
  return [
    ["bunx", "--bun", PINNED_CLI],
    ["npx", "-y", PINNED_CLI],
  ];
}

/** The per-run timeout, honouring the `COOUD_MCP_CLI_TIMEOUT_MS` override. */
export function resolveCliTimeoutMs(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env.COOUD_MCP_CLI_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_CLI_TIMEOUT_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CLI_TIMEOUT_MS;
}

/** Where a write tool operates: the detected consumer project root. */
export interface ProjectRoot {
  dir: string;
  /** Whether `cooud-ui.json` (the CLI's own config) was found there. */
  hasCooudConfig: boolean;
}

/**
 * Detect the consumer project root by walking up from `startDir`:
 * the nearest directory containing `cooud-ui.json` wins (that is where the CLI
 * must run); otherwise the nearest directory containing `package.json`.
 * Returns undefined when neither exists anywhere up the tree.
 */
export function findProjectRoot(startDir: string = process.cwd()): ProjectRoot | undefined {
  let dir = resolve(startDir);
  let packageJsonDir: string | undefined;
  for (;;) {
    if (existsSync(join(dir, "cooud-ui.json"))) return { dir, hasCooudConfig: true };
    if (packageJsonDir === undefined && existsSync(join(dir, "package.json"))) {
      packageJsonDir = dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return packageJsonDir === undefined ? undefined : { dir: packageJsonDir, hasCooudConfig: false };
}

/** Options shared by {@link runCli} and the write-tool entry points. */
export interface CliRunOptions {
  /** Directory to detect the project from (default: `process.cwd()`). */
  cwd?: string;
  /** Wall-clock budget for the child process. */
  timeoutMs?: number;
  /** Environment consulted for the launcher/timeout/registry seams. */
  env?: NodeJS.ProcessEnv;
  /** Explicit launcher argv prefixes (tests); overrides the env seam. */
  candidates?: string[][];
}

/** The raw outcome of one CLI child process. */
export interface CliRunResult {
  /** The exact command line that ran, for transparency in tool output. */
  command: string;
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
}

function spawnOnce(argv: string[], cwd: string, timeoutMs: number): Promise<CliRunResult> {
  return new Promise((resolvePromise, reject) => {
    const [command = "", ...args] = argv;
    const child = spawn(command, args, {
      cwd,
      // NO_COLOR keeps picocolors output plain so the result parsers see the
      // literal `✔ Added <path>` lines. stdin is closed: the CLI surface used
      // here is non-interactive, so nothing may wait on input.
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise({ command: argv.join(" "), exitCode: code, timedOut, stdout, stderr });
    });
  });
}

/**
 * Run one `cooud-ui` CLI invocation with the given subcommand args, trying
 * each launcher candidate in order (a missing launcher binary — ENOENT — moves
 * on to the next; any other spawn failure is thrown as-is).
 */
export async function runCli(
  subArgs: string[],
  options: { cwd: string } & Omit<CliRunOptions, "cwd">,
): Promise<CliRunResult> {
  const env = options.env ?? process.env;
  const candidates = options.candidates ?? resolveCliInvocations(env);
  const timeoutMs = options.timeoutMs ?? resolveCliTimeoutMs(env);
  for (const prefix of candidates) {
    try {
      return await spawnOnce([...prefix, ...subArgs], options.cwd, timeoutMs);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
  }
  const tried = candidates.map((c) => c[0]).join(", ");
  throw new Error(
    `Could not launch the cooud-ui CLI — none of the launchers exist on PATH (tried: ${tried}). ` +
      "Install bun or node/npm, or point COOUD_MCP_CLI_CMD at a runnable CLI.",
  );
}

/** How a completed CLI run is classified in tool output. */
export type RunStatus = "success" | "failed" | "timeout";

function classify(run: CliRunResult): RunStatus {
  if (run.timedOut) return "timeout";
  return run.exitCode === 0 ? "success" : "failed";
}

// Defensive: NO_COLOR should already keep the output plain, but a consumer
// env forcing color must not break parsing.
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching the ESC character is the whole point — this strips ANSI SGR color sequences.
const ANSI_PATTERN = /\u001B\[[0-9;]*m/g;

/** Strip ANSI SGR color sequences from CLI output. */
export function stripAnsi(text: string): string {
  return text.replace(ANSI_PATTERN, "");
}

/** What `cooud-ui add` reported doing, extracted from its output. */
export interface ParsedAddOutput {
  /** Project-relative paths written this run (components, blocks, lib files). */
  installedFiles: string[];
  /** Paths that already existed and were left untouched (use overwrite). */
  skippedFiles: string[];
  dependencies: {
    /** True when the CLI ran the package-manager install successfully. */
    installed: boolean;
    /** npm specs still to be installed manually (skip/failed install). */
    pending: string[];
  };
}

/** Parse the `cooud-ui add` log lines into a structured summary. */
export function parseAddOutput(stdout: string): ParsedAddOutput {
  const installedFiles: string[] = [];
  const skippedFiles: string[] = [];
  let installed = false;
  let pending: string[] = [];
  for (const raw of stripAnsi(stdout).split("\n")) {
    const line = raw.trim();
    const added = line.match(/^✔ Added (.+)$/);
    if (added?.[1]) {
      installedFiles.push(added[1]);
      continue;
    }
    const skipped = line.match(/^⚠ Skipped (.+) \(exists/);
    if (skipped?.[1]) {
      skippedFiles.push(skipped[1]);
      continue;
    }
    if (line === "✔ Installed dependencies") {
      installed = true;
      continue;
    }
    // `--skip-install` prints "Dependencies to install:"; a failed install
    // prints "Install manually: <pm> add <specs>". Either way the specs are
    // still pending in the consumer project.
    const manual = line.match(/^› Install manually: \S+ add (.+)$/);
    const toInstall = manual ?? line.match(/^› Dependencies to install: (.+)$/);
    if (toInstall?.[1]) pending = toInstall[1].split(/\s+/);
  }
  return { installedFiles, skippedFiles, dependencies: { installed, pending } };
}

/** What `cooud-ui theme add` reported doing, extracted from its output. */
export interface ParsedThemeOutput {
  /** Completed writes ("Updated app/layout.tsx …", "Wrote the override block …"). */
  changes: string[];
  /** Dry-run plan lines ("Would update …", "Would write …"). */
  planned: string[];
  /** Warnings (e.g. no layout mounting the theme runtime was found). */
  warnings: string[];
}

/** Parse the `cooud-ui theme add` log lines into a structured summary. */
export function parseThemeOutput(stdout: string): ParsedThemeOutput {
  const changes: string[] = [];
  const planned: string[] = [];
  const warnings: string[] = [];
  for (const raw of stripAnsi(stdout).split("\n")) {
    const line = raw.trim();
    if (line.startsWith("✔ ")) changes.push(line.slice(2));
    else if (line.startsWith("› Would ")) planned.push(line.slice(2));
    else if (line.startsWith("⚠ ")) warnings.push(line.slice(2));
  }
  return { changes, planned, warnings };
}

/**
 * Registry item names are slugs. Anything else is rejected before it reaches
 * the child argv, so a name can never be smuggled in as a CLI flag.
 */
const ITEM_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;

function cleanItemNames(names: string[]): string[] {
  const cleaned: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const name = raw.trim();
    if (name.length === 0 || seen.has(name)) continue;
    if (!ITEM_NAME_PATTERN.test(name)) {
      throw new Error(
        `Invalid registry item name: "${name}". Names are slugs like "button" or "data-table".`,
      );
    }
    seen.add(name);
    cleaned.push(name);
  }
  if (cleaned.length === 0) {
    throw new Error("Provide at least one component or block name.");
  }
  return cleaned;
}

function requireProjectRoot(cwd: string | undefined): ProjectRoot {
  const start = cwd ?? process.cwd();
  const root = findProjectRoot(start);
  if (!root) {
    throw new Error(
      `Not inside a project: no cooud-ui.json or package.json found walking up from ${resolve(start)}. ` +
        "Start the MCP server inside the consumer project (its package.json directory), " +
        "and run `npx cooud-ui init` there once to create cooud-ui.json.",
    );
  }
  return root;
}

/** Input accepted by the `install_component` tool. */
export interface InstallComponentInput {
  names: string[];
  overwrite?: boolean;
  /** Write the files but skip the package-manager install of npm deps. */
  skipInstall?: boolean;
}

/** Structured result returned by the `install_component` tool. */
export interface InstallComponentResult extends ParsedAddOutput {
  status: RunStatus;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Install registry items into the consumer project by running the pinned
 * `cooud-ui add` CLI at the detected project root.
 */
export async function installComponent(
  input: InstallComponentInput,
  options: CliRunOptions = {},
): Promise<InstallComponentResult> {
  const names = cleanItemNames(input.names);
  const root = requireProjectRoot(options.cwd);
  const env = options.env ?? process.env;

  const args = ["add", ...names];
  if (input.overwrite) args.push("--overwrite");
  if (input.skipInstall) args.push("--skip-install");
  // Keep the CLI on the same registry the read tools describe when the server
  // was started with a registry override.
  const registry = env.COOUD_UI_REGISTRY?.trim();
  if (registry) args.push("--registry", registry);

  const run = await runCli(args, { ...options, cwd: root.dir, env });
  return {
    status: classify(run),
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    ...parseAddOutput(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

/** Input accepted by the `apply_theme` tool. */
export interface ApplyThemeInput {
  source: string;
  dryRun?: boolean;
}

/** Structured result returned by the `apply_theme` tool. */
export interface ApplyThemeResult extends ParsedThemeOutput {
  status: RunStatus;
  dryRun: boolean;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Apply a Create Studio theme to the consumer project by running the pinned
 * `cooud-ui theme add` CLI at the detected project root.
 */
export async function applyTheme(
  input: ApplyThemeInput,
  options: CliRunOptions = {},
): Promise<ApplyThemeResult> {
  const source = input.source.trim();
  if (source.length === 0) {
    throw new Error("Provide a theme source: a Create Studio permalink or a theme JSON file path.");
  }
  if (source.startsWith("-")) {
    throw new Error(`Invalid theme source: "${source}" (must not look like a CLI flag).`);
  }
  const root = requireProjectRoot(options.cwd);
  const dryRun = input.dryRun === true;

  const args = ["theme", "add", source];
  if (dryRun) args.push("--dry-run");

  const run = await runCli(args, { ...options, cwd: root.dir });
  return {
    status: classify(run),
    dryRun,
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    ...parseThemeOutput(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}
