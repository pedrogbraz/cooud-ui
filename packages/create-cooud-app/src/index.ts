#!/usr/bin/env node
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { runInstall, scaffold } from "./scaffold.js";
import {
  c,
  dirNameFromProjectName,
  isValidProjectName,
  log,
  PACKAGE_MANAGERS,
  type PackageManager,
} from "./utils.js";
import { CREATE_VERSION } from "./version.js";

const HELP = `${c.bold("create-cooud-app")} — scaffold a Next.js + Cooud UI app.

${c.bold("Usage")}
  create-cooud-app [project-name] [options]

${c.bold("Options")}
  --pm <bun|npm|pnpm|yarn>   Package manager to install with (auto-detected otherwise)
  --no-install               Skip installing dependencies
  -h, --help                 Show this help
  -v, --version              Show the version

${c.bold("Examples")}
  npx create-cooud-app my-app
  npx create-cooud-app my-dashboard --pm pnpm
  npx create-cooud-app my-app --no-install
`;

interface ParsedCli {
  /** Project name from positional arg, or undefined to prompt. */
  name?: string;
  pm?: PackageManager;
  install: boolean;
}

/**
 * Parse argv into options. Throws a friendly Error on bad input (unknown flag,
 * invalid `--pm`) so the caller can print and exit non-zero.
 */
export function parseCli(argv: string[]): ParsedCli {
  // `node:util` parseArgs has no built-in `--no-foo` negation, so we declare an
  // explicit `no-install` flag rather than rely on a `--no-install` convention.
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      pm: { type: "string" },
      "no-install": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  if (values.help) return { install: true, name: "--help" };
  if (values.version) return { install: true, name: "--version" };

  const pm = values.pm;
  if (pm !== undefined && !PACKAGE_MANAGERS.includes(pm as PackageManager)) {
    throw new Error(`Unknown --pm "${pm}". Use one of: ${PACKAGE_MANAGERS.join(", ")}.`);
  }

  return {
    name: positionals[0],
    pm: pm as PackageManager | undefined,
    install: !values["no-install"],
  };
}

/** Prompt for a project name on the TTY; falls back to the default when piped. */
async function promptName(defaultName: string): Promise<string> {
  if (!process.stdin.isTTY) return defaultName;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (
      await rl.question(`${c.bold("Project name")} ${c.dim(`(${defaultName})`)} `)
    ).trim();
    return answer || defaultName;
  } finally {
    rl.close();
  }
}

/** Detect a package manager from the npm user-agent (set when run via npx/pnpm dlx). */
function detectPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("bun")) return "bun";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  return "npm";
}

async function main(): Promise<void> {
  const parsed = parseCli(process.argv.slice(2));

  if (parsed.name === "--help") {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (parsed.name === "--version") {
    process.stdout.write(`${CREATE_VERSION}\n`);
    return;
  }

  log.intro();

  const name = parsed.name ?? (await promptName("my-cooud-app"));

  if (!isValidProjectName(name)) {
    log.error(
      `"${name}" is not a valid package name. Use lowercase letters, digits, "-", "_", "." ` +
        `(optionally scoped, e.g. @scope/name).`,
    );
    process.exitCode = 1;
    return;
  }

  const dirName = dirNameFromProjectName(name);
  const targetDir = join(process.cwd(), dirName);
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    log.error(`Directory "${dirName}" already exists and is not empty.`);
    process.exitCode = 1;
    return;
  }

  log.step(`Scaffolding into ${c.cyan(dirName)}…`);
  const { fileCount } = scaffold({ targetDir, name });
  log.ok(`Created ${fileCount} files.`);

  const pm = parsed.pm ?? detectPackageManager();

  if (parsed.install) {
    log.step(`Installing dependencies with ${c.cyan(pm)}…`);
    try {
      runInstall(pm, targetDir);
      log.ok("Dependencies installed.");
    } catch (err) {
      log.warn(`Install failed (${(err as Error).message}). Install manually later.`);
    }
  }

  log.outro(dirName, pm, parsed.install);
}

/** True when this module is the process entry point (not imported by a test). */
function isEntrypoint(): boolean {
  const entry = argv[1];
  if (!entry) return false;
  return fileURLToPath(import.meta.url) === entry;
}

if (isEntrypoint()) {
  main().catch((err: unknown) => {
    log.error((err as Error).message);
    process.exitCode = 1;
  });
}
