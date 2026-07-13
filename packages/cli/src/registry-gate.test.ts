/**
 * Unit tests for the build-registry / check-registry GATE logic — the fail-loud
 * invariants that keep the committed registry + bundled app templates honest.
 *
 * These functions previously had NO direct tests: they were only exercised
 * transitively by running the full `registry:check` against the real 73 blocks,
 * so the NEGATIVE cases (a gate SHOULD throw) were never asserted and a weakened
 * gate could regress silently. This file locks:
 *   - extractExportName: first `export function <Name>`, throws on absence.
 *   - buildMeta invariants: data-slot markers present, brand literal present,
 *     unique exportName across blocks — each THROWS a slug-scoped Error.
 *   - serializeRegistry: deterministic meta emission (no timestamp; byte-stable
 *     across two calls; meta.json emitted only when meta is passed).
 *   - validateAppTemplateRefs: every bundled manifest's block/chrome/extras refs
 *     must resolve against the freshly-built registry.
 *
 * Node-env logic test (imports the scripts directly). Importing check-registry.ts
 * is side-effect-free: its `main()` is guarded by `import.meta.main`.
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  buildItems,
  buildMeta,
  dataSlotMarkers,
  extractExportName,
  loadAppManifests,
  META_FILE,
  type RegistryItem,
  type RegistryMeta,
  readBlockSources,
  serializeRegistry,
} from "../scripts/build-registry.js";
import { validateAppTemplateRefs } from "../scripts/check-registry.js";

// The real generator inputs, built once. Deterministic + fast (already run by
// the `registry:check` gate). Each mutation test clones the source map so no
// per-test edit leaks into another.
let items: RegistryItem[];
let sources: Map<string, string>;
let meta: RegistryMeta;

beforeAll(async () => {
  items = await buildItems();
  sources = await readBlockSources();
  meta = await buildMeta(sources);
});

/** A fresh clone of the real block sources so a per-test mutation is isolated. */
function cloneSources(): Map<string, string> {
  return new Map(sources);
}

describe("extractExportName", () => {
  it("returns the first `export function <Name>` in the source", () => {
    expect(extractExportName("export function HeroBlock() { return null; }", "hero")).toBe(
      "HeroBlock",
    );
  });

  it("derives the real exportName from a shipped block source", () => {
    expect(extractExportName(sources.get("navbar") as string, "navbar")).toBe("NavbarBlock");
  });

  it("throws a slug-scoped Error when the source has no `export function`", () => {
    expect(() => extractExportName("const NotAComponent = 1;", "hero")).toThrowError(
      /block "hero": no `export function <Name>` found/,
    );
  });
});

