/**
 * Generates the copy-paste registry consumed by the `cooud-ui add` CLI.
 * Reads the real @cooud-ui/ui component sources, derives npm + cross-component
 * dependencies by parsing imports, and writes registry/*.json at the repo root.
 *
 * Run from anywhere:  bun run packages/cli/scripts/build-registry.ts
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const uiRoot = join(repoRoot, "packages/ui");
const componentsDir = join(uiRoot, "src/components");
const cnFile = join(uiRoot, "src/lib/cn.ts");
const blocksDir = join(repoRoot, "apps/www/lib/blocks");

/** Committed registry output directory. */
export const outDir = join(repoRoot, "registry");

interface PkgJson {
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface RegistryFile {
  path: string;
  content: string;
  target: "ui" | "lib" | "block";
}
interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:lib" | "registry:block";
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

const IGNORED_NPM = new Set(["react", "react-dom", "react/jsx-runtime"]);

const VALID_TYPES = new Set(["registry:ui", "registry:lib", "registry:block"]);
const VALID_TARGETS = new Set(["ui", "lib", "block"]);

/**
 * Installable product blocks. Each entry maps a registry slug to the family
 * source file under `apps/www/lib/blocks/` and the exported template-literal
 * const that holds the block's copy-paste source. The source is TS-parsed out
 * of these files (never imported) so block generation never pulls in React.
 */
const BLOCK_MANIFEST: ReadonlyArray<{ slug: string; file: string; constName: string }> = [
  { slug: "hero", file: "marketing.tsx", constName: "heroCode" },
  { slug: "pricing", file: "marketing.tsx", constName: "pricingCode" },
  { slug: "feature-grid", file: "marketing.tsx", constName: "featureGridCode" },
  { slug: "cta", file: "marketing.tsx", constName: "ctaCode" },
  { slug: "testimonials", file: "marketing.tsx", constName: "testimonialsCode" },
  { slug: "faq", file: "marketing.tsx", constName: "faqCode" },
  { slug: "footer", file: "marketing.tsx", constName: "footerCode" },
  { slug: "navbar", file: "marketing.tsx", constName: "navbarCode" },
  { slug: "login", file: "auth.tsx", constName: "loginCode" },
  { slug: "signup", file: "auth.tsx", constName: "signupCode" },
  { slug: "forgot-password", file: "auth.tsx", constName: "forgotPasswordCode" },
  { slug: "otp", file: "auth.tsx", constName: "otpCode" },
  { slug: "magic-link", file: "auth.tsx", constName: "magicLinkCode" },
  { slug: "stats", file: "application.tsx", constName: "statsCode" },
  { slug: "settings", file: "application.tsx", constName: "settingsCode" },
  { slug: "team", file: "application.tsx", constName: "teamCode" },
  { slug: "welcome", file: "onboarding.tsx", constName: "welcomeCode" },
  { slug: "setup-wizard", file: "onboarding.tsx", constName: "setupWizardCode" },
  { slug: "setup-checklist", file: "onboarding.tsx", constName: "setupChecklistCode" },
  { slug: "dashboard", file: "dashboard.tsx", constName: "dashboardAnalyticsCode" },
  { slug: "billing", file: "billing.tsx", constName: "subscriptionCode" },
  { slug: "manage-subscription", file: "billing.tsx", constName: "manageSubscriptionCode" },
  { slug: "payment-method", file: "billing.tsx", constName: "paymentMethodCode" },
  { slug: "usage-dashboard", file: "billing.tsx", constName: "usageDashboardCode" },
  { slug: "cancel-flow", file: "billing.tsx", constName: "cancelFlowCode" },
  { slug: "checkout", file: "commerce.tsx", constName: "checkoutCode" },
  { slug: "payouts", file: "commerce.tsx", constName: "payoutsCode" },
  { slug: "product-grid", file: "commerce.tsx", constName: "productGridCode" },
  { slug: "invoice", file: "commerce.tsx", constName: "invoiceCode" },
  { slug: "page-header", file: "page-sections.tsx", constName: "pageHeaderCode" },
  { slug: "filter-bar", file: "page-sections.tsx", constName: "filterBarCode" },
  { slug: "empty-state", file: "page-sections.tsx", constName: "emptyStateCode" },
];

/**
 * Hand-rolled schema validation (no extra deps): every emitted item must carry a
 * non-empty `name`, a known `type`, string[] `dependencies`/`registryDependencies`,
 * and at least one file with a non-empty `path`, string `content`, and valid `target`.
 * Throws a clear, item-scoped Error so registry generation fails loudly on drift.
 */
function validateItem(item: RegistryItem): void {
  const where = item?.name ? `item "${item.name}"` : "item (missing name)";
  if (typeof item.name !== "string" || item.name.length === 0) {
    throw new Error(`${where}: "name" must be a non-empty string`);
  }
  if (!VALID_TYPES.has(item.type)) {
    throw new Error(`${where}: "type" must be one of ${[...VALID_TYPES].join(", ")}`);
  }
  if (!Array.isArray(item.dependencies) || item.dependencies.some((d) => typeof d !== "string")) {
    throw new Error(`${where}: "dependencies" must be a string[]`);
  }
  if (
    !Array.isArray(item.registryDependencies) ||
    item.registryDependencies.some((d) => typeof d !== "string")
  ) {
    throw new Error(`${where}: "registryDependencies" must be a string[]`);
  }
  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`${where}: "files" must be a non-empty array`);
  }
  for (const f of item.files) {
    if (typeof f.path !== "string" || f.path.length === 0) {
      throw new Error(`${where}: a file is missing a non-empty "path"`);
    }
    if (typeof f.content !== "string") {
      throw new Error(`${where}: file "${f.path}" is missing string "content"`);
    }
    if (!VALID_TARGETS.has(f.target)) {
      throw new Error(
        `${where}: file "${f.path}" has invalid "target" (expected ${[...VALID_TARGETS].join(
          " | ",
        )})`,
      );
    }
  }
}

