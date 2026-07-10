#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { aiAdd } from "./commands/ai.js";
import { diff } from "./commands/diff.js";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";
import { themeSet } from "./commands/theme.js";
import { upgrade } from "./commands/upgrade.js";
import { CLI_VERSION } from "./config.js";

const program = new Command();

program
  .name("cooud-ui")
  .description("Add Cooud UI components to your project, shadcn-style.")
  .version(CLI_VERSION);

program
  .command("init")
  .description("Set up cooud-ui.json, the cn() helper, and base dependencies.")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("-y, --yes", "overwrite an existing cooud-ui.json")
  .option("--skip-install", "do not install base dependencies")
  .action((opts) =>
    init({
      cwd: opts.cwd,
      registry: opts.registry,
      yes: opts.yes,
      skipInstall: opts.skipInstall,
    }),
  );

program
  .command("add")
  .description("Add one or more components (resolves dependencies).")
  .argument("[components...]", "component names")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("-o, --overwrite", "overwrite existing files")
  .option("--skip-install", "do not install npm dependencies")
  .action((components, opts) =>
    add(components, {
      cwd: opts.cwd,
      registry: opts.registry,
      overwrite: opts.overwrite,
      skipInstall: opts.skipInstall,
    }),
  );

program
  .command("list")
  .alias("ls")
  .description("List all components available in the registry.")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .action((opts) => list({ cwd: opts.cwd, registry: opts.registry }));

program
  .command("diff")
  .description(
    "Show which installed components have drifted from the registry (run `cooud-ui upgrade` to merge updates without losing local edits).",
  )
  .argument("[components...]", "component names (default: all)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .action((components, opts) => diff(components, { cwd: opts.cwd, registry: opts.registry }));

program
  .command("upgrade")
  .description("Upgrade installed components to the current release, keeping your local edits.")
  .argument("[components...]", "component names (or use --all)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("-a, --all", "upgrade every component recorded in cooud-ui.json")
  .option("--dry-run", "print the per-file plan (fast-forward / merge / conflict), write nothing")
  .option("-y, --yes", "assume yes: write conflict markers and confirmed overwrites without asking")
  .option(
    "-o, --overwrite",
    "components installed before the manifest existed: replace local files with upstream",
  )
  .addHelpText(
    "after",
    `
How it works:
  Each component's installed release is recorded in cooud-ui.json ("installed").
  upgrade 3-way merges base (that release), local (your file) and upstream (the
  current release) with \`git merge-file --diff3\`, so upstream fixes land WITHOUT
  losing your edits. Clean merges are written; conflicts are written with markers
  only if you confirm (or --yes). Unresolved files get a ready-to-paste coding
  agent prompt in COOUD-UPGRADE.md.

Examples:
  cooud-ui upgrade --all --dry-run    preview the plan for everything installed
  cooud-ui upgrade button card        upgrade two components
  cooud-ui upgrade --all --yes        upgrade all, accept conflict markers`,
  )
  .action((components, opts) =>
    upgrade(components, {
      cwd: opts.cwd,
      registry: opts.registry,
      all: opts.all,
      dryRun: opts.dryRun,
      yes: opts.yes,
      overwrite: opts.overwrite,
    }),
  );

const theme = program.command("theme").description("Manage the app's Cooud UI theme preset.");
theme
  .command("set")
  .description("Switch the theme preset (and optionally the color mode).")
  .argument("<name>", "theme preset (aurora, neutral, midnight, sunset, emerald)")
  .option("-m, --mode <mode>", "color mode (dark or light)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .action((name, opts) => themeSet({ name, mode: opts.mode, cwd: opts.cwd }));

program
  .command("ai")
  .description(
    "Add the AI Kit (AGENTS.md doctrine + Claude Code / Cursor / Copilot / Windsurf / Gemini config).",
  )
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option(
    "-a, --assistants <list>",
    "comma-separated: claude, cursor, copilot, windsurf, gemini (or 'all'/'none')",
  )
  .option(
    "-p, --preset <name>",
    "doctrine preset: standard, fintech, saas, oss, agency, or none",
    "standard",
  )
  .option("-s, --skills <list>", "comma-separated Claude Code skills (or 'all'/'none')")
  .action((opts) =>
    aiAdd({
      cwd: opts.cwd,
      assistants: opts.assistants,
      preset: opts.preset,
      skills: opts.skills,
    }),
  );

program.parseAsync(process.argv);
