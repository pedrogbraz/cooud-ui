import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";

const registryFlow = [
  {
    title: "Generate",
    description:
      "The registry is generated from real @cooud-ui/ui component sources, keeping docs, packages, and copy-paste output aligned.",
  },
  {
    title: "Resolve",
    description:
      "When you add a component, registry dependencies are expanded so required primitives come with it.",
  },
  {
    title: "Rewrite",
    description:
      "Imports are rewritten to your configured aliases, such as @/components/ui and @/lib/cn.",
  },
  {
    title: "Diff",
    description: "The diff command exposes local drift before teams upgrade copied components.",
  },
] as const;

const buildCommand = `bun run -F cooud-ui registry
pnpm dlx cooud-ui@latest list --registry ./registry
pnpm dlx cooud-ui@latest add button card --registry ./registry`;

const registryItem = `{
  "name": "button",
  "type": "registry:ui",
  "files": ["components/ui/button.tsx"],
  "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
  "registryDependencies": []
}`;

export default function RegistryPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Registry"
        title="Own the code without forking the design system"
        description="The registry turns package source into copyable component files, preserving dependencies and local aliases for every app."
      />

      <DocsSection title="Flow">
        <DocsGrid columns={2}>
          {registryFlow.map((step) => (
            <DocsCard key={step.title} title={step.title} description={step.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Local registry"
        description="Use a local registry path when developing or testing component changes before publishing."
      >
        <CodeBlock code={buildCommand} language="bash" />
      </DocsSection>

      <DocsSection
        title="Registry item shape"
        description="Each item records files, npm dependencies, and other registry items required by the component."
      >
        <CodeBlock code={registryItem} language="json" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The CLI reads <InlineCode>cooud-ui.json</InlineCode> before writing files, so copied
          components follow the receiving app's folder structure.
        </p>
      </DocsSection>
    </div>
  );
}
