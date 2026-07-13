import { describe, expect, it } from "vitest";
import { blockRefParts, ManifestError, parseManifest, SUPPORTED_PLAN_VERSION } from "./manifest.js";

/** A minimal but structurally valid manifest, spread + tweaked per test. */
function validRaw(): Record<string, unknown> {
  return {
    name: "demo",
    type: "registry:app",
    planVersion: 1,
    manifest: {
      title: "Demo",
      description: "",
      chrome: { site: { navbar: "navbar", footer: "footer" }, bare: {} },
      pages: [{ route: "/", title: "Home", nav: "Home", chrome: "site", blocks: ["hero"] }],
    },
  };
}

describe("parseManifest — happy path", () => {
  it("accepts a valid manifest and returns the typed shape", () => {
    const m = parseManifest(validRaw());
    expect(m.name).toBe("demo");
    expect(m.planVersion).toBe(SUPPORTED_PLAN_VERSION);
    expect(m.manifest.pages[0]?.route).toBe("/");
  });

  it("accepts { block, variant } refs and extras/defaults", () => {
    const raw = validRaw();
    (raw.manifest as { pages: { blocks: unknown[] }[] }).pages[0]!.blocks = [
      "hero",
      { block: "login", variant: "split" },
    ];
    (raw.manifest as Record<string, unknown>).extras = { "not-found": "not-found" };
    (raw.manifest as Record<string, unknown>).defaults = { brand: "__APP_NAME__" };
    const m = parseManifest(raw);
    expect(m.manifest.pages[0]?.blocks[1]).toEqual({ block: "login", variant: "split" });
  });
});

describe("parseManifest — strict rejection (D3 graft)", () => {
  it("rejects an unknown planVersion", () => {
    const raw = { ...validRaw(), planVersion: 2 };
    expect(() => parseManifest(raw)).toThrow(ManifestError);
    try {
      parseManifest(raw);
    } catch (err) {
      expect((err as ManifestError).errors.join("\n")).toMatch(/planVersion/);
    }
  });

  it("rejects an unknown top-level field", () => {
    const raw = { ...validRaw(), bogus: 1 };
    try {
      parseManifest(raw);
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as ManifestError).errors.some((e) => /unknown field "bogus"/.test(e))).toBe(true);
    }
  });

  it("rejects unknown fields inside a page", () => {
    const raw = validRaw();
    (raw.manifest as { pages: Record<string, unknown>[] }).pages[0]!.layout = "x";
    try {
      parseManifest(raw);
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as ManifestError).errors.some((e) => /unknown field "layout"/.test(e))).toBe(
        true,
      );
    }
  });

  it("AGGREGATES all structural errors (never bails on the first)", () => {
    const raw = {
      name: "",
      type: "wrong",
      planVersion: 9,
      manifest: { title: "", description: 1, chrome: {}, pages: [] },
    };
    try {
      parseManifest(raw);
      throw new Error("should have thrown");
    } catch (err) {
      const errors = (err as ManifestError).errors;
      // name, type, planVersion, title, description, pages — all reported together.
      expect(errors.length).toBeGreaterThanOrEqual(5);
      expect(errors.join("\n")).toMatch(/"name"/);
      expect(errors.join("\n")).toMatch(/"type"/);
      expect(errors.join("\n")).toMatch(/planVersion/);
      expect(errors.join("\n")).toMatch(/pages/);
    }
  });

  it("rejects a non-object manifest", () => {
    expect(() => parseManifest(null)).toThrow(ManifestError);
    expect(() => parseManifest([])).toThrow(ManifestError);
    expect(() => parseManifest("nope")).toThrow(ManifestError);
  });
});

describe("blockRefParts", () => {
  it("normalizes string and object refs", () => {
    expect(blockRefParts("hero")).toEqual({ slug: "hero" });
    expect(blockRefParts({ block: "login" })).toEqual({ slug: "login" });
    expect(blockRefParts({ block: "login", variant: "split" })).toEqual({
      slug: "login",
      variant: "split",
    });
  });
});