function packageNameOf(spec: string): string {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/");
  return spec.split("/")[0] ?? spec;
}

function parseImports(content: string): string[] {
  const specs: string[] = [];
  const re = /(?:from|import)\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null = re.exec(content);
  while (m !== null) {
    if (m[1]) specs.push(m[1]);
    m = re.exec(content);
  }
  return specs;
}

/**
 * TS-parse a block family file and return the cooked source held by `constName`.
 * The const must be a top-level `const <constName> = \`...\`` whose initializer is
 * a plain (no-substitution) template literal; we return its `.text` (the exact
 * block source). Throws a clear, slug-scoped Error if the const is missing or its
 * initializer is anything else, so future source drift fails the build loudly.
 */
function extractBlockSource(
  filePath: string,
  fileText: string,
  constName: string,
  slug: string,
): string {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  let source: string | null = null;
  let sawConst = false;

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(sourceFile) !== constName) continue;
      sawConst = true;
      const initializer = declaration.initializer;
      if (initializer && ts.isNoSubstitutionTemplateLiteral(initializer)) {
        source = initializer.text;
      }
    }
  }

  if (source === null) {
    const reason = sawConst
      ? `its initializer is not a plain (no-substitution) template literal`
      : `the const was not found`;
    throw new Error(
      `block "${slug}": cannot extract source from ${basename(filePath)} — ${reason} (expected \`const ${constName} = \`...\`\`)`,
    );
  }
  return source;
}

