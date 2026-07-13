import { describe, expect, it } from "vitest";
import {
  fixtureChromeSources,
  fixtureIndex,
  fixtureManifest,
  fixtureMeta,
} from "./compose.fixtures.js";
import type { AppManifest } from "./manifest.js";
import { buildComposePlan, ComposePlanError, validateComposePlan } from "./plan.js";

const index = fixtureIndex();
const meta = fixtureMeta();
const chrome = fixtureChromeSources();

/** Deep-clone the fixture manifest so per-test mutations do not leak. */
function manifest(): AppManifest {
  return structuredClone(fixtureManifest());
}

describe("buildComposePlan — happy path", () => {
  it("resolves pages, chrome, blocks and export names", () => {
    const plan = buildComposePlan(manifest(), { appName: "loja" }, index, meta, chrome);
    expect(plan.templateName).toBe("shop");
    expect(plan.appName).toBe("loja");
    expect(plan.pages.map((p) => p.route)).toEqual(["/", "/login"]);
    expect(plan.pages[0]?.blocks.map((b) => b.exportName)).toEqual([
      "HeroBlock",
      "PricingBlock",
      "CtaBlock",
    ]);
    expect(plan.usesNavbar).toBe(true);
    expect(plan.usesFooter).toBe(true);
    expect(plan.navbarExportName).toBe("NavbarBlock");
    // Only the site group is used by an included page → bare group with no page is
    // NOT emitted, but /login uses bare so it IS present.
    expect(plan.chromes.map((c) => c.group).sort()).toEqual(["bare", "site"]);
  });

  it("resolves brand: explicit > manifest default (__APP_NAME__ filled) > appName", () => {
    expect(
      buildComposePlan(manifest(), { appName: "loja" }, index, meta, chrome).choices.brand,
    ).toBe("loja");
    expect(
      buildComposePlan(manifest(), { appName: "loja", brand: "Minha" }, index, meta, chrome).choices
        .brand,
    ).toBe("Minha");
  });

  it("records normalized choices (sorted variant keys, seed when present)", () => {
    const plan = buildComposePlan(
      manifest(),
      { appName: "loja", seed: 7, variants: { z: "1", a: "2" } },
      index,
      meta,
      chrome,
    );
    expect(Object.keys(plan.choices.variants)).toEqual(["a", "z"]);
    expect(plan.choices.seed).toBe(7);
    expect(plan.choices.pages).toEqual(["/", "/login"]);
  });

  it("supports a --pages subset", () => {
    const plan = buildComposePlan(
      manifest(),
      { appName: "loja", pages: ["/"] },
      index,
      meta,
      chrome,
    );
    expect(plan.pages.map((p) => p.route)).toEqual(["/"]);
    // /login dropped → the bare group is no longer used, only site remains.
    expect(plan.chromes.map((c) => c.group)).toEqual(["site"]);
  });
});

describe("validateComposePlan — semantic aggregation", () => {
  it("aggregates ALL semantic errors before returning", () => {
    const m = manifest();
    m.manifest.pages = [
      // email in a page + chrome in a page + unknown block (typo of login)
      { route: "/", title: "H", chrome: "site", blocks: ["email-welcome", "navbar", "logins"] },
      // duplicate route + undefined chrome group
      { route: "/", title: "Dup", chrome: "nope", blocks: ["hero"] },
      // invalid route
      { route: "/Bad_Route", title: "Bad", chrome: "site", blocks: ["hero"] },
    ];
    const { errors, plan } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(plan).toBeUndefined();
    const joined = errors.join("\n");
    expect(joined).toMatch(/email-welcome.*email template/);
    expect(joined).toMatch(/navbar.*layout chrome/);
    expect(joined).toMatch(/unknown block "logins".*Did you mean "login"/);
    expect(joined).toMatch(/duplicate route/);
    expect(joined).toMatch(/chrome group "nope" is not defined/);
    expect(joined).toMatch(/invalid route/);
    // Aggregated, not first-only.
    expect(errors.length).toBeGreaterThanOrEqual(6);
  });

  it("rejects a chrome slot pointing at a non-chrome block", () => {
    const m = manifest();
    m.manifest.chrome.site = { navbar: "hero" }; // hero is a section, not chrome
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/only chrome blocks belong in a chrome slot/);
  });

  it("rejects the F1-unsupported shell chrome block", () => {
    const m = manifest();
    m.manifest.chrome.app = { block: "app-shell" };
    m.manifest.pages.push({ route: "/dash", title: "D", chrome: "app", blocks: ["hero"] });
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/shell "block" chrome is not supported in F1/);
  });

  it("throws ComposePlanError (not a plain Error) from buildComposePlan", () => {
    const m = manifest();
    m.manifest.pages[0]!.blocks = ["nope-block"];
    expect(() => buildComposePlan(m, { appName: "x" }, index, meta, chrome)).toThrow(
      ComposePlanError,
    );
  });

  it("reports a missing chrome source (registry read failure)", () => {
    const { errors } = validateComposePlan(manifest(), { appName: "x" }, index, meta, {
      navbar: fixtureChromeSources().navbar,
      // footer omitted → source unavailable
    });
    expect(errors.join("\n")).toMatch(/chrome block "footer".*shipped source is unavailable/);
  });
});

