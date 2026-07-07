import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type Assistant, writeAiKit } from "@cooud-ui/ai-kit";
import type { Catalog, StackConfig } from "@cooud-ui/stack";
import {
  catalog as defaultCatalog,
  generateKickoff,
  generateStackJson,
  sanitizeProjectName,
} from "@cooud-ui/stack";
import { type PackageManager, packageManagerFromConfig, runCommand } from "./utils.js";
import { CREATE_STACK_VERSION } from "./version.js";

export interface ScaffoldStackOptions {
  targetDir: string;
  projectName: string;
  config: StackConfig;
  catalog?: Catalog;
}

export interface ScaffoldStackResult {
  fileCount: number;
  unsupported: string[];
}

function single(config: StackConfig, key: string): string | undefined {
  const value = config[key];
  return typeof value === "string" ? value : undefined;
}

function multi(config: StackConfig, key: string): string[] {
  const value = config[key];
  return Array.isArray(value) ? value : [];
}

function add(deps: Record<string, string>, name: string, range: string): void {
  deps[name] = range;
}

const COOUD_UI_VERSION_RANGE = `^${CREATE_STACK_VERSION}`;
const COOUD_UI_REGISTRY = `https://raw.githubusercontent.com/pedrogbraz/cooud-ui/v${CREATE_STACK_VERSION}/registry`;

