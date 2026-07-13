import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../config.js";
import {
  fixtureChromeSources,
  fixtureIndex,
  fixtureManifest,
  fixtureMeta,
} from "./compose.fixtures.js";
import { buildComposePlan, type ComposePlan } from "./plan.js";
import { renderPage, renderPlan, rewriteChromeBlock } from "./render.js";

const config = DEFAULT_CONFIG;

function plan(overrides?: { brand?: string; seed?: number }): ComposePlan {
  return buildComposePlan(
    fixtureManifest(),
    { appName: "loja", ...(overrides ?? {}) },
    fixtureIndex(),
    fixtureMeta(),
    fixtureChromeSources(),
  );
}

describe("renderPlan — GOLDEN RULE", () => {
  it("a generated page is only imports + a <main> stacking the blocks", () => {
    const home = renderPage(plan().pages[0]!, config);
    // Imports resolve blocks via the blocks alias, by their meta exportName.
    expect(home).toContain('import { HeroBlock } from "@/components/blocks/hero";');
    expect(home).toContain('import { PricingBlock } from "@/components/blocks/pricing";');
    expect(home).toContain('export const metadata = { title: "Home" };');
    // Exactly one <main>, stacking the three blocks, nothing else.
    expect(home).toContain("<main");
    expect(home).toContain("<HeroBlock />");
    expect(home).toContain("<PricingBlock />");
    expect(home).toContain("<CtaBlock />");
    // No invented UI: only self-closing block components + <main> live in the JSX.
    const jsxTags = [...home.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
    for (const tag of jsxTags) {
      expect(["main", "HeroBlock", "PricingBlock", "CtaBlock"]).toContain(tag);
    }
  });

  it("centers a single page-kind block, columns otherwise", () => {
    const p = plan();
    const login = renderPage(p.pages[1]!, config); // single page block
    expect(login).toContain("items-center justify-center");
    const home = renderPage(p.pages[0]!, config); // stacked sections
    expect(home).not.toContain("items-center justify-center");
  });

  it("emits chrome wrappers, layouts and pages at the right paths", () => {
    const { files } = renderPlan(plan(), config);
    const paths = files.map((f) => f.path);
    expect(paths).toContain("components/blocks/chrome/site-nav.tsx");
    expect(paths).toContain("components/blocks/chrome/site-footer.tsx");
    expect(paths).toContain("app/(site)/layout.tsx");
    expect(paths).toContain("app/(bare)/layout.tsx");
    expect(paths).toContain("app/(site)/page.tsx");
    expect(paths).toContain("app/(bare)/login/page.tsx");
  });

  it("the site layout wraps children with SiteNav + SiteFooter (thin wrappers only)", () => {
    const { files } = renderPlan(plan(), config);
    const layout = files.find((f) => f.path === "app/(site)/layout.tsx")?.content ?? "";
    expect(layout).toContain('import { SiteNav } from "@/components/blocks/chrome/site-nav";');
    expect(layout).toContain("<SiteNav />");
    expect(layout).toContain("<SiteFooter />");
    expect(layout).toContain("{children}");
    const nav =
      files.find((f) => f.path === "components/blocks/chrome/site-nav.tsx")?.content ?? "";
    expect(nav).toContain('import { NavbarBlock } from "@/components/blocks/navbar";');
    expect(nav).toContain("return <NavbarBlock />;");
  });
});

describe("renderPlan — extras (Next special files)", () => {
  function extrasPlan(): ComposePlan {
    const m = fixtureManifest();
    m.manifest.extras = { "not-found": "not-found" };
    return buildComposePlan(
      m,
      { appName: "loja" },
      fixtureIndex(),
      fixtureMeta(),
      fixtureChromeSources(),
    );
  }

  it("emits app/not-found.tsx as a thin block wrapper (golden rule)", () => {
    const { files } = renderPlan(extrasPlan(), config);
    const nf = files.find((f) => f.path === "app/not-found.tsx");
    expect(nf).toBeDefined();
    const content = nf?.content ?? "";
    expect(content).toContain('import { NotFoundBlock } from "@/components/blocks/not-found";');
    expect(content).toContain("export default function NotFoundPage()");
    expect(content).toContain("<main");
    expect(content).toContain("<NotFoundBlock />");
    // No invented UI: only <main> + the block component appear as JSX.
    const jsxTags = [...content.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
    for (const tag of jsxTags) expect(["main", "NotFoundBlock"]).toContain(tag);
  });

  it("emits extras deterministically and keeps them in blockSlugs", () => {
    const a = renderPlan(extrasPlan(), config);
    const b = renderPlan(extrasPlan(), config);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(extrasPlan().blockSlugs).toContain("not-found");
  });

  it("emits no special file when the manifest declares no extras", () => {
    const { files } = renderPlan(plan(), config);
    expect(files.some((f) => f.path.includes("not-found"))).toBe(false);
  });
});

describe("renderPlan — DETERMINISM (byte-equality)", () => {
  it("renders byte-identical output across two independent runs", () => {
    const a = renderPlan(plan({ brand: "Loja X" }), config);
    const b = renderPlan(plan({ brand: "Loja X" }), config);
    expect(a.files).toEqual(b.files);
    expect(a.chromeRewrites).toEqual(b.chromeRewrites);
    // And the exact serialized bytes match.
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("rewriteChromeBlock — data-slot + brand injection", () => {
  it("injects nav links into the navbar data-slot and replaces the brand", () => {
    const p = plan({ brand: "Acme" });
    const out = rewriteChromeBlock("navbar", fixtureChromeSources().navbar, p);
    expect(out).toContain('{ label: "Home", href: "/" }');
    expect(out).not.toContain('{ label: "Features", href: "#features" }');
    expect(out).toContain("<span>Acme</span>");
    expect(out).not.toContain("Cooud");
    // Markers preserved so a recompose stays anchored.
    expect(out).toContain("/* @cooud:data navbar-links */");
    expect(out).toContain("/* @cooud:data-end */");
  });

  it("wraps the nav links in a single Navigation column for the footer", () => {
    const p = plan({ brand: "Acme" });
    const out = rewriteChromeBlock("footer", fixtureChromeSources().footer, p);
    expect(out).toContain('heading: "Navigation"');
    expect(out).toContain('{ label: "Home", href: "/" }');
    // Both brand occurrences (wordmark + copyright) replaced.
    expect(out).not.toContain("Cooud");
    expect((out.match(/Acme/g) ?? []).length).toBe(2);
  });
});
