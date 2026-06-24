import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";

const initCode = `npx cooud-ui@latest init`;

const providerCode = `import "@cooud-ui/tokens/styles.css";
import { CooudUIProvider } from "@cooud-ui/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CooudUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}`;

const addButtonCode = `npx cooud-ui add button`;

const useButtonCode = `import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-base">
      <Button>Get started</Button>
    </main>
  );
}`;

const themeToggleCode = `"use client";

import { Button } from "@cooud-ui/ui";
import { useTheme } from "@cooud-ui/theme";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}`;

const addBlockCode = `npx cooud-ui add login`;

const useBlockCode = `import { LoginBlock } from "@/components/blocks/login";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-base p-6">
      {/* Installed source — yours to edit, restyle, and wire up. */}
      <LoginBlock />
    </main>
  );
}`;

const nextSteps = [
  {
    title: "Components",
    description: "Browse the full catalog of primitives, with live previews and props.",
    href: "/components",
    action: "Browse components",
  },
  {
    title: "Blocks",
    description: "Composed sections — auth, dashboards, pricing — ready to drop into a page.",
    href: "/docs/blocks",
    action: "Read about blocks",
  },
  {
    title: "Theming",
    description: "Tokens, presets, runtime overrides, and flash-free dark mode.",
    href: "/docs/theming",
    action: "Theme the system",
  },
  {
    title: "Recipes",
    description: "Copy-paste patterns: validated forms, toasts, confirmations, and more.",
    href: "/docs/recipes",
    action: "Read recipes",
  },
  {
    title: "CLI",
    description: "init, add, list, and diff — the full registry command surface.",
    href: "/docs/cli",
    action: "Read CLI docs",
  },
] as const;

export default function GettingStartedPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Getting started"
        description="From an empty project to a themed UI in five steps: install, wrap your app, add a component, theme it, and drop in a block."
      >
        <PrimaryLink href="/components">Browse components</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="1. Install"
        description="Run init inside your project. The CLI is framework-agnostic and acts on the current directory — it writes cooud-ui.json, installs base dependencies, imports the tokens stylesheet, and wires the provider and config for you."
      >
        <CodeBlock code={initCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Prefer another package manager? Use <InlineCode>pnpm dlx cooud-ui@latest init</InlineCode>
          , <InlineCode>yarn dlx cooud-ui@latest init</InlineCode>, or{" "}
          <InlineCode>bunx cooud-ui@latest init</InlineCode>. Adding Cooud UI to an app you already
          have? See <PrimaryLink href="/docs/installation">Installation</PrimaryLink>.
        </p>
      </DocsSection>

      <DocsSection
        title="2. Wrap your app with the provider"
        description="Import the tokens stylesheet once, then wrap the app in CooudUIProvider at the framework root so every component shares the same theme."
      >
        <CodeBlock code={providerCode} language="tsx" expandable />
        <DocCallout title="Put it at the root">
          The provider belongs at the very top of your tree — the layout in Next.js, the root route
          in TanStack Start or React Router, or wherever your app mounts. To avoid a flash of the
          wrong theme on returning visitors, also render <InlineCode>CooudThemeScript</InlineCode>{" "}
          in the document head so the saved mode applies before paint. See{" "}
          <PrimaryLink href="/docs/theming">Theming</PrimaryLink> for the full no-FOUC setup.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="3. Add your first component"
        description="Copy a component into your app with add. The CLI writes the source and rewrites its imports to your local aliases, so you import it from your own components folder."
      >
        <CodeBlock code={addButtonCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          This writes <InlineCode>components/ui/button.tsx</InlineCode>. Import it and render it —
          it&apos;s already styled by the tokens the provider supplies.
        </p>
        <CodeBlock code={useButtonCode} language="tsx" expandable />
      </DocsSection>

      <DocsSection
        title="4. Theme it"
        description="Theme is a design-system object — colors, brand accents, fonts, and radius move together. Flip light and dark at runtime with the useTheme hook, which reads and persists the active mode through the provider."
      >
        <CodeBlock code={themeToggleCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Swap whole presets, override individual tokens at runtime, or build a look visually in
          Create. See <PrimaryLink href="/docs/theming">Theming</PrimaryLink> and{" "}
          <PrimaryLink href="/docs/styling">Styling</PrimaryLink> for the full API.
        </p>
      </DocsSection>

      <DocsSection
        title="5. Drop in a block"
        description="A component is a single primitive; a block is a whole section composed from primitives — a login screen, a pricing grid, a dashboard. Add one with the same command, then render it."
      >
        <CodeBlock code={addBlockCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          This writes <InlineCode>components/blocks/login.tsx</InlineCode> and installs the
          block&apos;s dependencies. The file is yours — edit the copy, swap the data, restyle with
          tokens.
        </p>
        <CodeBlock code={useBlockCode} language="tsx" expandable />
        <div className="mt-4">
          <PrimaryLink href="/blocks">Browse blocks</PrimaryLink>
        </div>
      </DocsSection>

      <DocsSection
        title="Where to go next"
        description="You have a themed app with a component and a block. Here is where to deepen each part."
      >
        <DocsGrid columns={2}>
          {nextSteps.map((step) => (
            <DocsCard
              key={step.title}
              title={step.title}
              description={step.description}
              href={step.href}
              action={step.action}
            />
          ))}
        </DocsGrid>
      </DocsSection>
    </div>
  );
}
