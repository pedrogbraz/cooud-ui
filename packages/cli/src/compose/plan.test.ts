import { describe, expect, it } from "vitest";
import {
  fixtureChromeSources,
  fixtureIndex,
  fixtureManifest,
  fixtureMeta,
  fixtureShellManifest,
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
    // Both override keys must target a variant-capable block an included page
    // references (else the plan now fails loud on an unused override key), so the
    // /login page stacks login + product-detail and both keys resolve.
    const m = manifest();
    m.manifest.pages[1]!.blocks = [
      { block: "login", variant: "split" },
      { block: "product-detail", variant: "gallery" },
    ];
    const plan = buildComposePlan(
      m,
      { appName: "loja", seed: 7, variants: { "product-detail": "gallery", login: "split" } },
      index,
      meta,
      chrome,
    );
    expect(Object.keys(plan.choices.variants)).toEqual(["login", "product-detail"]);
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

  it("resolves the app-shell chrome block (F2 shell support)", () => {
    const plan = buildComposePlan(fixtureShellManifest(), { appName: "x" }, index, meta, chrome);
    expect(plan.usesShell).toBe(true);
    expect(plan.shellSlug).toBe("app-shell-chrome");
    expect(plan.shellExportName).toBe("AppShellChromeBlock");
    // The shell slug is a used chrome slug (installed + rewritten).
    expect(plan.chromeSlugs).toContain("app-shell-chrome");
    // The shell group carries the resolved block on its PlanChrome.
    expect(plan.chromes.find((c) => c.group === "shell")?.block).toBe("app-shell-chrome");
  });

  it("rejects a non-chrome block in the shell slot", () => {
    const m = structuredClone(fixtureShellManifest());
    m.manifest.chrome.shell = { block: "hero" }; // hero is a section, not chrome
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/only chrome blocks belong in a chrome slot/);
  });

  it("rejects combining a shell block with navbar/footer in one group", () => {
    const m = structuredClone(fixtureShellManifest());
    m.manifest.chrome.shell = { block: "app-shell-chrome", navbar: "navbar" };
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/cannot be combined with navbar\/footer/);
  });

  it("rejects a second shell group (only one shell block group supported per app)", () => {
    // Two chrome groups both declaring an app-shell `block` validate clean today
    // but the renderer collapses to a single shell wrapper, silently mis-rendering
    // the second group's sidebar. Fail loud instead.
    const m = structuredClone(fixtureShellManifest());
    m.manifest.chrome.admin = { block: "app-shell-chrome" };
    m.manifest.pages.push({
      route: "/admin",
      title: "Admin",
      nav: "Admin",
      chrome: "admin",
      blocks: ["hero"],
    });
    const { errors, plan } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(plan).toBeUndefined();
    // "admin" sorts before "shell", so "shell" is the extra group flagged.
    expect(errors.join("\n")).toMatch(
      /chrome "shell": only one shell "block" group is supported per app \(already used by "admin"\)/,
    );
    // Exactly one extra group is flagged (two groups → one error), not both.
    expect(errors.filter((e) => e.includes("only one shell")).length).toBe(1);
  });

  it("still accepts a single shell group (guard does not over-fire)", () => {
    const { errors } = validateComposePlan(
      fixtureShellManifest(),
      { appName: "x" },
      index,
      meta,
      chrome,
    );
    expect(errors).toEqual([]);
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

describe("buildComposePlan — variants (F2)", () => {
  it("resolves the default variant to the bare item + block export (no variant set)", () => {
    const plan = buildComposePlan(manifest(), { appName: "loja" }, index, meta, chrome);
    const loginBlock = plan.pages.find((p) => p.route === "/login")?.blocks[0];
    expect(loginBlock).toEqual(
      expect.objectContaining({ slug: "login", item: "login", exportName: "LoginBlock" }),
    );
    expect(loginBlock?.variant).toBeUndefined();
    // The bare item is what installs.
    expect(plan.blockSlugs).toContain("login");
    expect(plan.blockSlugs).not.toContain("login--split");
  });

  it("honors a manifest { block, variant } ref → variant item + export", () => {
    const m = manifest();
    m.manifest.pages[1]!.blocks = [{ block: "login", variant: "split" }];
    const plan = buildComposePlan(m, { appName: "loja" }, index, meta, chrome);
    const loginBlock = plan.pages.find((p) => p.route === "/login")?.blocks[0];
    expect(loginBlock).toEqual(
      expect.objectContaining({
        slug: "login",
        item: "login--split",
        exportName: "LoginSplitBlock",
        variant: "split",
      }),
    );
    // The variant item (not the bare slug) is what installs.
    expect(plan.blockSlugs).toContain("login--split");
    expect(plan.blockSlugs).not.toContain("login");
  });

  it("lets a --variant choices override win over the manifest variant", () => {
    const m = manifest();
    m.manifest.pages[1]!.blocks = [{ block: "login", variant: "split" }];
    const plan = buildComposePlan(
      m,
      { appName: "loja", variants: { login: "minimal" } },
      index,
      meta,
      chrome,
    );
    const loginBlock = plan.pages.find((p) => p.route === "/login")?.blocks[0];
    expect(loginBlock).toEqual(
      expect.objectContaining({
        item: "login--minimal",
        exportName: "LoginMinimalBlock",
        variant: "minimal",
      }),
    );
    // The override is recorded in normalized choices.
    expect(plan.choices.variants.login).toBe("minimal");
  });

  it("a choices override targeting the DEFAULT variant maps back to the bare item", () => {
    // "default" is the fixture's default-variant id → the bare login item.
    const plan = buildComposePlan(
      manifest(),
      { appName: "loja", variants: { login: "default" } },
      index,
      meta,
      chrome,
    );
    const loginBlock = plan.pages.find((p) => p.route === "/login")?.blocks[0];
    expect(loginBlock?.item).toBe("login");
    expect(loginBlock?.variant).toBeUndefined();
  });

  it("rejects an unknown variant with a did-you-mean suggestion", () => {
    const m = manifest();
    m.manifest.pages[1]!.blocks = [{ block: "login", variant: "splt" }];
    const { errors, plan } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(
      /unknown variant "splt" for block "login".*Did you mean "split"/,
    );
  });

  it("rejects a variant request on a block that has no variants", () => {
    const m = manifest();
    // checkout has no variants in the fixture.
    m.manifest.pages.push({
      route: "/co",
      title: "CO",
      chrome: "bare",
      blocks: [{ block: "checkout", variant: "wizard" }],
    });
    const { errors } = validateComposePlan(m, { appName: "x" }, index, meta, chrome);
    expect(errors.join("\n")).toMatch(/unknown variant "wizard" for block "checkout"/);
  });

  it("rejects a --variant override that targets a chrome slot (navbar/footer/shell)", () => {
    // navbar is a chrome slot; --variant is never consulted for chrome, so an
    // override here would be silently ignored + persisted. Fail loud instead.
    const { errors, plan } = validateComposePlan(
      manifest(),
      { appName: "x", variants: { navbar: "mega" } },
      index,
      meta,
      chrome,
    );
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(
      /--variant "navbar": chrome slots \(navbar\/footer\/shell\) do not accept --variant/,
    );
  });

  it("rejects a --variant override for a shell block slot", () => {
    const { errors, plan } = validateComposePlan(
      fixtureShellManifest(),
      { appName: "x", variants: { "app-shell-chrome": "wide" } },
      index,
      meta,
      chrome,
    );
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(/chrome slots.*do not accept --variant/);
  });

  it("rejects a --variant override whose slug matches no included page/extras block", () => {
    const { errors, plan } = validateComposePlan(
      manifest(),
      { appName: "x", variants: { zzznotablock: "foo" } },
      index,
      meta,
      chrome,
    );
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(
      /--variant "zzznotablock": no included page\/extras block uses block "zzznotablock"/,
    );
  });

  it("suggests the closest block for a near-miss --variant override slug", () => {
    // "logins" is not referenced by any page; the closest variant target is "login".
    const { errors } = validateComposePlan(
      manifest(),
      { appName: "x", variants: { logins: "split" } },
      index,
      meta,
      chrome,
    );
    expect(errors.join("\n")).toMatch(/--variant "logins".*Did you mean "login"/);
  });

  it("rejects a --variant override for a page block dropped by a --pages subset", () => {
    // /login (the only page referencing `login`) is excluded, so the override for
    // `login` no longer applies to anything and must not be silently persisted.
    const { errors, plan } = validateComposePlan(
      manifest(),
      { appName: "x", pages: ["/"], variants: { login: "split" } },
      index,
      meta,
      chrome,
    );
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(/--variant "login": no included page\/extras block uses/);
  });

  it("accepts a --variant override that targets an extras block", () => {
    const m = manifest();
    m.manifest.extras = { "not-found": "product-detail" };
    // A slug an extras block references is a legitimate --variant target: the
    // cross-check must NOT reject it (resolveBlock applied it), and it is recorded.
    const { errors, plan } = validateComposePlan(
      m,
      { appName: "x", variants: { "product-detail": "gallery" } },
      index,
      meta,
      chrome,
    );
    expect(errors).toEqual([]);
    expect(plan?.extras[0]?.slug).toBe("product-detail");
    expect(plan?.choices.variants["product-detail"]).toBe("gallery");
  });

  it("errors (not raw ENOENT) when meta names a variant item the registry index omits", () => {
    // A drifted custom --registry: meta still references login--split but the index
    // no longer publishes it. resolveBlock must reject it inside the aggregated
    // ComposePlanError, not let it slip through to a downstream registry.resolve ENOENT.
    const driftedIndex = fixtureIndex().filter((e) => e.name !== "login--split");
    const m = manifest();
    m.manifest.pages[1]!.blocks = [{ block: "login", variant: "split" }];
    const { errors, plan } = validateComposePlan(m, { appName: "x" }, driftedIndex, meta, chrome);
    expect(plan).toBeUndefined();
    expect(errors.join("\n")).toMatch(
      /variant "split" of block "login" resolves to item "login--split", which the registry index does not publish/,
    );
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
