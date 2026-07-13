/**
 * App-manifest types + a strict, hand-rolled structural parser/validator (no new
 * dep). The parser is deliberately paranoid: manifests arrive from disk (bundled
 * template or `--manifest` file) and drive code generation, so an unknown
 * `planVersion` or any unknown field is a HARD ERROR (D3 graft) rather than a
 * silently-ignored typo. Only structural/shape checks live here — semantic checks
 * that need the registry index/meta (does the block exist? does its kind fit the
 * slot?) live in `plan.ts`.
 */

import { createHash } from "node:crypto";

/** The only plan schema version F1 understands. Unknown values are rejected. */
export const SUPPORTED_PLAN_VERSION = 1;

/** A block reference in a page: a bare slug (default variant) or `{ block, variant }`. */
export type BlockRef = string | { block: string; variant?: string };

/** One route in the app. `nav` presence lists it in the generated navbar/footer. */
export interface Page {
  /** App Router route, e.g. "/", "/products", "/products/[id]". */
  route: string;
  /** <title> metadata for the page. */
  title: string;
  /** Label shown in the nav; omit to keep the page out of the nav. */
  nav?: string;
  /** Which chrome group the page renders under (key of `chrome`). */
  chrome: string;
  /** The blocks stacked (top-to-bottom) inside the page's <main>. */
  blocks: BlockRef[];
}

/** One chrome group → the route group + its layout furniture. F1 supports site/bare. */
export interface ChromeGroup {
  /** Navbar block slug (chrome kind). Omit for a bare/centered group. */
  navbar?: string;
  /** Footer block slug (chrome kind). Omit for a bare/centered group. */
  footer?: string;
  /** App-shell block slug (F2 sidebar shell). Present in the type; unused in F1. */
  block?: string;
}

export type ChromeMap = Record<string, ChromeGroup>;

/** App-level defaults baked into the generated app. */
export interface ManifestDefaults {
  theme?: string;
  mode?: string;
  /** Brand wordmark; `__APP_NAME__` is substituted with the project name. */
  brand?: string;
}

/** The manifest body (everything under the top-level `manifest` key). */
export interface ManifestBody {
  title: string;
  description: string;
  chrome: ChromeMap;
  pages: Page[];
  /** Next special-file blocks by kind, e.g. `{ "not-found": "not-found" }`. */
  extras?: Record<string, string>;
  defaults?: ManifestDefaults;
}

/** A full app-template manifest as stored in `packages/cli/templates/apps/*.json`. */
export interface AppManifest {
  name: string;
  type: "registry:app";
  planVersion: number;
  manifest: ManifestBody;
}

/** Thrown by {@link parseManifest} with EVERY structural problem found, aggregated. */
export class ManifestError extends Error {
  readonly errors: string[];
  constructor(errors: string[]) {
    super(`Invalid app manifest:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
    this.name = "ManifestError";
    this.errors = errors;
  }
}

/** True for a plain (non-array, non-null) object. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Push an "unknown field" error for every key of `obj` not in `allowed`. */
function rejectUnknownKeys(
  obj: Record<string, unknown>,
  allowed: readonly string[],
  where: string,
  errors: string[],
): void {
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key)) {
      errors.push(`${where}: unknown field "${key}" (allowed: ${allowed.join(", ")})`);
    }
  }
}

const MANIFEST_TOP_KEYS = ["name", "type", "planVersion", "manifest"] as const;
const MANIFEST_BODY_KEYS = [
  "title",
  "description",
  "chrome",
  "pages",
  "extras",
  "defaults",
] as const;
const PAGE_KEYS = ["route", "title", "nav", "chrome", "blocks"] as const;
const CHROME_GROUP_KEYS = ["navbar", "footer", "block"] as const;
const DEFAULTS_KEYS = ["theme", "mode", "brand"] as const;
const BLOCKREF_KEYS = ["block", "variant"] as const;

function validateBlockRef(value: unknown, where: string, errors: string[]): void {
  if (typeof value === "string") {
    if (value.length === 0) errors.push(`${where}: block reference is an empty string`);
    return;
  }
  if (!isRecord(value)) {
    errors.push(`${where}: block reference must be a string or { block, variant }`);
    return;
  }
  rejectUnknownKeys(value, BLOCKREF_KEYS, where, errors);
  if (typeof value.block !== "string" || value.block.length === 0) {
    errors.push(`${where}: block reference object needs a non-empty "block" string`);
  }
  if (value.variant !== undefined && typeof value.variant !== "string") {
    errors.push(`${where}: block "variant" must be a string when present`);
  }
}

function validateChromeGroup(value: unknown, where: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${where}: chrome group must be an object`);
    return;
  }
  rejectUnknownKeys(value, CHROME_GROUP_KEYS, where, errors);
  for (const key of ["navbar", "footer", "block"] as const) {
    if (value[key] !== undefined && typeof value[key] !== "string") {
      errors.push(`${where}: "${key}" must be a string when present`);
    }
  }
}

