# cooud-ui (CLI)

Add Cooud UI components to your project, shadcn-style — you own the source.

```sh
npx cooud-ui init                 # create cooud-ui.json + lib/cn.ts + base deps
npx cooud-ui add button card      # copy components in (resolves dependencies)
npx cooud-ui add date-picker      # auto-pulls button, calendar, popover
npx cooud-ui list                 # list everything in the registry
npx cooud-ui diff                 # show which installed components drifted
```

## How it works

- The registry (`registry/*.json`) is generated from the real `@cooud/ui` sources by
  `packages/cli/scripts/build-registry.ts` — each item carries its source, its npm
  `dependencies`, and its `registryDependencies` (other components it imports),
  derived by parsing imports.
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
  "registry": "https://raw.githubusercontent.com/pedrogbraz/cooud-ui/main/registry"
}
```

Point `--registry <path-or-url>` at a local `registry/` directory for offline use or
testing. Regenerate the registry after changing components: `bun run -F @cooud/cli registry`.
