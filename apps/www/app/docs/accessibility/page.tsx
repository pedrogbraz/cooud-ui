import { CodeBlock } from "../../../components/docs/code-block";
import {
  Checklist,
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";
import { ACCESSIBILITY_CHECKS } from "../../../lib/docs";

const releaseChecklist = [
  "Component has an accessible name or documents how consumers provide one.",
  "Keyboard behavior matches the WAI-ARIA pattern for the primitive.",
  "Focus is visible in dark and light presets.",
  "Disabled, invalid, loading, and empty states are represented.",
  "Examples include labels, descriptions, and error messages where relevant.",
  "Framework docs mention navigation focus handoff when routing can change focus.",
] as const;

const skipLinkExample = `// app/layout.tsx — one skip link, then exactly one <main> per route.
<a href="#main-content" className="sr-only focus-visible:not-sr-only ...">
  Skip to content
</a>
{/* ...elsewhere in the route... */}
<main id="main-content">{children}</main>`;

const iconButtonExample = `import { Button } from "@cooud-ui/ui";
import { Label } from "@cooud-ui/ui";
import { X } from "lucide-react";

// Form controls get a real label tied to the input.
<Label htmlFor="org-name">Organization</Label>
<Input id="org-name" />

// Icon-only buttons have no text, so name them with aria-label.
<Button variant="ghost" size="icon" aria-label="Dismiss">
  <X />
</Button>`;

const dialogExample = `import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@cooud-ui/ui";

<Dialog>
  <DialogContent>
    <DialogTitle>Invite teammate</DialogTitle>
    <DialogDescription>
      Send an invite with the correct role and organization scope.
    </DialogDescription>
  </DialogContent>
</Dialog>`;

const reducedMotionExample = `import { Marquee } from "@cooud-ui/ui";

// Default motionPreference="respect" — scrolls for everyone except
// visitors with prefers-reduced-motion, who get a static row.
<Marquee>{logos}</Marquee>

// Force or disable motion explicitly when a layout requires it.
<Marquee motionPreference="always">{logos}</Marquee>
<Marquee motionPreference="never">{logos}</Marquee>`;

const complexWidgetExample = `// Charts can't be made node-accessible, so describe them with text.
// The recharts subtree is hidden; the wrapper carries the summary.
<div
  role="img"
  aria-label="Donut chart of traffic sources by visitors: Direct 4,200, Organic 3,100, Referral 1,900, Social 1,400, Email 800."
  className="h-64 w-full"
>
  <div aria-hidden="true" className="h-full w-full">
    <ChartContainer config={chartConfig}>{/* recharts subtree */}</ChartContainer>
  </div>
</div>`;

const axeExample = `// e2e/a11y/core-routes.a11y.spec.ts — axe-core over every core route.
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  .analyze();

// Fail the gate on any serious/critical WCAG A/AA violation.
const blocking = results.violations.filter(
  (v) => v.impact === "serious" || v.impact === "critical",
);
expect(blocking).toEqual([]);`;

export default function AccessibilityPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Accessibility"
        title="Accessibility is part of the component contract"
        description="Cooud UI components ship with keyboard behavior, visible focus, semantic structure, and framework integration notes so teams do not rediscover the same edge cases."
      />

      <DocsSection title="Quality bars">
        <DocsGrid columns={2}>
          {ACCESSIBILITY_CHECKS.map((check) => (
            <DocsCard key={check.title} title={check.title} description={check.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Keyboard & focus"
        description="Every interactive primitive follows the WAI-ARIA keyboard pattern for its role, and shows a visible focus ring in both the dark and light presets."
      >
        <p className="text-fg-secondary">
          Tab order matches the visual order, focus is managed inside overlays and menus, and
          Escape, arrow keys, and Enter behave as the pattern expects. The ring is driven by{" "}
          <InlineCode>focus-visible</InlineCode> so it appears for keyboard users without
          distracting pointer users. Each route also ships a skip link to{" "}
          <InlineCode>#main-content</InlineCode> and exactly one{" "}
          <InlineCode>&lt;main&gt;</InlineCode> landmark, so keyboard and screen-reader users can
          jump straight past the navigation.
        </p>
        <CodeBlock code={skipLinkExample} language="tsx" />
      </DocsSection>

      <DocsSection
        title="Accessible names"
        description="Everything interactive needs a name. Tie form controls to a Label, and give icon-only buttons an explicit aria-label."
      >
        <p className="text-fg-secondary">
          Associate inputs with a <InlineCode>Label</InlineCode> via{" "}
          <InlineCode>htmlFor</InlineCode>, and name icon-only buttons — like the toast dismiss
          control — with an <InlineCode>aria-label</InlineCode> so they are not announced as unnamed
          buttons.
        </p>
        <CodeBlock code={iconButtonExample} language="tsx" />
        <p className="text-fg-secondary">
          Dialog-like overlays must expose a title and description even when the visual design is
          compact, so the accessible name and context come through:
        </p>
        <CodeBlock code={dialogExample} language="tsx" />
      </DocsSection>

      <DocsSection
        title="Color & contrast"
        description="Semantic tokens are authored as foreground/background pairs validated for WCAG AA contrast."
      >
        <p className="text-fg-secondary">
          Components reference tokens such as <InlineCode>fg</InlineCode> on{" "}
          <InlineCode>surface-base</InlineCode> rather than raw colors, so restyling through a theme
          keeps text legible when the palette changes. Define new presets as paired values and
          contrast is preserved across modes.
        </p>
        <p className="text-fg-secondary">
          See <PrimaryLink href="/docs/theming">Theming</PrimaryLink> for how the token pairs are
          structured and overridden.
        </p>
      </DocsSection>

      <DocsSection
        title="Reduced motion"
        description="Animated components honour the visitor's prefers-reduced-motion setting by default."
      >
        <p className="text-fg-secondary">
          <InlineCode>Marquee</InlineCode> defaults to{" "}
          <InlineCode>motionPreference="respect"</InlineCode>, so it scrolls for everyone except
          visitors who prefer reduced motion, who see a static row. Reveal, Shimmer, and the other
          animated primitives collapse their motion under the same media query.
        </p>
        <CodeBlock code={reducedMotionExample} language="tsx" />
      </DocsSection>

      <DocsSection
        title="Complex widgets"
        description="When a widget — like a chart — can't be made node-accessible, provide a text alternative instead."
      >
        <p className="text-fg-secondary">
          Data viz built on an SVG library exposes dozens of nameless shapes. Wrap the widget in{" "}
          <InlineCode>role="img"</InlineCode> with an <InlineCode>aria-label</InlineCode> that
          summarizes the data, and mark the rendered subtree <InlineCode>aria-hidden</InlineCode> so
          its internals are not announced.
        </p>
        <CodeBlock code={complexWidgetExample} language="tsx" />
      </DocsSection>

      <DocsSection
        title="Release checklist"
        description="A new component is not considered ready until these checks are represented in docs or tests."
      >
        <Checklist items={releaseChecklist} />
      </DocsSection>

      <DocsSection
        title="Testing"
        description="Accessibility is gated automatically — axe-core scans the routes on every run."
      >
        <p className="text-fg-secondary">
          The suite in <InlineCode>e2e/a11y</InlineCode> runs the full axe-core rule set scoped to
          WCAG 2 A and AA over each core route, and fails the build on any{" "}
          <InlineCode>serious</InlineCode> or <InlineCode>critical</InlineCode> violation. Run it
          with <InlineCode>bun run test:a11y</InlineCode>; teams can add their own routes to the
          list.
        </p>
        <CodeBlock code={axeExample} language="tsx" />
        <DocCallout title="Manual checks still matter">
          Automated scans catch contrast, names, and landmarks, but keyboard-only walkthroughs and a
          screen-reader pass remain part of the review.
        </DocCallout>
      </DocsSection>
    </div>
  );
}