describe("buildComposePlan — extras (Next special-file blocks)", () => {
  it("resolves a not-found extras block, installs it, and records it in the plan", () => {
    const m = manifest();
    m.manifest.extras = { "not-found": "not-found" };
    const plan = buildComposePlan(m, { appName: "loja" }, index, meta, chrome);
    expect(plan.extras).toEqual([
      {
        key: "not-found",
        file: "app/not-found.tsx",
        slug: "not-found",
        exportName: "NotFoundBlock",
      },
    ]);
    // The extras block is installed like any other block (in blockSlugs, sorted).
    expect(plan.blockSlugs).toContain("not-found");
  });

  it("resolves extras in a stable, key-sorted order", () => {
    const m = manifest();
    // Only not-found is a supported special file today; insertion order should not
    // matter — the plan sorts by key.
    m.manifest.extras = { "not-found": "not-found" };
    const a = buildComposePlan(m, { appName: "loja" }, index, meta, chrome).extras;
    const b = buildComposePlan(m, { appName: "loja" }, index, meta, chrome).extras;
    expect(a).toEqual(b);
  });

  it("rejects an unknown extras block slug (referenced-block-exists guarantee)", () => {
    const m = manifest();
    m.manifest.extras = { "not-found": "nott-found" };
    const { errors, plan } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(/extras\."not-found": unknown block "nott-found"/);
  });

  it("rejects an extras block that is not a page-kind block", () => {
    const m = manifest();
    m.manifest.extras = { "not-found": "hero" }; // hero is a section
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/needs a page-kind block/);
  });

  it("rejects an unsupported special-file key", () => {
    const m = manifest();
    m.manifest.extras = { "no-found": "not-found" }; // typo of not-found
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(
      /unsupported special file "no-found".*Did you mean "not-found"/,
    );
  });
});

describe("buildComposePlan — dynamic-slug route collisions (Next-invalid)", () => {
  function withPages(pages: AppManifest["manifest"]["pages"]): AppManifest {
    const m = manifest();
    m.manifest.pages = pages;
    return m;
  }

  it("rejects two routes with the same shape but different slug names in one group", () => {
    const m = withPages([
      { route: "/products/[id]", title: "A", chrome: "site", blocks: ["product-detail"] },
      { route: "/products/[slug]", title: "B", chrome: "site", blocks: ["product-detail"] },
    ]);
    const { errors, plan } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(/one slug name per dynamic path position/);
  });

  it("rejects a route that repeats a slug name within one path", () => {
    const m = withPages([
      { route: "/[id]/[id]", title: "A", chrome: "site", blocks: ["product-detail"] },
    ]);
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/dynamic slug "\[id\]" is repeated/);
  });

  it("allows the same route shape+slug across DIFFERENT chrome groups", () => {
    const m = withPages([
      { route: "/products/[id]", title: "A", chrome: "site", blocks: ["product-detail"] },
      { route: "/preview/[id]", title: "B", chrome: "bare", blocks: ["product-detail"] },
    ]);
    // Different skeletons entirely + different groups → clean.
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors).toEqual([]);
  });

  it("does NOT flag identical route shape with the SAME slug name (dedup handles it)", () => {
    const m = withPages([
      { route: "/products/[id]", title: "A", chrome: "site", blocks: ["product-detail"] },
      // A genuine duplicate route string is a separate 'duplicate route' error, not
      // a slug-collision error.
      { route: "/products/[id]", title: "B", chrome: "site", blocks: ["product-detail"] },
    ]);
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    const joined = errors.join("\n");
    expect(joined).toMatch(/duplicate route/);
    expect(joined).not.toMatch(/one slug name per dynamic path position/);
  });

  it("accepts distinct dynamic routes with consistent slug names", () => {
    const m = withPages([
      { route: "/products/[id]", title: "A", chrome: "site", blocks: ["product-detail"] },
      { route: "/orders/[id]", title: "B", chrome: "site", blocks: ["product-detail"] },
    ]);
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors).toEqual([]);
  });
});

describe("buildComposePlan — nav links only reference included pages", () => {
  // The renderer derives nav ONLY from included pages that carry a `nav` label
  // (navLinksOf), so every generated nav href points at an included route by
  // construction. This test locks that invariant against a --pages subset: nav
  // must never surface a route the subset excluded.
  it("a --pages subset never yields a nav link to an excluded route", () => {
    const m = manifest();
    m.manifest.pages = [
      { route: "/", title: "Home", nav: "Home", chrome: "site", blocks: ["hero"] },
      { route: "/pricing", title: "Pricing", nav: "Pricing", chrome: "site", blocks: ["pricing"] },
    ];
    const plan = buildComposePlan(m, { appName: "x", pages: ["/"] }, index, meta, chrome);
    const includedRoutes = new Set(plan.pages.map((p) => p.route));
    const navRoutes = plan.pages.filter((p) => p.nav !== undefined).map((p) => p.route);
    expect(navRoutes).toEqual(["/"]);
    for (const r of navRoutes) expect(includedRoutes.has(r)).toBe(true);
  });
});
