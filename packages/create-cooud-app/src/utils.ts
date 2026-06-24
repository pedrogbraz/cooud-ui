/** Supported package managers, in detection-fallback order. */
export const PACKAGE_MANAGERS = ["bun", "npm", "pnpm", "yarn"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

// Minimal ANSI helpers — no dependency needed. Colors are dropped when stdout
// is not a TTY or NO_COLOR is set, so piped/CI output stays clean.
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const wrap = (open: number, close: number) => (s: string) =>
  useColor ? `[${open}m${s}[${close}m` : s;

export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  red: wrap(31, 39),
  cyan: wrap(36, 39),
  magenta: wrap(35, 39),
};

export const log = {
  intro(): void {
    process.stdout.write(`\n${c.magenta(c.bold("create-cooud-app"))}\n\n`);
  },
  step(msg: string): void {
    process.stdout.write(`${c.cyan("›")} ${msg}\n`);
  },
  ok(msg: string): void {
    process.stdout.write(`${c.green("✓")} ${msg}\n`);
  },
  warn(msg: string): void {
    process.stdout.write(`${c.yellow("!")} ${msg}\n`);
  },
  error(msg: string): void {
    process.stderr.write(`${c.red("✗")} ${msg}\n`);
  },
  outro(name: string, pm: PackageManager, installed: boolean): void {
    const dev = pm === "npm" ? "npm run dev" : `${pm} dev`;
    const install = pm === "yarn" ? "yarn" : `${pm} install`;
    const lines = [
      "",
      `${c.green(c.bold("Done!"))} Your Cooud UI app is ready in ${c.cyan(name)}.`,
      "",
      "Next steps:",
      `  ${c.dim("$")} cd ${name}`,
      ...(installed ? [] : [`  ${c.dim("$")} ${install}`]),
      `  ${c.dim("$")} ${dev}`,
      "",
      `Then open ${c.cyan("http://localhost:3000")}.`,
      "",
      `Add more components anytime:  ${c.dim("$")} npx cooud-ui add dialog table tabs`,
      "",
    ];
    process.stdout.write(`${lines.join("\n")}\n`);
  },
};

// npm's package-name rules (the spec subset we care about): optionally scoped,
// lowercase, URL-safe, may not start with "." or "_", <= 214 chars.
const SCOPED = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/** Validate that `name` is safe to use as an npm package name and a dir name. */
export function isValidProjectName(name: string): boolean {
  if (!name || name.length > 214) return false;
  if (name.trim() !== name) return false;
  // Reject path separators outright (a scoped name's single "/" is allowed by
  // the regex, but the literal dir is the unscoped trailing segment).
  if (name.includes("\\")) return false;
  return SCOPED.test(name);
}

/**
 * Derive the on-disk directory name from a (possibly scoped) package name:
 * "@acme/widget" → "widget", "my-app" → "my-app".
 */
export function dirNameFromProjectName(name: string): string {
  const slash = name.lastIndexOf("/");
  return slash === -1 ? name : name.slice(slash + 1);
}