describe("buildMeta — happy path invariants", () => {
  it("emits a versioned, key-sorted meta with the expected block metadata", () => {
    // registryVersion literal present (not a timestamp), blocks keyed by slug.
    expect(typeof meta.registryVersion).toBe("string");
    expect(meta.registryVersion.length).toBeGreaterThan(0);

    const navbar = meta.blocks.navbar;
    expect(navbar).toBeDefined();
    expect(navbar?.exportName).toBe("NavbarBlock");
    expect(navbar?.kind).toBe("chrome");
    // data-slot markers → recorded slot; brand literal → recorded token literal.
    expect(navbar?.dataSlots).toEqual(["navbar-links"]);
    expect(navbar?.brandTokens).toEqual([{ token: "brand", literal: "Cooud" }]);

    // Block keys are sorted ascending (stable, index-order-independent).
    const keys = Object.keys(meta.blocks);
    expect(keys).toEqual([...keys].sort());
  });

  it("keeps every block exportName unique across blocks", () => {
    const names = Object.values(meta.blocks).map((b) => b.exportName);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("buildMeta — fail-loud invariants (each SHOULD throw)", () => {
  it("throws when a declared data-slot marker is missing from the shipped source", async () => {
    const bad = cloneSources();
    const { close } = dataSlotMarkers("navbar-links");
    // Drop the closing marker so the declared slot can no longer be anchored.
    bad.set("navbar", (bad.get("navbar") as string).replace(close, "/* removed */"));
    await expect(buildMeta(bad)).rejects.toThrowError(
      /block "navbar": declared data-slot "navbar-links" is missing its markers/,
    );
  });

  it("throws when a declared brand-token literal is absent from the shipped source", async () => {
    const bad = cloneSources();
    // Remove the "Cooud" wordmark so the brand substitution has no anchor.
    bad.set("navbar", (bad.get("navbar") as string).replaceAll("Cooud", "Brandless"));
    await expect(buildMeta(bad)).rejects.toThrowError(
      /block "navbar": brand-token literal "Cooud" .* is absent from the shipped source/,
    );
  });

  it("throws when two blocks share an exportName", async () => {
    const bad = cloneSources();
    // Rename footer's export to collide with hero's HeroBlock.
    bad.set(
      "footer",
      (bad.get("footer") as string).replace(
        "export function FooterBlock",
        "export function HeroBlock",
      ),
    );
    await expect(buildMeta(bad)).rejects.toThrowError(/duplicate block exportName "HeroBlock"/);
  });

  it("throws when a block in the index has no shipped source", async () => {
    const bad = cloneSources();
    bad.delete("hero");
    await expect(buildMeta(bad)).rejects.toThrowError(
      /block "hero" is in BLOCK_CATEGORIES but has no BLOCK_MANIFEST source/,
    );
  });
});

describe("serializeRegistry — deterministic meta emission", () => {
  it("is byte-identical across two independent calls (no timestamp / no random)", () => {
    const a = serializeRegistry(items, meta);
    const b = serializeRegistry(items, meta);
    expect(a).toEqual(b);
    // The meta payload itself carries no time-varying field.
    expect(a[META_FILE]).toBe(b[META_FILE]);
    expect(a[META_FILE]).not.toMatch(/\d{4}-\d{2}-\d{2}T/); // no ISO timestamp
  });

  it("emits meta.json only when meta is passed", () => {
    expect(serializeRegistry(items, meta)[META_FILE]).toBeDefined();
    expect(serializeRegistry(items)[META_FILE]).toBeUndefined();
  });

  it("terminates every emitted file with a single trailing newline", () => {
    const out = serializeRegistry(items, meta);
    for (const content of Object.values(out)) {
      expect(content.endsWith("\n")).toBe(true);
      expect(content.endsWith("\n\n")).toBe(false);
    }
  });
});

describe("validateAppTemplateRefs — app-template reference gate", () => {
  // The real, on-disk bundled manifests must be clean.
  it("passes for every shipped templates/apps/*.json", async () => {
    const manifests = await loadAppManifests();
    expect(manifests.length).toBeGreaterThan(0);
    expect(validateAppTemplateRefs(manifests, items, meta, sources)).toEqual([]);
  });

  // A deliberately loose probe shape so a test can mutate any single field to an
  // invalid value (validateAppTemplateRefs accepts `raw: unknown` and validates
  // at runtime, so the static looseness never hides a real check).
  interface ProbePage {
    route: string;
    title: string;
    chrome: string;
    blocks: unknown[];
  }
  interface ProbeManifest {
    file: string;
    name: string;
    raw: {
      name: string;
      type: string;
      planVersion: number;
      manifest: {
        title: string;
        description: string;
        chrome: Record<string, Record<string, string>>;
        pages: ProbePage[];
        extras: Record<string, string>;
        [extra: string]: unknown;
      };
    };
  }

  // Build a minimal valid manifest; each test mutates one field to an invalid value.
  function baseManifest(): ProbeManifest {
    return {
      file: "probe.json",
      name: "probe",
      raw: {
        name: "probe",
        type: "registry:app",
        planVersion: 1,
        manifest: {
          title: "Probe",
          description: "probe",
          chrome: { site: { navbar: "navbar", footer: "footer" }, bare: {} },
          pages: [{ route: "/", title: "Home", chrome: "site", blocks: ["hero"] }],
          extras: { "not-found": "not-found" },
        },
      },
    };
  }

  it("returns [] for a clean synthetic manifest", () => {
    expect(validateAppTemplateRefs([baseManifest()], items, meta, sources)).toEqual([]);
  });

  it("flags an unknown page block (bare slug) with the offending template + slug", () => {
    const m = baseManifest();
    m.raw.manifest.pages = [{ route: "/", title: "Home", chrome: "site", blocks: ["heroo"] }];
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems).toHaveLength(1);
    const [first] = problems;
    expect(first).toContain("templates/apps/probe.json");
    expect(first).toContain('unknown block "heroo"');
  });

  it("flags an unknown page block in { block } object form", () => {
    const m = baseManifest();
    m.raw.manifest.pages = [
      { route: "/", title: "Home", chrome: "site", blocks: [{ block: "heroo" }] },
    ];
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems.some((p) => p.includes('unknown block "heroo"'))).toBe(true);
  });

  it("flags an unknown chrome (navbar) ref", () => {
    const m = baseManifest();
    m.raw.manifest.chrome = { site: { navbar: "navbarr", footer: "footer" }, bare: {} };
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(
      problems.some((p) => p.includes("navbar") && p.includes('unknown block "navbarr"')),
    ).toBe(true);
  });

  it("flags an unknown extras (not-found) ref", () => {
    const m = baseManifest();
    m.raw.manifest.extras["not-found"] = "nott-found";
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(
      problems.some((p) => p.includes("extras") && p.includes('unknown block "nott-found"')),
    ).toBe(true);
  });

  it("flags an extras slug that is not a page-kind block", () => {
    const m = baseManifest();
    m.raw.manifest.extras["not-found"] = "hero"; // hero is a section, not a page
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems.some((p) => p.includes("extras") && p.includes("page-kind block"))).toBe(true);
  });

  it("surfaces a structural manifest error (unknown field) per template", () => {
    const m = baseManifest();
    m.raw.manifest.bogusField = 1;
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems.some((p) => p.includes('unknown field "bogusField"'))).toBe(true);
  });
});
