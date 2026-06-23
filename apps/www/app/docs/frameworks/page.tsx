import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";
import { FrameworkGrid } from "../../../components/docs/framework-grid";

const adapterContract = `// 1. Import tokens in the framework global CSS entry.
@import "tailwindcss";
@import "@cooud-ui/tokens/styles.css";

// 2. Wrap the root UI tree in CooudUIProvider.
<CooudUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
  {children}
</CooudUIProvider>

// 3. Add components through the registry.
pnpm dlx cooud-ui@latest add button card dialog form`;

export default function FrameworksPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Frameworks"
        title="Install once, keep framework behavior accessible"
        description="Each adapter keeps the same component contract while respecting the routing, hydration, and form behavior of the host framework."
      />

      <DocsSection
        title="Choose your framework"
        description="Create the app with the framework's official tool, then run cooud-ui init inside it. The init command is framework-agnostic and acts on the current directory."
      >
        <FrameworkGrid />
      </DocsSection>

      <DocsSection
        title="Adapter contract"
        description="Every framework path has the same three checkpoints: token CSS, provider placement, and registry component ownership."
      >
        <CodeBlock code={adapterContract} language="tsx" expandable />
      </DocsSection>

      <DocCallout title="Accessibility handoff" tone="success">
        Framework integrations must preserve visible focus, route transition focus, dialog
        dismissal, and form error announcements. This is part of the adapter checklist, not optional
        polish.
      </DocCallout>

      <DocsSection
        title="Laravel note"
        description="For Laravel, create the app first with the Laravel installer, then run Cooud UI inside the Vite/Inertia or Blade frontend workspace."
      >
        <p className="text-sm leading-6 text-fg-secondary">
          Start with <InlineCode>laravel new app</InlineCode>, choose the frontend stack, then run{" "}
          <InlineCode>cooud-ui init</InlineCode> inside the project. Server validation errors should
          map into <InlineCode>FieldError</InlineCode> or equivalent visible form feedback.
        </p>
      </DocsSection>
    </div>
  );
}
