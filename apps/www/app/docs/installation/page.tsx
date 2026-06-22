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
        description="Use Create for visual preset work, then run the CLI inside any project — new or existing — to wire tokens, providers, and config."
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
        description="Create the app with your framework's official tool, then run init inside it. The CLI is framework-agnostic and acts on the current directory."
      >
        <PackageManagerTabs command="init" description="Initialize the current project" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Works in any project — including <InlineCode>next</InlineCode>,{" "}
          <InlineCode>vite</InlineCode>, <InlineCode>tanstack-start</InlineCode>,{" "}
          <InlineCode>react-router</InlineCode>, <InlineCode>astro</InlineCode>, and{" "}
          <InlineCode>laravel</InlineCode> apps.
        </p>
      </DocsSection>

      <DocsSection
        title="Add components"
        description="After init, copy components from the registry into your app. Imports are rewritten to your local aliases."
      >
        <PackageManagerTabs command="add" description="Copy components into your app" />
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
