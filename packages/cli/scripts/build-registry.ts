/**
 * Generates the copy-paste registry consumed by the `cooud-ui add` CLI.
 * Reads the real @cooud/ui component sources, derives npm + cross-component
 * dependencies by parsing imports, and writes registry/*.json at the repo root.
 *
 * Run from anywhere:  bun run packages/cli/scripts/build-registry.ts
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const uiRoot = join(repoRoot, "packages/ui");
const componentsDir = join(uiRoot, "src/components");
const cnFile = join(uiRoot, "src/lib/cn.ts");
const outDir = join(repoRoot, "registry");

interface PkgJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface RegistryFile {
  path: string;
  content: string;
  target: "ui" | "lib";
}
interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:lib";
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

const IGNORED_NPM = new Set(["react", "react-dom", "react/jsx-runtime"]);

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

async function main() {
  const pkg = JSON.parse(await readFile(join(uiRoot, "package.json"), "utf8")) as PkgJson;
  const versions = { ...pkg.dependencies, ...pkg.peerDependencies };
  const resolveDep = (name: string): string => {
    const v = versions[name];
    return v ? `${name}@${v}` : name;
  };

  const entries = (await readdir(componentsDir)).filter((f) => /\.(tsx?|ts)$/.test(f)).sort();

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

  await mkdir(outDir, { recursive: true });

  const index = items.map(({ name, type, dependencies, registryDependencies }) => ({
    name,
    type,
    dependencies,
    registryDependencies,
  }));
  await writeFile(join(outDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");

  for (const item of items) {
    await writeFile(
      join(outDir, `${item.name}.json`),
      `${JSON.stringify(item, null, 2)}\n`,
      "utf8",
    );
  }

  console.log(`registry: wrote ${items.length} items + index.json to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
