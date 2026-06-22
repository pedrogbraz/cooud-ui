import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";
import { PackageManagerTabs } from "../../../components/docs/package-manager-tabs";

const cliCommands = [
  {
    title: "init",
    description:
      "Creates cooud-ui.json, installs base dependencies, writes lib/cn, and imports tokens.",
    badge: "setup",
  },
  {
    title: "add",
    description:
      "Copies components into your app, resolves registry dependencies, and rewrites imports.",
    badge: "daily",
  },
  {
    title: "list",
    description: "Prints registry items and lets teams audit what exists before adding code.",
    badge: "inspect",
  },
  {
    title: "diff",
    description: "Compares local copied components against the registry version to expose drift.",
    badge: "audit",
  },
] as const;

const config = `{
  "aliases": {
    "ui": "@/components/ui",
    "lib": "@/lib"
  },
  "paths": {
    "ui": "components/ui",
    "lib": "lib"
  },
  "registry": "https://raw.githubusercontent.com/pedrogbraz/cooud-ui/main/registry"
}`;

export default function CliPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="CLI"
        title="Use the registry from any package manager"
        description="The CLI is the shadcn-style distribution path for apps that should own their component source while still following Cooud UI conventions."
      />

      <DocsSection title="New project command">
        <PackageManagerTabs command="init" description="Select your package manager" />
      </DocsSection>

      <DocsSection title="Add components">
        <PackageManagerTabs command="add" description="Copy components into your app" />
      </DocsSection>

      <DocsSection title="Open Create from the terminal">
        <PackageManagerTabs command="create" description="Launch the visual preset workflow" />
      </DocsSection>

      <DocsSection
        title="Command surface"
        description="These commands are designed for app teams that want source ownership and repeatable upgrades."
      >
        <DocsGrid columns={2}>
          {cliCommands.map((command) => (
            <DocsCard
              key={command.title}
              title={command.title}
              description={command.description}
              badge={command.badge}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Config"
        description="The config keeps local aliases explicit, so generated code lands in the right folders for each app."
      >
        <CodeBlock code={config} language="json" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Use <InlineCode>--registry ./registry</InlineCode> for offline testing against a local
          registry build.
        </p>
      </DocsSection>
    </div>
  );
}
