/**
 * Kickoff artifacts for a resolved Cooud stack.
 *
 * Turns a {@link StackConfig} into the three things a user leaves the builder
 * with:
 *  - `generateCommand`   → the `bun create cooud-stack@latest …` shell command.
 *  - `generateKickoff`   → a KICKOFF.md briefing (the resolved stack is the
 *                          single source of truth) for the coding agent.
 *  - `generateStackJson` → a machine-readable snapshot of the stack.
 *
 * SECURITY: the project name is the only user-controlled free text that reaches
 * a shell command. {@link sanitizeProjectName} reduces it to a strict
 * `[a-z0-9-]` slug so it can never break out of the argument or inject flags.
 */

import { catalog as defaultCatalog } from "./catalog";
import type { Catalog, Category, Option, StackConfig } from "./types";

// --------------------------------------------------------------------------
// Project-name hardening
// --------------------------------------------------------------------------

/**
 * Reduce an arbitrary string to a safe project slug: lowercase, ASCII
 * `[a-z0-9-]` only, no leading/trailing/duplicate dashes, capped length. Any
 * shell metacharacters, spaces, quotes, slashes, `..`, or flags collapse away.
 * Falls back to "my-cooud-app" when nothing usable remains.
 */
export function sanitizeProjectName(raw: string): string {
  const slug = (raw ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // any non-alnum run -> single dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .slice(0, 64)
    .replace(/-+$/g, ""); // re-trim after slice
  return slug.length > 0 ? slug : "my-cooud-app";
}

// --------------------------------------------------------------------------
// Catalog/selection lookup helpers
// --------------------------------------------------------------------------

function indexCatalog(catalog: Catalog) {
  const catById = new Map<string, Category>();
  const optById = new Map<string, Option>();
  for (const cat of catalog) {
    catById.set(cat.id, cat);
    for (const opt of cat.options) optById.set(opt.id, opt);
  }
  return { catById, optById };
}

function singleId(config: StackConfig, catId: string): string | undefined {
  const v = config[catId];
  return typeof v === "string" ? v : undefined;
}

function multiIds(config: StackConfig, catId: string): string[] {
  const v = config[catId];
  return Array.isArray(v) ? v : [];
}

function toggleOn(config: StackConfig, catId: string): boolean {
  return config[catId] === true;
}

/** Map an option id to the short CLI flag value (strips the category prefix). */
function flagValue(optionId: string): string {
  const dash = optionId.indexOf("-");
  return dash === -1 ? optionId : optionId.slice(dash + 1);
}

function optName(optById: Map<string, Option>, id: string): string {
  return optById.get(id)?.name ?? id;
}

// --------------------------------------------------------------------------
// CLI command
// --------------------------------------------------------------------------

/**
 * The categories emitted as `--flag value` pairs, in stable order. Toggles map
 * to presence/absence flags; multis to comma-separated lists.
 */
const CLI_FLAGS: { catId: string; flag: string; kind: "single" | "multi" }[] = [
  { catId: "web", flag: "web", kind: "single" },
  { catId: "backend", flag: "backend", kind: "single" },
  { catId: "runtime", flag: "runtime", kind: "single" },
  { catId: "api", flag: "api", kind: "single" },
  { catId: "database", flag: "database", kind: "single" },
  { catId: "orm", flag: "orm", kind: "single" },
  { catId: "dbSetup", flag: "db-setup", kind: "single" },
  { catId: "auth", flag: "auth", kind: "single" },
  { catId: "payments", flag: "payments", kind: "single" },
  { catId: "ui", flag: "ui", kind: "single" },
  { catId: "assistants", flag: "ai", kind: "multi" },
  { catId: "mcp", flag: "mcp", kind: "multi" },
  { catId: "skills", flag: "skills", kind: "multi" },
  { catId: "deploy", flag: "deploy", kind: "single" },
  { catId: "packageManager", flag: "package-manager", kind: "single" },
  { catId: "addons", flag: "addons", kind: "multi" },
];

/**
 * Build the scaffolding command. One flag per selected category (multi → CSV).
 * The project name is sanitized to a safe slug. Output is a single string with
 * line continuations for readability.
 */
export function generateCommand(config: StackConfig, projectName = "my-cooud-app"): string {
  const slug = sanitizeProjectName(projectName);
  const parts: string[] = [`bun create cooud-stack@latest ${slug} --yes`];

  for (const { catId, flag, kind } of CLI_FLAGS) {
    if (kind === "single") {
      const id = singleId(config, catId);
      if (id) parts.push(`--${flag} ${flagValue(id)}`);
    } else {
      const ids = multiIds(config, catId);
      if (ids.length > 0) parts.push(`--${flag} ${ids.map(flagValue).join(",")}`);
    }
  }

  // Boolean toggles -> explicit on/off flags so the command is unambiguous.
  if (config.vibe === true) parts.push("--vibe");
  parts.push(toggleOn(config, "git") ? "--git" : "--no-git");
  parts.push(toggleOn(config, "install") ? "--install" : "--no-install");

  return parts.join(" \\\n  ");
}

// --------------------------------------------------------------------------
// stack.json
// --------------------------------------------------------------------------

/** A machine-readable snapshot of the resolved stack. */
export function generateStackJson(config: StackConfig, projectName = "my-cooud-app"): string {
  const snapshot = {
    $schema: "https://cooud.dev/schema/stack-1.json",
    version: 1,
    name: sanitizeProjectName(projectName),
    generator: "cooud-stack-builder",
    stack: config,
  };
  return JSON.stringify(snapshot, null, 2);
}

// --------------------------------------------------------------------------
// KICKOFF.md
// --------------------------------------------------------------------------

function selectedSingleName(
  config: StackConfig,
  optById: Map<string, Option>,
  catId: string,
): string | undefined {
  const id = singleId(config, catId);
  if (!id) return undefined;
  // Hide the empty "None" choices from the prose.
  if (id.endsWith("-none")) return undefined;
  return optName(optById, id);
}

/**
 * Render the KICKOFF.md briefing. The resolved stack is the SINGLE SOURCE OF
 * TRUTH: mission, repo map, commands, configured AI capabilities, the Cooud UI
 * contract (only when UI = Cooud UI), guardrails, and a Definition of Done.
 */
export function generateKickoff(
  config: StackConfig,
  projectName = "my-cooud-app",
  catalog: Catalog = defaultCatalog,
): string {
  const { optById } = indexCatalog(catalog);
  const slug = sanitizeProjectName(projectName);

  const web = selectedSingleName(config, optById, "web");
  const backend = selectedSingleName(config, optById, "backend");
  const runtime = selectedSingleName(config, optById, "runtime");
  const api = selectedSingleName(config, optById, "api");
  const database = selectedSingleName(config, optById, "database");
  const orm = selectedSingleName(config, optById, "orm");
  const dbSetup = selectedSingleName(config, optById, "dbSetup");
  const auth = selectedSingleName(config, optById, "auth");
  const payments = selectedSingleName(config, optById, "payments");
  const ui = singleId(config, "ui");
  const uiName = ui ? optName(optById, ui) : undefined;
  const deploy = selectedSingleName(config, optById, "deploy");
  const pm = singleId(config, "packageManager");
  const pmName = pm ? optName(optById, pm) : "bun";
  const pmBin = pm ? flagValue(pm) : "bun";

  const assistants = multiIds(config, "assistants").map((id) => optName(optById, id));
  const mcp = multiIds(config, "mcp").map((id) => optName(optById, id));
  const skills = multiIds(config, "skills").map((id) => optName(optById, id));
  const addons = multiIds(config, "addons").map((id) => optName(optById, id));
  const vibe = config.vibe === true;
  const isCooudUi = ui === "ui-cooud";

  const stackRows: [string, string | undefined][] = [
    ["Web", web],
    ["Backend", backend],
    ["Runtime", runtime],
    ["API", api],
    ["Database", database],
    ["ORM", orm],
    ["DB Setup", dbSetup],
    ["Auth", auth],
    ["Payments", payments],
    ["UI", uiName],
    ["Deploy", deploy],
    ["Package Manager", pmName],
  ];

  const lines: string[] = [];
  lines.push(`# KICKOFF — ${slug}`);
  lines.push("");
  lines.push(
    "> Generated by the Cooud Stack Builder (BETA). This file is the **single source of truth** for the project's stack and mission. Read it fully before writing any code.",
  );
  lines.push("");

  // --- Mission ---
  lines.push("## Mission");
  lines.push("");
  lines.push(
    `Build **${slug}** on the stack below. Keep choices consistent with this stack — do not introduce frameworks, databases, or tools not listed here without explicit approval.`,
  );
  lines.push("");

  // --- Resolved stack ---
  lines.push("## Stack (resolved — the truth)");
  lines.push("");
  lines.push("| Layer | Choice |");
  lines.push("| --- | --- |");
  for (const [label, value] of stackRows) {
    if (value) lines.push(`| ${label} | ${value} |`);
  }
  lines.push("");

  // --- Repo map ---
  lines.push("## Repo map");
  lines.push("");
  lines.push("```");
  lines.push(`${slug}/`);
  if (web) lines.push("  apps/web/        # frontend application");
  if (backend && !backend.startsWith("Fullstack"))
    lines.push("  apps/server/     # backend service");
  if (database) lines.push("  packages/db/     # schema, migrations, client");
  if (api) lines.push("  packages/api/    # typed API contract");
  lines.push("  KICKOFF.md       # this briefing");
  lines.push("  stack.json       # machine-readable stack snapshot");
  lines.push("```");
  lines.push("");

  // --- Commands ---
  lines.push("## Commands");
  lines.push("");
  lines.push("```bash");
  lines.push(`${pmBin} install`);
  lines.push(`${pmBin === "npm" ? "npm run dev" : `${pmBin} dev`}`);
  if (database)
    lines.push(`${pmBin === "npm" ? "npm run db:push" : `${pmBin} db:push`}   # sync schema`);
  lines.push(`${pmBin === "npm" ? "npm test" : `${pmBin} test`}`);
  lines.push("```");
  lines.push("");

  // --- AI capabilities ---
  lines.push("## AI capabilities configured");
  lines.push("");
  lines.push(`- **Assistants:** ${assistants.length ? assistants.join(", ") : "none"}`);
  lines.push(`- **MCP servers:** ${mcp.length ? mcp.join(", ") : "none"}`);
  lines.push(`- **Skills:** ${skills.length ? skills.join(", ") : "none"}`);
  if (vibe) {
    lines.push(
      "- **Vibe Mode: ON** — looser guardrails for fast prototyping. Prefer momentum over ceremony, but never skip the security/DoD checks below.",
    );
  }
  lines.push("");

  // --- Cooud UI contract (only when relevant) ---
  if (isCooudUi) {
    lines.push("## Cooud UI contract");
    lines.push("");
    lines.push("This project uses **Cooud UI**. Treat these as hard rules:");
    lines.push("");
    lines.push(
      "- Use **only** components from `@cooud/ui` — never hand-roll a primitive that already exists.",
    );
    lines.push(
      "- Use **only** semantic design-system tokens (e.g. `bg-surface-raised`, `text-fg`, `border-border`). Never hardcode hex/rgb colors or raw Tailwind palette classes.",
    );
    lines.push("- Compose class names with `cn` from `@cooud/ui`.");
    lines.push('- Add `"use client"` to any component that holds state or effects.');
    lines.push(
      "- Every interactive element must have a visible `focus-visible` ring and pass the axe a11y gate.",
    );
    lines.push("- Tag composite elements with `data-slot` for styling hooks.");
    if (mcp.includes("cooud-ui")) {
      lines.push(
        "- The **cooud-ui MCP server** is available — query it for component APIs and tokens instead of guessing.",
      );
    }
    lines.push("");
  }

  // --- Addons ---
  if (addons.length > 0) {
    lines.push("## Addons");
    lines.push("");
    for (const a of addons) lines.push(`- ${a}`);
    lines.push("");
  }

  // --- Guardrails ---
  lines.push("## Guardrails");
  lines.push("");
  lines.push("- Stay on the stack above; ask before adding new top-level dependencies.");
  lines.push("- No secrets in the repo — use `.env` and document required vars in `.env.example`.");
  lines.push("- Keep changes typed; do not introduce `any` or suppress type errors to ship.");
  if (auth)
    lines.push(`- Auth is **${auth}** — protect every mutation/route that needs a signed-in user.`);
  if (payments)
    lines.push(
      `- Payments via **${payments}** — verify webhooks and never trust client-side amounts.`,
    );
  lines.push("");

  // --- Definition of Done ---
  lines.push("## Definition of Done");
  lines.push("");
  lines.push("- [ ] Type checks pass (no errors, no new `any`).");
  lines.push("- [ ] Lint/format pass.");
  lines.push("- [ ] Tests pass (and new behavior is covered).");
  if (isCooudUi)
    lines.push("- [ ] UI uses only `@cooud/ui` + semantic tokens; axe a11y gate is green.");
  lines.push("- [ ] App runs locally end-to-end against the configured stack.");
  if (deploy) lines.push(`- [ ] Deploy config for **${deploy}** is present and documented.`);
  lines.push("");

  return lines.join("\n");
}