function validatePage(value: unknown, index: number, errors: string[]): void {
  const where = `pages[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${where}: page must be an object`);
    return;
  }
  rejectUnknownKeys(value, PAGE_KEYS, where, errors);
  if (typeof value.route !== "string" || value.route.length === 0) {
    errors.push(`${where}: "route" must be a non-empty string`);
  }
  if (typeof value.title !== "string" || value.title.length === 0) {
    errors.push(`${where}: "title" must be a non-empty string`);
  }
  if (value.nav !== undefined && (typeof value.nav !== "string" || value.nav.length === 0)) {
    errors.push(`${where}: "nav" must be a non-empty string when present`);
  }
  if (typeof value.chrome !== "string" || value.chrome.length === 0) {
    errors.push(`${where}: "chrome" must be a non-empty string`);
  }
  if (!Array.isArray(value.blocks) || value.blocks.length === 0) {
    errors.push(`${where}: "blocks" must be a non-empty array`);
  } else {
    value.blocks.forEach((b, i) => {
      validateBlockRef(b, `${where}.blocks[${i}]`, errors);
    });
  }
}

function validateBody(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`"manifest" must be an object`);
    return;
  }
  rejectUnknownKeys(value, MANIFEST_BODY_KEYS, "manifest", errors);

  if (typeof value.title !== "string" || value.title.length === 0) {
    errors.push(`manifest.title must be a non-empty string`);
  }
  if (typeof value.description !== "string") {
    errors.push(`manifest.description must be a string`);
  }

  if (!isRecord(value.chrome)) {
    errors.push(`manifest.chrome must be an object`);
  } else {
    for (const [key, group] of Object.entries(value.chrome)) {
      validateChromeGroup(group, `manifest.chrome.${key}`, errors);
    }
  }

  if (!Array.isArray(value.pages) || value.pages.length === 0) {
    errors.push(`manifest.pages must be a non-empty array`);
  } else {
    value.pages.forEach((p, i) => {
      validatePage(p, i, errors);
    });
  }

  if (value.extras !== undefined) {
    if (!isRecord(value.extras)) {
      errors.push(`manifest.extras must be an object when present`);
    } else {
      for (const [key, slug] of Object.entries(value.extras)) {
        if (typeof slug !== "string" || slug.length === 0) {
          errors.push(`manifest.extras.${key} must be a non-empty string`);
        }
      }
    }
  }

  if (value.defaults !== undefined) {
    if (!isRecord(value.defaults)) {
      errors.push(`manifest.defaults must be an object when present`);
    } else {
      rejectUnknownKeys(value.defaults, DEFAULTS_KEYS, "manifest.defaults", errors);
      for (const key of DEFAULTS_KEYS) {
        if (value.defaults[key] !== undefined && typeof value.defaults[key] !== "string") {
          errors.push(`manifest.defaults.${key} must be a string when present`);
        }
      }
    }
  }
}

/**
 * Parse + strictly validate a raw (JSON-parsed) manifest value into a typed
 * {@link AppManifest}. Aggregates ALL structural problems and throws a single
 * {@link ManifestError} listing them (never on the first). Rejects an unknown
 * `planVersion` and any unknown field at every level (strict D3 graft) so a
 * template typo can never be silently ignored by the generator.
 */
export function parseManifest(raw: unknown): AppManifest {
  const errors: string[] = [];

  if (!isRecord(raw)) {
    throw new ManifestError(["manifest must be a JSON object"]);
  }
  rejectUnknownKeys(raw, MANIFEST_TOP_KEYS, "manifest root", errors);

  if (typeof raw.name !== "string" || raw.name.length === 0) {
    errors.push(`"name" must be a non-empty string`);
  }
  if (raw.type !== "registry:app") {
    errors.push(`"type" must be "registry:app"`);
  }
  if (raw.planVersion !== SUPPORTED_PLAN_VERSION) {
    errors.push(
      `unsupported "planVersion" ${JSON.stringify(raw.planVersion)} — ` +
        `this CLI only understands planVersion ${SUPPORTED_PLAN_VERSION}.`,
    );
  }
  validateBody(raw.manifest, errors);

  if (errors.length > 0) throw new ManifestError(errors);

  // Every branch above is proven; the cast is safe.
  return raw as unknown as AppManifest;
}

/** Normalize a block reference to its `{ slug, variant }` parts (default variant = undefined). */
export function blockRefParts(ref: BlockRef): { slug: string; variant?: string } {
  if (typeof ref === "string") return { slug: ref };
  return ref.variant !== undefined
    ? { slug: ref.block, variant: ref.variant }
    : { slug: ref.block };
}

/** Canonical (sorted-key) JSON of a value — deterministic regardless of key order. */
function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const entries = Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`);
  return `{${entries.join(",")}}`;
}

/**
 * A deterministic content fingerprint of a parsed manifest, used as compose
 * provenance persisted in `composed{}.manifestHash`. Keyed on the manifest's
 * meaningful shape (name + planVersion + body) via canonical sorted-key JSON, so
 * two manifests fingerprint equal iff they describe the same app — independent of
 * source key order or whitespace. Pure (no Date/random) so it stays byte-stable.
 */
export function manifestFingerprint(manifest: AppManifest): string {
  const canonical = canonicalJson({
    name: manifest.name,
    type: manifest.type,
    planVersion: manifest.planVersion,
    manifest: manifest.manifest,
  });
  return createHash("sha256").update(canonical).digest("hex");
}
