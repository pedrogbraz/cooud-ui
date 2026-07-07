# cooud-ui (CLI)

Add Cooud UI components to your project, shadcn-style — you own the source.

```sh
npx cooud-ui init                 # write cooud-ui.json + lib/cn.ts + base copy deps
npx cooud-ui add button card      # copy components in (resolves dependencies)
npx cooud-ui add date-picker      # auto-pulls button, calendar, popover
npx cooud-ui list                 # list everything in the registry (alias: ls)
npx cooud-ui diff                 # show which installed components drifted
```

## Commands & flags

| Command            | Args               | Flags                                                            |
| ------------------ | ------------------ | --------------------------------------------------------------- |
| `init`             | —                  | `-c, --cwd <dir>` · `-r, --registry <source>` · `-y, --yes` · `--skip-install` |
| `add`              | `[components...]`  | `-c, --cwd <dir>` · `-r, --registry <source>` · `-o, --overwrite` · `--skip-install` |
| `list` (`ls`)      | —                  | `-c, --cwd <dir>` · `-r, --registry <source>`                   |
| `diff`             | `[components...]`  | `-c, --cwd <dir>` · `-r, --registry <source>`                   |

## How it works

- The registry (`registry/*.json`) is generated from the real `@cooud-ui/ui` sources by
  `packages/cli/scripts/build-registry.ts` — each item carries its source, its npm
  `dependencies`, and its `registryDependencies` (other components it imports),
  derived by parsing imports.
- The default registry is pinned to the CLI package version (`v0.2.0` here), not
  mutable `main`, so a published CLI reads the registry snapshot it was released
  with. Use `-r, --registry ./registry` when testing local registry changes before
  a release tag exists.
- `init` installs only the base copy dependencies used by generated components
  (`clsx`, `tailwind-merge`, `class-variance-authority`, and Radix Slot). It does
  not install the private/scoped Cooud token and theme packages unless you do that
  separately with registry access.
- `add` resolves the transitive closure of `registryDependencies`, writes the files
  into your project, and **rewrites imports to your aliases**:
  `../lib/cn.js → @/lib/cn`, `./button.js → @/components/ui/button`.
- It then installs the collected npm dependencies with your package manager
  (bun / pnpm / yarn / npm, auto-detected).

## Config (`cooud-ui.json`)

```json
{
  "aliases": { "ui": "@/components/ui", "lib": "@/lib" },
  "paths": { "ui": "components/ui", "lib": "lib" },
  "registry": "https://raw.githubusercontent.com/pedrogbraz/cooud-ui/v0.2.0/registry"
}
```

Point `-r, --registry <path-or-url>` at a local `registry/` directory for offline use
or testing. Regenerate the registry after changing components:
`bun run -F cooud-ui registry`. Verify it is in sync in CI with
`bun run -F cooud-ui registry:check`.
