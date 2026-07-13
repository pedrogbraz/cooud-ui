/**
 * Shared in-memory registry fixtures for the compose unit tests. Named
 * `*.fixtures.ts` so the CLI tsconfig excludes it from `dist` (never shipped) yet
 * vitest can still import it from the `.test.ts` files.
 */

import type { RegistryIndex } from "../registry.js";
import type { AppManifest } from "./manifest.js";
import type { ComposeMeta } from "./plan.js";

/** Chrome sources with the exact marker + brand anchors the composer rewrites. */
export const NAVBAR_SOURCE = [
  'import { Badge } from "@cooud-ui/ui";',
  "",
  "/* @cooud:data navbar-links */",
  "const NAVBAR_LINKS = [",
  '  { label: "Features", href: "#features" },',
  "];",
  "/* @cooud:data-end */",
  "",
  "export function NavbarBlock() {",
  "  return <span>Cooud</span>;",
  "}",
  "",
].join("\n");

export const FOOTER_SOURCE = [
  'import { Separator } from "@cooud-ui/ui";',
  "",
  "/* @cooud:data footer-links */",
  "const FOOTER_COLUMNS = [",
  '  { heading: "Product", links: [] },',
  "];",
  "/* @cooud:data-end */",
  "",
  "export function FooterBlock() {",
  "  return <footer>Cooud — © 2026 Cooud.</footer>;",
  "}",
  "",
].join("\n");

/** The block slugs the fixture registry knows, with their kinds. */
export const FIXTURE_BLOCKS: Record<string, { exportName: string; kind: string }> = {
  hero: { exportName: "HeroBlock", kind: "section" },
  pricing: { exportName: "PricingBlock", kind: "section" },
  cta: { exportName: "CtaBlock", kind: "section" },
  login: { exportName: "LoginBlock", kind: "page" },
  checkout: { exportName: "CheckoutBlock", kind: "page" },
  "product-detail": { exportName: "ProductDetailBlock", kind: "page" },
  reviews: { exportName: "ReviewsBlock", kind: "section" },
  navbar: { exportName: "NavbarBlock", kind: "chrome" },
  footer: { exportName: "FooterBlock", kind: "chrome" },
  "email-welcome": { exportName: "EmailWelcomeBlock", kind: "email" },
  "not-found": { exportName: "NotFoundBlock", kind: "page" },
};

/** A registry index with the fixture blocks (+ a benign npm dep each). */
export function fixtureIndex(): RegistryIndex {
  return Object.keys(FIXTURE_BLOCKS).map((name) => ({
    name,
    type: "registry:block" as const,
    dependencies: ["@cooud-ui/ui@0.3.0", "lucide-react@^0.400.0"],
    registryDependencies: [],
  }));
}

/** The compose meta for the fixture blocks (data-slots/brand only on chrome). */
export function fixtureMeta(): ComposeMeta {
  const blocks: ComposeMeta["blocks"] = {};
  for (const [slug, info] of Object.entries(FIXTURE_BLOCKS)) {
    const isChrome = info.kind === "chrome";
    blocks[slug] = {
      exportName: info.exportName,
      kind: info.kind as ComposeMeta["blocks"][string]["kind"],
      dataSlots: slug === "navbar" ? ["navbar-links"] : slug === "footer" ? ["footer-links"] : [],
      brandTokens: isChrome ? [{ token: "brand", literal: "Cooud" }] : [],
    };
  }
  return { blocks };
}

/** The shipped chrome sources map keyed by slug. */
export function fixtureChromeSources(): Record<string, string> {
  return { navbar: NAVBAR_SOURCE, footer: FOOTER_SOURCE };
}

/** A valid 2-page store-like manifest using the fixture blocks. */
export function fixtureManifest(): AppManifest {
  return {
    name: "shop",
    type: "registry:app",
    planVersion: 1,
    manifest: {
      title: "Shop",
      description: "A tiny shop.",
      chrome: { site: { navbar: "navbar", footer: "footer" }, bare: {} },
      pages: [
        {
          route: "/",
          title: "Home",
          nav: "Home",
          chrome: "site",
          blocks: ["hero", "pricing", "cta"],
        },
        { route: "/login", title: "Sign in", chrome: "bare", blocks: ["login"] },
      ],
      defaults: { brand: "__APP_NAME__" },
    },
  };
}
