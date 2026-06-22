import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";
import { FrameworkGrid } from "../../../components/docs/framework-grid";
import { PackageManagerTabs } from "../../../components/docs/package-manager-tabs";
import { INSTALL_OPTIONS } from "../../../lib/docs";

export default function InstallationPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Installation"
        title="Install Cooud UI in the path that matches your project"
        description="Use Create for visual preset work, the CLI for new templates, or the existing-project path when the app already has routing and styling decisions."
      />

      <div className="mt-8">
        <DocCallout title="Recommended for new projects">
          Use <InlineCode>/create</InlineCode> to build a preset visually, then copy the setup
          command generated for your framework and package manager.
        </DocCallout>
      </div>

      <DocsSection title="Starting point">
        <DocsGrid>
          {INSTALL_OPTIONS.map((option) => (
            <DocsCard
              key={option.title}
              title={option.title}
              description={option.description}
              href={option.href}
              action={option.action}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Use Create"
        description="Build your preset visually, preview the result, save it locally, and generate the command for your stack."
      >
        <PrimaryLink href="/create">Open Create</PrimaryLink>
      </DocsSection>

      <DocsSection
        title="Use the CLI"
        description="Scaffold a new project directly from the terminal. Replace the template flag with the framework you need."
      >
        <PackageManagerTabs command="init" description="New project command" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Supported templates include <InlineCode>next</InlineCode>, <InlineCode>vite</InlineCode>,{" "}
          <InlineCode>start</InlineCode>, <InlineCode>react-router</InlineCode>,{" "}
          <InlineCode>astro</InlineCode>, and <InlineCode>laravel</InlineCode>.
        </p>
      </DocsSection>

      <DocsSection
        title="Existing project"
        description="Run the existing-project initializer, then add the provider and token CSS in the framework root."
      >
        <PackageManagerTabs command="existing" description="Existing app command" />
      </DocsSection>

      <DocsSection
        title="Choose your framework"
        description="Each adapter documents where the provider, token import, and accessibility handoff should live."
      >
        <FrameworkGrid />
      </DocsSection>
    </div>
  );
}
