#!/usr/bin/env node
/**
 * release.mjs — LOCAL release pipeline for the Cooud UI monorepo.
 *
 * GitHub Actions was removed (account billing), so releases are cut from a
 * developer machine. This script is the single, channel-agnostic entry point.
 *
 * What it does, in order:
 *   (a) preflight   — assert a clean git working tree and that all four
 *                     publishable packages share the same `version`;
 *   (b) gate        — typecheck · lint · test · registry:check · tokens:check ·
 *                     props:check · build (the same checks the old CI ran);
 *   (c) smoke       — package:smoke (pack --dry-run structure + offline import());
 *   (d) publish     — for each package in dependency order
 *                     tokens → theme → ui → cli:
 *                       1. `bun pm pack` the package (rewrites `workspace:*`
 *                          ranges to the concrete version and embeds each
 *                          package's own `publishConfig`),
 *                       2. `npm publish <tarball>` — npm reads the registry from
 *                          the tarball's embedded `publishConfig`, so scoped libs
 *                          go to their registry and the CLI to its own. The
 *                          pipeline is channel-agnostic: it never hard-codes a
 *                          registry, so the npm-vs-GitHub-Packages decision lives
 *                          entirely in each package.json.
 *   (e) tag         — create and push the annotated git tag `v<version>`.
 *
 * SAFETY: dry-run by DEFAULT. Without `--publish` it runs (a)-(c), then runs
 * `npm publish --dry-run` for (d) and only PRINTS the tag it would cut for (e).
 * Pass `--publish` to actually publish the tarballs and push the tag.
 *
 * Usage:
 *   node scripts/release.mjs            # dry-run (default) — safe preflight
 *   node scripts/release.mjs --publish  # really publish + tag
 *   bun run release [--publish]
 *
 * Offline/auth notes: the scoped libs publish to the registry in their
 * `publishConfig` (reads `${NODE_AUTH_TOKEN}` via the repo-root .npmrc); the CLI
 * publishes to public npm (needs an npm login / `NPM_TOKEN`). `--publish` will
 * fail loudly at the first package whose registry rejects the credentials.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const PUBLISH = process.argv.includes("--publish");

/* ------------------------------------------------------------------ *
 * logging
 * ------------------------------------------------------------------ */
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const log = (...a) => console.log(...a);
const group = (title) => log(`\n${c.bold(c.cyan(`▶ ${title}`))}`);
const ok = (msg) => log(`  ${c.green("✓")} ${msg}`);
const info = (msg) => log(`  ${c.dim("·")} ${c.dim(msg)}`);
const plan = (msg) => log(`  ${c.yellow("◦")} ${c.yellow(msg)}`);

function fatal(msg, err) {
  log(`\n${c.red(c.bold("RELEASE ABORTED:"))} ${msg}`);
  if (err) {
    const detail = String(err.stderr || err.stdout || err.message || err).trim();
    if (detail) log(c.red(detail));
  }
  process.exit(1);
}

/**
 * Run a command, streaming its output to the terminal (inherit). Throws on a
 * non-zero exit so callers can fail the release.
 */
function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: opts.cwd || ROOT,
    stdio: opts.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
    env: { ...process.env, ...(opts.env || {}) },
    maxBuffer: 64 * 1024 * 1024,
  });
}

/* ------------------------------------------------------------------ *
 * package matrix — dependency order: tokens → theme → ui → cli
 * ------------------------------------------------------------------ */
const PACKAGES = [
  { dir: "packages/tokens", name: "@cooud/tokens" },
  { dir: "packages/theme", name: "@cooud/theme" },
  { dir: "packages/ui", name: "@cooud/ui" },
  { dir: "packages/cli", name: "cooud-ui" },
];

/* ------------------------------------------------------------------ *
 * (a) preflight — clean tree + lockstep versions
 * ------------------------------------------------------------------ */
function readPkg(dir) {
  return JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8"));
}

