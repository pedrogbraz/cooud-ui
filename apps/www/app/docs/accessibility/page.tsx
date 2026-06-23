import { CodeBlock } from "../../../components/docs/code-block";
import {
  Checklist,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
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

const dialogExample = `import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@cooud-ui/ui";

<Dialog>
  <DialogContent>
    <DialogTitle>Invite teammate</DialogTitle>
    <DialogDescription>
      Send an invite with the correct role and organization scope.
    </DialogDescription>
  </DialogContent>
</Dialog>`;

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
        title="Release checklist"
        description="A new component is not considered ready until these checks are represented in docs or tests."
      >
        <Checklist items={releaseChecklist} />
      </DocsSection>

      <DocsSection
        title="Named overlays"
        description="Dialog-like primitives must expose a title and description, even when the visual design is compact."
      >
        <CodeBlock code={dialogExample} language="tsx" />
      </DocsSection>
    </div>
  );
}
