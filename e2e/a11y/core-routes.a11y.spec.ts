import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/**
 * Accessibility coverage (axe-core) for the Cooud UI core routes.
 *
 * For every route we run the full axe-core rule set, scoped to WCAG 2.0/2.1
 * A & AA tags, and assert ZERO violations at impact level `serious` or
 * `critical`. A fresh contrast failure, a missing label, a broken landmark —
 * any of those fail the gate immediately, and the failure message names the
 * exact rule + a sample node so it's actionable.
 *
 * Rules explicitly covered (a representative subset of what axe runs):
 *   - color-contrast .................. text/background AA contrast (WCAG 1.4.3)
 *   - landmark-one-main ............... exactly one <main> landmark per page
 *   - landmark-unique ................. landmarks are distinguishable
 *   - landmark-no-duplicate-main ...... no duplicate main landmarks
 *   - region .......................... content sits inside a landmark
 *   - page-has-heading-one ............ each page exposes an <h1>
 *   - bypass .......................... a skip mechanism exists (skip link)
 *   - button-name / link-name ......... interactive elements have names
 *   - aria-input-field-name ........... inputs (incl. Slider thumbs) are named
 *   - aria-* .......................... valid ARIA roles/attrs/values
 *   - heading-order / list / listitem . document structure
 *
 * These are the hardening targets from the a11y work (skip link, single
 * <main id="main-content"> per route, focus-visible, named Slider thumbs, AA
 * contrast on the dark theme's tertiary foreground), so a clean run here
 * protects that work.
 */

// `serious` and `critical` are the impact levels we treat as hard failures.
// `moderate`/`minor` (e.g. cosmetic best-practice hints) are reported but not
// blocking — keeps the gate signal high without chasing noise.
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

// WCAG A/AA tag scope: deterministic and matches the level we ship to.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const CORE_ROUTES: ReadonlyArray<{ path: string; label: string }> = [
  { path: "/", label: "home" },
  { path: "/components", label: "components overview" },
  { path: "/blocks", label: "blocks overview" },
  { path: "/create", label: "create studio" },
  { path: "/stack", label: "stack builder" },
  { path: "/docs", label: "docs landing" },
  { path: "/docs/installation", label: "docs · installation" },
  // P3 wave 1 components — scan their live demo pages directly.
  { path: "/components/alert", label: "components · alert" },
  { path: "/components/combobox", label: "components · combobox" },
  { path: "/components/multi-select", label: "components · multi-select" },
  { path: "/components/data-table", label: "components · data-table" },
  // P3 layout & app-navigation components — mini-layout demos in fixed frames.
  { path: "/components/sidebar", label: "components · sidebar" },
  { path: "/components/app-shell", label: "components · app-shell" },
  { path: "/components/navigation-menu", label: "components · navigation-menu" },
  // P3 components wave — copy/code/collapsible/aspect-ratio/number/date-range/autocomplete.
  { path: "/components/copy-button", label: "components · copy-button" },
  { path: "/components/code-block", label: "components · code-block" },
  { path: "/components/collapsible", label: "components · collapsible" },
  { path: "/components/aspect-ratio", label: "components · aspect-ratio" },
  { path: "/components/number-input", label: "components · number-input" },
  { path: "/components/date-range-picker", label: "components · date-range-picker" },
  { path: "/components/autocomplete", label: "components · autocomplete" },
  // Premium overlays — morphing popover (trigger morphs into a non-modal dialog).
  { path: "/components/morphing-popover", label: "components · morphing-popover" },
  // Animated premium components — count-up, scroll-snap gallery, sliding toggle, staggered text.
  { path: "/components/animated-number", label: "components · animated-number" },
  { path: "/components/carousel", label: "components · carousel" },
  { path: "/components/segmented-control", label: "components · segmented-control" },
  { path: "/components/text-effect", label: "components · text-effect" },
];

async function runAxe(page: Page) {
  return (
    new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      // Ensure the landmark + contrast families are enabled even if a tag scope
      // would otherwise omit one (defensive — they are A/AA, so already in scope).
      .options({
        rules: {
          "color-contrast": { enabled: true },
          "landmark-one-main": { enabled: true },
          "landmark-unique": { enabled: true },
          region: { enabled: true },
        },
      })
      .analyze()
  );
}

async function waitForRouteSettled(page: Page, path: string) {
  if (path === "/create") {
    await expect(page.getByText("Spending breakdown")).toBeVisible();
  }
}

for (const route of CORE_ROUTES) {
  test(`a11y: ${route.label} (${route.path}) has no serious/critical violations`, async ({
    page,
  }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    // Wait for the route's main landmark so we scan settled, hydrated DOM.
    await expect(page.locator("main#main-content")).toBeVisible();
    await waitForRouteSettled(page, route.path);

    const results = await runAxe(page);

    const blocking = results.violations.filter(
      (v) => v.impact != null && BLOCKING_IMPACTS.has(v.impact),
    );

    // Human-readable failure detail: rule id, impact, and a sample target.
    const summary = blocking
      .map((v) => {
        const sampleNode = v.nodes[0]?.target?.join(" ") ?? "(no node)";
        return `  • [${v.impact}] ${v.id}: ${v.help}\n      e.g. ${sampleNode}`;
      })
      .join("\n");

    expect(
      blocking,
      blocking.length > 0
        ? `axe found ${blocking.length} NEW serious/critical violation(s) on ${route.path} ` +
            `:\n${summary}`
        : undefined,
    ).toEqual([]);
  });
}
