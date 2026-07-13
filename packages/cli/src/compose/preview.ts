/**
 * Deterministic textual preview of a compose plan (the `--dry-run` human view):
 * a sitemap tree, the block stack + chrome per page, the nav labels, and the
 * theme/brand. Pure — a function of the plan only, no I/O/Date — so it reads the
 * same every run and can be snapshot-tested.
 */

import type { ComposePlan } from "./plan.js";

/** Render the plan to a multi-line preview string (no trailing newline). */
export function renderPreview(plan: ComposePlan): string {
  const lines: string[] = [];

  lines.push(`App: ${plan.title} (${plan.appName})`);
  if (plan.description.length > 0) lines.push(`  ${plan.description}`);
  lines.push(`Brand: ${plan.choices.brand}`);
  if (plan.choices.seed !== undefined) lines.push(`Seed: ${plan.choices.seed}`);

  // Chrome groups.
  lines.push("");
  lines.push("Chrome:");
  for (const chrome of plan.chromes) {
    const parts: string[] = [];
    if (chrome.navbar !== undefined) parts.push(`navbar=${chrome.navbar}`);
    if (chrome.footer !== undefined) parts.push(`footer=${chrome.footer}`);
    lines.push(`  (${chrome.group}) ${parts.length > 0 ? parts.join(" ") : "bare"}`);
  }

  // Sitemap: one entry per page, with its block stack.
  lines.push("");
  lines.push("Pages:");
  for (const page of plan.pages) {
    const navMark = page.nav !== undefined ? ` [nav: ${page.nav}]` : "";
    lines.push(`  ${page.route}  "${page.title}"  (${page.chrome})${navMark}`);
    for (const block of page.blocks) {
      lines.push(`    - ${block.slug} <${block.exportName}> (${block.kind})`);
    }
  }

  // Nav labels (in order).
  const navLabels = plan.pages
    .filter((p) => p.nav !== undefined)
    .map((p) => `${p.nav} → ${p.route}`);
  lines.push("");
  lines.push(`Nav: ${navLabels.length > 0 ? navLabels.join(", ") : "(none)"}`);

  return lines.join("\n");
}