function write(targetDir: string, rel: string, content: string): void {
  const path = join(targetDir, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function appDir(config: StackConfig): "app" | "src/app" {
  return single(config, "structure") === "structure-root" ? "app" : "src/app";
}

function aliasTarget(config: StackConfig): string | undefined {
  if (single(config, "importAlias") !== "import-alias") return undefined;
  return appDir(config).startsWith("src/") ? "./src/*" : "./*";
}

function cooudUiPaths(config: StackConfig): Record<"ui" | "lib" | "blocks", string> {
  const prefix = appDir(config).startsWith("src/") ? "src/" : "";
  return {
    ui: `${prefix}components/ui`,
    lib: `${prefix}lib`,
    blocks: `${prefix}components/blocks`,
  };
}

function packageJson(projectName: string, config: StackConfig): string {
  const isNext = single(config, "web") === "web-next";
  const isCooudUi = single(config, "ui") === "ui-cooud";
  const deps: Record<string, string> = {};
  const devDeps: Record<string, string> = {
    typescript: "^5.9.3",
  };

  if (isNext) {
    add(deps, "next", "16.2.6");
    add(deps, "react", "^19.2.0");
    add(deps, "react-dom", "^19.2.0");
    add(devDeps, "@types/node", "^22.10.0");
    add(devDeps, "@types/react", "^19.0.0");
    add(devDeps, "@types/react-dom", "^19.0.0");
  }

  if (isCooudUi) {
    add(deps, "@cooud-ui/theme", COOUD_UI_VERSION_RANGE);
    add(deps, "@cooud-ui/tokens", COOUD_UI_VERSION_RANGE);
    add(deps, "@cooud-ui/ui", COOUD_UI_VERSION_RANGE);
    add(devDeps, "@tailwindcss/postcss", "^4.3.0");
    add(devDeps, "tailwindcss", "^4.3.0");
  }

  if (multi(config, "addons").includes("addon-biome")) {
    add(devDeps, "@biomejs/biome", "^2.0.6");
  }

  if (single(config, "commitStyle") === "commit-conventional") {
    add(devDeps, "@commitlint/cli", "^20.2.0");
    add(devDeps, "@commitlint/config-conventional", "^20.2.0");
  }

  const scripts: Record<string, string> = isNext
    ? {
        dev: "next dev",
        build: "next build",
        start: "next start",
        typecheck: "tsc --noEmit",
      }
    : {
        dev: 'echo "Open KICKOFF.md and wire the selected framework scaffold."',
        build: "tsc --noEmit",
        typecheck: "tsc --noEmit",
      };

  if (multi(config, "addons").includes("addon-biome")) {
    scripts.lint = "biome check .";
    scripts.format = "biome format --write .";
  }
  if (single(config, "database") !== "db-none") {
    scripts["db:push"] = 'echo "Configure the selected database/ORM before syncing schema."';
  }

  return `${JSON.stringify(
    {
      name: projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts,
      dependencies: deps,
      devDependencies: devDeps,
    },
    null,
    2,
  )}\n`;
}

function tsconfig(config: StackConfig): string {
  const alias = aliasTarget(config);
  const strict = single(config, "tsStrict") === "ts-strict";
  const compilerOptions: Record<string, unknown> = {
    target: "ES2022",
    lib: ["dom", "dom.iterable", "ES2022"],
    allowJs: true,
    skipLibCheck: true,
    strict,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "preserve",
    incremental: true,
  };
  if (strict) {
    compilerOptions.noUncheckedIndexedAccess = true;
    compilerOptions.noImplicitOverride = true;
  }
  if (alias) compilerOptions.paths = { "@/*": [alias] };
  if (single(config, "web") === "web-next") compilerOptions.plugins = [{ name: "next" }];

  return `${JSON.stringify(
    {
      compilerOptions,
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  )}\n`;
}

function globalsCss(config: StackConfig): string {
  const app = appDir(config);
  const sourceNodeModules = app.startsWith("src/")
    ? "../../node_modules/@cooud-ui/ui/dist/**/*.js"
    : "../node_modules/@cooud-ui/ui/dist/**/*.js";
  const sourceApp = app.startsWith("src/") ? "../**/*.{ts,tsx}" : "./**/*.{ts,tsx}";
  return `@import "tailwindcss";
@import "@cooud-ui/tokens/styles.css";

@source "${sourceNodeModules}";
@source "${sourceApp}";
`;
}

function layoutTsx(projectName: string): string {
  return `import { CooudThemeScript, CooudUIProvider } from "@cooud-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "A Next.js app built with Cooud UI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CooudThemeScript storageKey="theme" defaultThemeName="aurora" defaultModeName="dark" />
      </head>
      <body>
        <CooudUIProvider
          asRoot
          storageKey="theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        >
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}
`;
}

function pageTsx(): string {
  return `import { Badge } from "@cooud-ui/ui/badge";
import { Button } from "@cooud-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cooud-ui/ui/card";

const metrics = [
  { label: "Revenue", value: "R$ 48.2k" },
  { label: "Active users", value: "2,318" },
  { label: "NPS", value: "72" },
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4">
        <Badge variant="primary" className="w-fit">
          Built with Cooud UI
        </Badge>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-fg">Your stack is ready</h1>
          <p className="max-w-prose text-fg-secondary">
            This app was scaffolded from the Cooud Stack Builder. Read KICKOFF.md before changing
            frameworks, databases, auth, payments, or design-system rules.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="gradient">Start building</Button>
          <Button variant="outline">Read KICKOFF.md</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle>{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-fg-secondary">
              Replace this with your real product data.
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
`;
}

function basicIndex(projectName: string): string {
  return `console.log("${projectName}: read KICKOFF.md and wire the selected framework scaffold.");
`;
}

function readme(projectName: string, config: StackConfig, unsupported: string[]): string {
  const pm = packageManagerFromConfig(config);
  const dev = pm === "npm" ? "npm run dev" : `${pm} dev`;
  const install = pm === "yarn" ? "yarn" : `${pm} install`;
  return `# ${projectName}

Generated by \`create-cooud-stack\`.

Read \`KICKOFF.md\` first. It is the source of truth for stack choices,
conventions, AI capabilities, guardrails, and Definition of Done.

## Run

\`\`\`sh
${install}
${dev}
\`\`\`

## Generated artifacts

- \`stack.json\` — machine-readable resolved stack.
- \`KICKOFF.md\` — handoff prompt for the coding agent.
- App starter files for the supported scaffold path.

${unsupported.length ? `## Manual follow-up\n\n${unsupported.map((item) => `- ${item}`).join("\n")}\n` : ""}
`;
}

function envExample(config: StackConfig): string | undefined {
  const lines: string[] = [];
  if (single(config, "database") !== "db-none") lines.push("DATABASE_URL=");
  if (single(config, "auth") !== "auth-none") lines.push("AUTH_SECRET=");
  if (single(config, "payments") !== "pay-none") {
    lines.push("PAYMENTS_SECRET_KEY=");
    lines.push("PAYMENTS_WEBHOOK_SECRET=");
  }
  return lines.length ? `${lines.join("\n")}\n` : undefined;
}

function assistantIds(config: StackConfig): Assistant[] {
  const picked = new Set<Assistant>();
  for (const id of multi(config, "assistants")) {
    if (id === "ai-claude-code") picked.add("claude");
    if (id === "ai-cursor") picked.add("cursor");
    if (id === "ai-copilot") picked.add("copilot");
    if (id === "ai-windsurf") picked.add("windsurf");
  }
  return [...picked];
}

function unsupportedNotes(config: StackConfig): string[] {
  const notes: string[] = [];
  if (single(config, "web") !== "web-next") {
    notes.push(
      "The selected web framework is captured in KICKOFF.md; this generator currently writes a runnable app only for Next.js.",
    );
  }
  if (
    single(config, "backend") !== "backend-none" &&
    single(config, "backend") !== "backend-fullstack-next"
  ) {
    notes.push("Add the selected dedicated backend service described in KICKOFF.md.");
  }
  if (single(config, "database") !== "db-none") {
    notes.push("Wire the selected database/ORM/provider before running db:push.");
  }
  if (single(config, "auth") !== "auth-none") {
    notes.push("Implement the selected auth provider and protect mutating routes.");
  }
  if (single(config, "payments") !== "pay-none") {
    notes.push("Implement payment webhooks server-side; never trust client-side amounts.");
  }
  return notes;
}

export function assertWritableTarget(targetDir: string): void {
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    throw new Error(`Directory "${targetDir}" already exists and is not empty.`);
  }
}

export function scaffoldStack(options: ScaffoldStackOptions): ScaffoldStackResult {
  const { targetDir, config, catalog = defaultCatalog } = options;
  const projectName = sanitizeProjectName(options.projectName);
  const unsupported = unsupportedNotes(config);
  let fileCount = 0;
  const emit = (rel: string, content: string | undefined): void => {
    if (content === undefined) return;
    write(targetDir, rel, content);
    fileCount += 1;
  };

  mkdirSync(targetDir, { recursive: true });
  emit("package.json", packageJson(projectName, config));
  emit("README.md", readme(projectName, config, unsupported));
  emit("KICKOFF.md", generateKickoff(config, projectName, catalog));
  emit("stack.json", `${generateStackJson(config, projectName)}\n`);
  emit(".gitignore", "node_modules\n.next\ndist\n.env*\n!.env.example\n.DS_Store\n");
  emit("tsconfig.json", tsconfig(config));
  emit(".env.example", envExample(config));

  if (single(config, "commitStyle") === "commit-conventional") {
    emit(
      "commitlint.config.cjs",
      'module.exports = { extends: ["@commitlint/config-conventional"] };\n',
    );
  }
  if (multi(config, "addons").includes("addon-biome")) {
    emit(
      "biome.json",
      `${JSON.stringify({ $schema: "https://biomejs.dev/schemas/2.0.6/schema.json", formatter: { enabled: true }, linter: { enabled: true } }, null, 2)}\n`,
    );
  }

  if (single(config, "web") === "web-next") {
    emit(
      "next.config.mjs",
      "/** @type {import('next').NextConfig} */\nconst nextConfig = {};\n\nexport default nextConfig;\n",
    );
    emit("postcss.config.mjs", 'export default { plugins: { "@tailwindcss/postcss": {} } };\n');
    const app = appDir(config);
    emit(`${app}/globals.css`, globalsCss(config));
    emit(`${app}/layout.tsx`, layoutTsx(projectName));
    emit(`${app}/page.tsx`, pageTsx());
    emit(
      "cooud-ui.json",
      `${JSON.stringify(
        {
          aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
          paths: cooudUiPaths(config),
          registry: COOUD_UI_REGISTRY,
          theme: { name: "aurora", mode: "dark" },
        },
        null,
        2,
      )}\n`,
    );
  } else {
    emit("src/index.ts", basicIndex(projectName));
  }

  const assistants = assistantIds(config);
  if (assistants.length > 0) {
    const { written } = writeAiKit({
      targetDir,
      name: projectName,
      assistants,
      preset: "standard",
    });
    fileCount += written.length;
  }

  return { fileCount, unsupported };
}

export function initGit(cwd: string): void {
  runCommand("git", ["init"], cwd);
}

export function runInstall(pm: PackageManager, cwd: string): void {
  runCommand(pm, ["install"], cwd);
}
