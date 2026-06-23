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
import { STYLE_PRESETS } from "../../../lib/create/presets";

const providerCode = `import "@cooud/tokens/styles.css";
import { CooudUIProvider } from "@cooud/theme";

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

const themeScriptCode = `import { CooudThemeScript, CooudUIProvider } from "@cooud/theme";

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script mutates <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <CooudThemeScript
          storageKey="cooud-ui-theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        />
      </head>
      <body>
        <CooudUIProvider asRoot storageKey="cooud-ui-theme">
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}`;

const overridesCode = `import { useTheme } from "@cooud/theme";

export function BrandThemeControls() {
  const { setOverrides } = useTheme();

  return (
    <button
      type="button"
      onClick={() =>
        setOverrides({
          radius: "16px",
          primary: "oklch(0.685 0.169 237.3)",
          chart1: "oklch(0.685 0.169 237.3)",
          fontDisplay: "Inter, sans-serif"
        })
      }
    >
      Apply brand theme
    </button>
  );
}`;

const layers = [
  {
    title: "Semantic tokens",
    description: "Components consume surface, foreground, border, ring, primary, and chart tokens.",
  },
  {
    title: "Preset bundles",
    description:
      "A preset combines mode, base color, brand color, chart palette, fonts, and radius.",
  },
  {
    title: "Runtime overrides",
    description:
      "Apps can override tokens at runtime without recompiling Tailwind or changing component code.",
  },
] as const;

export default function ThemingPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Theming"
        title="Theme the whole system through tokens"
        description="Cooud UI treats theme as a design-system object: color ramps, brand accents, chart colors, typography, and radius move together."
      >
        <PrimaryLink href="/create">Build a preset</PrimaryLink>
      </DocsHeader>

      <DocsSection title="Theme layers">
        <DocsGrid>
          {layers.map((layer) => (
            <DocsCard key={layer.title} title={layer.title} description={layer.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Provider"
        description="Import tokens once, then wrap the app in the provider at the framework root."
      >
        <CodeBlock code={providerCode} language="tsx" expandable />
      </DocsSection>

      <DocsSection
        title="Avoiding a flash of the wrong theme"
        description="The provider restores a saved theme from localStorage after first paint, so a returning visitor can briefly see the default theme. Render CooudThemeScript in the document head to apply the saved theme before paint."
      >
        <CodeBlock code={themeScriptCode} language="tsx" expandable />
        <DocCallout title="Pass the same storageKey to both">
          The script and <InlineCode>CooudUIProvider</InlineCode> must share the same{" "}
          <InlineCode>storageKey</InlineCode>. Add <InlineCode>suppressHydrationWarning</InlineCode>{" "}
          to <InlineCode>&lt;html&gt;</InlineCode> because the script changes its attributes before
          hydration. Under a strict CSP, forward a <InlineCode>nonce</InlineCode> to{" "}
          <InlineCode>CooudThemeScript</InlineCode>.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="Runtime overrides"
        description="Use runtime overrides for brand portals, per-tenant styling, previews, or Create-generated presets."
      >
        <CodeBlock code={overridesCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The Create studio exports the same values as preset JSON and CSS variables, so teams can
          store a design system and reapply it later.
        </p>
      </DocsSection>

      <DocsSection
        title="Preset catalog"
        description="These are the cohesive looks available in Create today."
      >
        <DocsGrid columns={2}>
          {STYLE_PRESETS.map((preset) => (
            <DocsCard
              key={preset.id}
              title={preset.name}
              description={preset.description}
              badge={`${preset.config.mode} / ${preset.config.radius}px`}
            >
              <p className="text-xs uppercase tracking-widest text-fg-tertiary">
                <InlineCode>{preset.config.baseColor}</InlineCode>{" "}
                <InlineCode>{preset.config.brand}</InlineCode>{" "}
                <InlineCode>{preset.config.chart}</InlineCode>
              </p>
            </DocsCard>
          ))}
        </DocsGrid>
      </DocsSection>
    </div>
  );
}