function preflight() {
  group("preflight");

  // Clean working tree (tracked + untracked). A release must be reproducible
  // from the committed state, and we are about to cut a tag from HEAD.
  let status;
  try {
    status = run("git", ["status", "--porcelain"], { capture: true });
  } catch (err) {
    fatal("could not read git status (is this a git repo?)", err);
  }
  if (status.trim()) {
    log(c.red("  working tree is not clean:"));
    for (const line of status.trim().split("\n")) log(c.red(`    ${line}`));
    fatal("commit, stash, or clean the working tree before releasing.");
  }
  ok("git working tree is clean");

  // All four publishable packages must share one version (lockstep 0.x).
  const versions = PACKAGES.map((p) => ({ name: p.name, version: readPkg(p.dir).version }));
  const distinct = [...new Set(versions.map((v) => v.version))];
  if (distinct.length !== 1) {
    log(c.red("  package versions are not in lockstep:"));
    for (const v of versions) log(c.red(`    ${v.name} @ ${v.version}`));
    fatal("bump every publishable package to the SAME version before releasing.");
  }
  const version = distinct[0];
  if (!version) fatal("could not read a version from the packages.");
  ok(`all four packages are at version ${c.bold(version)}`);

  // Don't clobber an existing release tag.
  const tag = `v${version}`;
  let tagExists = false;
  try {
    run("git", ["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`], { capture: true });
    tagExists = true;
  } catch {
    tagExists = false;
  }
  if (tagExists) {
    fatal(`git tag ${tag} already exists — bump the version or delete the stale tag first.`);
  }
  ok(`tag ${c.bold(tag)} is free`);

  return { version, tag };
}

/* ------------------------------------------------------------------ *
 * (b) gate + (c) smoke — the same checks the old CI ran, run locally
 * ------------------------------------------------------------------ */
function gate() {
  group("gate (typecheck · lint · test · registry:check · tokens:check · props:check · build)");
  // Order matters: cheap static checks first, build last (smoke needs dist).
  const steps = [
    "typecheck",
    "lint",
    "test",
    "registry:check",
    "tokens:check",
    "props:check",
    "build",
  ];
  for (const step of steps) {
    info(`bun run ${step}`);
    try {
      run("bun", ["run", step]);
    } catch (err) {
      fatal(`gate step "${step}" failed.`, err);
    }
    ok(`${step} passed`);
  }
}

function smoke() {
  group("package:smoke");
  info("bun run package:smoke");
  try {
    run("bun", ["run", "package:smoke"]);
  } catch (err) {
    fatal("package:smoke failed.", err);
  }
  ok("package smoke passed");
}

/* ------------------------------------------------------------------ *
 * (d) publish — bun pm pack (rewrites workspace:*) + npm publish <tarball>
 * ------------------------------------------------------------------ *
 * npm/npm pack ships `workspace:*` ranges LITERALLY in this Bun monorepo (which
 * is unresolvable for consumers), so we always pack with `bun pm pack` first —
 * it rewrites `workspace:*` to the concrete version AND keeps each package's
 * `publishConfig`. `npm publish <tarball>` then reads the registry straight from
 * the tarball's embedded publishConfig, so the pipeline never hard-codes a
 * channel and the npm-vs-GitHub-Packages decision stays in each package.json.
 *
 * Tarball-naming footgun: `@cooud/ui` and the CLI `cooud-ui` BOTH pack to
 * `cooud-ui-<version>.tgz`. We pack each package into its OWN subdir so the CLI
 * tarball can't overwrite (and be confused with) the @cooud/ui one.
 */
function packTarball(absDir, destDir) {
  run("mkdir", ["-p", destDir]);
  const before = new Set(readdirSync(destDir).filter((f) => f.endsWith(".tgz")));
  run("bun", ["pm", "pack", "--destination", destDir], { cwd: absDir, capture: true });
  const created = readdirSync(destDir)
    .filter((f) => f.endsWith(".tgz") && !before.has(f))
    .map((f) => join(destDir, f));
  if (created.length !== 1) {
    throw new Error(
      `expected \`bun pm pack\` to create exactly one tarball in ${destDir}, found ${created.length}`,
    );
  }
  return created[0];
}

function publishAll(version) {
  group(
    PUBLISH ? "publish (tokens → theme → ui → cli)" : "publish — DRY-RUN (no packages published)",
  );

  // Pack into a temp dir so workspace:* gets rewritten before we ever publish.
  const destDir = join(ROOT, ".release-tarballs");
  // Clean any leftovers from a prior aborted run.
  run("rm", ["-rf", destDir]);
  run("mkdir", ["-p", destDir]);

  const published = [];
  try {
    for (const pkg of PACKAGES) {
      const absDir = join(ROOT, pkg.dir);
      const pj = readPkg(pkg.dir);
      const registry = pj.publishConfig?.registry || "https://registry.npmjs.org (npm default)";

      // Per-package subdir: @cooud/ui and the CLI cooud-ui share a tarball name,
      // so isolate each so one can't clobber the other.
      const pkgDest = join(destDir, pkg.dir.replace(/^packages\//, ""));
      let tarball;
      try {
        tarball = packTarball(absDir, pkgDest);
      } catch (err) {
        fatal(`could not pack ${pkg.name}.`, err);
      }
      const tarballName = tarball.replace(/^.*\//, "");

      const publishArgs = ["publish", tarball];
      if (!PUBLISH) publishArgs.push("--dry-run");

      if (PUBLISH) {
        info(`npm publish ${tarballName}  →  ${registry}`);
        try {
          run("npm", publishArgs, { cwd: ROOT });
        } catch (err) {
          fatal(
            `npm publish failed for ${pkg.name} (${registry}). ` +
              `Earlier packages in the order may already be published.`,
            err,
          );
        }
        ok(`published ${pkg.name}@${version}  →  ${registry}`);
      } else {
        plan(`would publish ${c.bold(`${pkg.name}@${version}`)}  →  ${registry}`);
        info(`(npm publish ${tarballName} --dry-run)`);
        try {
          // A dry-run still validates the tarball + registry resolution offline-ish.
          run("npm", publishArgs, { cwd: ROOT, capture: true });
        } catch (err) {
          // Don't abort the dry-run on auth/login failures (expected without a
          // token) — surface them as a note so the plan still prints.
          const detail = String(err.stderr || err.stdout || err.message || "").trim();
          info(`dry-run note for ${pkg.name}: ${detail.split("\n")[0] || "see npm output"}`);
        }
      }
      published.push({ name: pkg.name, registry, tarball: tarballName });
    }
  } finally {
    if (PUBLISH) run("rm", ["-rf", destDir]);
    else info(`tarballs left in ${destDir.replace(`${ROOT}/`, "")}/ for inspection (dry-run)`);
  }

  return published;
}

/* ------------------------------------------------------------------ *
 * (e) tag — annotated v<version>, pushed to origin
 * ------------------------------------------------------------------ */
function tagAndPush(tag) {
  group(PUBLISH ? "tag" : "tag — DRY-RUN (no tag created or pushed)");
  if (!PUBLISH) {
    plan(`would create annotated tag ${c.bold(tag)} at HEAD and push it to origin`);
    info(`(git tag -a ${tag} -m "${tag}"  &&  git push origin ${tag})`);
    return;
  }
  try {
    run("git", ["tag", "-a", tag, "-m", tag]);
    ok(`created annotated tag ${tag}`);
    run("git", ["push", "origin", tag]);
    ok(`pushed ${tag} to origin`);
  } catch (err) {
    fatal(
      `tagging/pushing ${tag} failed. The packages were already published — ` +
        `create and push the tag manually: git tag -a ${tag} -m ${tag} && git push origin ${tag}`,
      err,
    );
  }
}

/* ------------------------------------------------------------------ *
 * summary
 * ------------------------------------------------------------------ */
function summary({ version, tag, published }) {
  log(`\n${c.bold(c.cyan("━━━ release summary ━━━"))}`);
  log(`  mode:    ${PUBLISH ? c.green(c.bold("PUBLISH")) : c.yellow(c.bold("DRY-RUN"))}`);
  log(`  version: ${c.bold(version)}`);
  log(`  tag:     ${tag}${PUBLISH ? "" : c.dim(" (not created)")}`);
  log(`  ${PUBLISH ? "published" : "would publish"} (in order):`);
  for (const p of published) {
    log(`    ${PUBLISH ? c.green("✓") : c.yellow("◦")} ${p.name}@${version}  →  ${p.registry}`);
  }

  log(`\n${c.bold("Post-publish steps this script did NOT do:")}`);
  log(
    `  ${c.dim("·")} Make the GitHub repo ${c.bold("pedrogbraz/cooud-ui")} ${c.bold("public")} so the` +
      ` published CLI's pinned registry`,
  );
  log(
    `    ${c.dim("·")} (raw.githubusercontent.com/pedrogbraz/cooud-ui/${tag}/registry) resolves for` +
      ` \`npx cooud-ui add\`.`,
  );
  log(`  ${c.dim("·")} Create a GitHub Release for ${tag} (notes / assets), if desired.`);
  log(`  ${c.dim("·")} SBOM / build-provenance attestation (was CI-only; CI is removed).`);

  if (!PUBLISH) {
    log(
      `\n${c.yellow(c.bold("This was a DRY-RUN."))} Re-run with ${c.bold("--publish")} to publish + tag.`,
    );
  } else {
    log(`\n${c.green(c.bold(`✓ released ${tag}`))}`);
  }
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */
function main() {
  log(c.bold("\nCooud UI — local release pipeline"));
  log(
    c.dim(
      `mode: ${PUBLISH ? "PUBLISH (will publish tarballs + push tag)" : "DRY-RUN (default; prints the plan only)"}`,
    ),
  );
  log(c.dim(`root: ${ROOT}`));

  if (!existsSync(join(ROOT, "package.json"))) fatal(`no package.json at repo root ${ROOT}`);

  const { version, tag } = preflight();
  gate();
  smoke();
  const published = publishAll(version);
  tagAndPush(tag);
  summary({ version, tag, published });
}

main();