/** Read the @cooud-ui/ui sources and derive the full, validated set of registry items. */
export async function buildItems(): Promise<RegistryItem[]> {
  const pkg = JSON.parse(await readFile(join(uiRoot, "package.json"), "utf8")) as PkgJson;
  const versions = { ...pkg.dependencies, ...pkg.peerDependencies };
  const resolveDep = (name: string): string => {
    const v = versions[name];
    return v ? `${name}@${v}` : name;
  };

  // Component sources only — never ship test/spec/story files into the registry
  // (their imports would otherwise be parsed as bogus npm dependencies).
  const entries = (await readdir(componentsDir))
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|spec|stories)\.tsx?$/.test(f))
    .sort();

  const items: RegistryItem[] = [];

  // The shared cn() lib item.
  const cnContent = await readFile(cnFile, "utf8");
  items.push({
    name: "cn",
    type: "registry:lib",
    dependencies: [resolveDep("clsx"), resolveDep("tailwind-merge")],
    registryDependencies: [],
    files: [{ path: "cn.ts", content: cnContent, target: "lib" }],
  });

  for (const file of entries) {
    const name = basename(file, extname(file));
    const content = await readFile(join(componentsDir, file), "utf8");
    const npm = new Set<string>();
    const reg = new Set<string>();

    for (const spec of parseImports(content)) {
      if (spec === "../lib/cn.js") {
        reg.add("cn");
      } else if (spec.startsWith("./")) {
        reg.add(spec.replace(/^\.\//, "").replace(/\.js$/, ""));
      } else if (!spec.startsWith(".")) {
        const pkgName = packageNameOf(spec);
        if (!IGNORED_NPM.has(pkgName)) npm.add(resolveDep(pkgName));
      }
    }

    items.push({
      name,
      type: "registry:ui",
      dependencies: [...npm].sort(),
      registryDependencies: [...reg].sort(),
      files: [{ path: file, content, target: "ui" }],
    });
  }

  // Installable blocks: copy-paste product sections that depend on the published
  // @cooud-ui/ui PACKAGE (not on copied component files), so they carry npm
  // `dependencies` only and an empty `registryDependencies`. Their source is
  // TS-parsed out of the app's block family files — never imported/executed.
  const uiPackage = `@cooud-ui/ui@${pkg.version ?? "latest"}`;
  const blockSources = new Map<string, string>();
  for (const block of BLOCK_MANIFEST) {
    const filePath = join(blocksDir, block.file);
    let fileText = blockSources.get(filePath);
    if (fileText === undefined) {
      fileText = await readFile(filePath, "utf8");
      blockSources.set(filePath, fileText);
    }
    const source = extractBlockSource(filePath, fileText, block.constName, block.slug);

    // @cooud-ui/ui is a bare import in every block but is not in the ui package's
    // own dependency map, so pin it explicitly to the ui package version.
    const npm = new Set<string>([uiPackage]);
    for (const spec of parseImports(source)) {
      if (spec.startsWith(".")) continue;
      const pkgName = packageNameOf(spec);
      if (pkgName === "@cooud-ui/ui" || IGNORED_NPM.has(pkgName)) continue;
      npm.add(resolveDep(pkgName));
    }

    items.push({
      name: block.slug,
      type: "registry:block",
      dependencies: [...npm].sort(),
      registryDependencies: [],
      files: [{ path: `${block.slug}.tsx`, content: source, target: "block" }],
    });
  }

  // Validate every item (schema + duplicate-name guard) before anything ships.
  const seenNames = new Set<string>();
  for (const item of items) {
    validateItem(item);
    if (seenNames.has(item.name)) {
      throw new Error(`duplicate registry item name: "${item.name}"`);
    }
    seenNames.add(item.name);
  }

  return items;
}

/**
 * Serialize items to the exact file map written to disk:
 * `{ "index.json": "...", "<name>.json": "..." }` — newline-terminated JSON,
 * matching `writeFile` output byte-for-byte so checks can diff in memory.
 */
export function serializeRegistry(items: RegistryItem[]): Record<string, string> {
  const out: Record<string, string> = {};
  const index = items.map(({ name, type, dependencies, registryDependencies }) => ({
    name,
    type,
    dependencies,
    registryDependencies,
  }));
  out["index.json"] = `${JSON.stringify(index, null, 2)}\n`;
  for (const item of items) {
    out[`${item.name}.json`] = `${JSON.stringify(item, null, 2)}\n`;
  }
  return out;
}

export async function writeRegistry(targetDir: string, items: RegistryItem[]): Promise<void> {
  await mkdir(targetDir, { recursive: true });
  const files = serializeRegistry(items);
  for (const [file, content] of Object.entries(files)) {
    await writeFile(join(targetDir, file), content, "utf8");
  }
}

async function main() {
  const items = await buildItems();
  await writeRegistry(outDir, items);
  console.log(`registry: wrote ${items.length} items + index.json to ${outDir}`);
}

// Only run when invoked directly (not when imported by check-registry.ts).
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
