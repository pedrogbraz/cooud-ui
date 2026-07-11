# cooud-ui-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for
**Cooud UI**. It lets MCP-compatible AI agents and assistants discover, fetch,
and **install** Cooud UI components and blocks straight from the registry — so
an agent can list what's available, search it, pull the exact source files, and
add items (or apply a Create Studio theme) to the project it is working in.

It speaks MCP over **stdio** and is the same registry the
[`cooud-ui`](https://www.npmjs.com/package/cooud-ui) CLI installs from.

## What it exposes

### Read-only tools

| Tool | Input | Returns |
| --- | --- | --- |
| `list_components` | — | All installable components (`registry:ui`): name, title, dependencies, and the install command. |
| `list_blocks` | — | All installable blocks (`registry:block`) — composed sections like hero, pricing, login, dashboard. |
| `search_registry` | `{ query: string }` | Components and blocks whose name (or readable title) matches `query` (case-insensitive substring). |
| `get_component` | `{ name: string }` | Full detail for one component **or** block: source `files` (path + content), npm `dependencies`, `registryDependencies`, and the install command. |
| `get_install_command` | `{ names: string[] }` | The `npx cooud-ui add ...` command for one or more items. |

These are annotated `readOnlyHint: true` — they never touch the project.

### Write tools

| Tool | Input | Does |
| --- | --- | --- |
| `install_component` | `{ names: string[], overwrite?: boolean, skipInstall?: boolean }` | Runs `cooud-ui add <names...>` in the project: writes the component/block source files, resolves registry dependencies, and installs npm dependencies with the project's package manager. Existing files are skipped unless `overwrite` is set. |
| `apply_theme` | `{ source: string, dryRun?: boolean }` | Runs `cooud-ui theme add <source>` in the project: updates the app layout's theme attributes, writes the theme override block into the global stylesheet, and records the theme in `cooud-ui.json`. `source` is a Create Studio permalink, a bare `c=` payload, or an exported theme JSON file. `dryRun` previews without writing. |

Both return a structured JSON result: `status` (`success` / `failed` /
`timeout`), the detected `projectRoot`, the exact `command` that ran, the parsed
report (files written/skipped, dependency state, theme changes), and the CLI's
verbatim `stdout`/`stderr`. They are annotated as non-read-only
(`destructiveHint: true`, `idempotentHint: true`).

#### How writes work (security)

The server itself never writes files. Both write tools **only** spawn the
version-pinned `cooud-ui` CLI — `bunx --bun cooud-ui@<the server's own version>`
(falling back to `npx -y`) — so the code that touches your project is exactly
the published CLI release matching the server, resolving from the same pinned
registry the read tools describe. The child runs at the detected project root
(the nearest directory with a `cooud-ui.json`, else the nearest `package.json`,
walking up from the server's working directory), with a 120s timeout. Item
names are validated as registry slugs and theme sources may not look like
flags, so tool arguments can never smuggle extra CLI options. The project must
be initialised first (`npx cooud-ui init`); otherwise the tools fail with a
clear error and write nothing.

### Resources

| Resource | URI | Description |
| --- | --- | --- |
| `registry-index` | `cooud-ui://registry/index` | The full registry listing (every component and block with its dependencies) as JSON. |

## Setup

The server runs with `npx` — no global install needed.

### Claude Code

```sh
claude mcp add cooud-ui -- npx -y cooud-ui-mcp
```

### Cursor / Windsurf (and other clients that use an `mcpServers` JSON)

Add this to your MCP config (e.g. `~/.cursor/mcp.json`, or a project
`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "cooud-ui": {
      "command": "npx",
      "args": ["-y", "cooud-ui-mcp"]
    }
  }
}
```

To point at a different registry, add an `env` block (see below):

```json
{
  "mcpServers": {
    "cooud-ui": {
      "command": "npx",
      "args": ["-y", "cooud-ui-mcp"],
      "env": { "COOUD_UI_REGISTRY": "/absolute/path/to/registry" }
    }
  }
}
```

## Configuration

| Env var | Default | Description |
| --- | --- | --- |
| `COOUD_UI_REGISTRY` | The public Cooud UI registry for the pinned version. | Registry source override — either an `http(s)` base URL or a local directory path. Useful for testing a fork or an unpublished registry locally. Also forwarded to the CLI by `install_component` (`--registry`). |
| `COOUD_MCP_CLI_CMD` | `bunx --bun cooud-ui@<version>`, then `npx -y cooud-ui@<version>` | Launcher override for the write tools (whitespace-split), e.g. `bun /repo/packages/cli/src/index.ts` to run a local CLI checkout. |
| `COOUD_MCP_CLI_TIMEOUT_MS` | `120000` | Wall-clock budget for one CLI run made by a write tool. |

The server fetches `index.json` for listings and `<name>.json` for item detail,
and caches both in memory for the lifetime of the process. All diagnostics are
written to **stderr**; **stdout** carries only the MCP protocol.

## Example agent flow

1. `search_registry { "query": "table" }` → finds `data-table`, `table`, `filter-bar`.
2. `get_component { "name": "data-table" }` → returns the `.tsx` source, its npm
   deps (`@tanstack/react-table`, …), its registry deps, and
   `npx cooud-ui add data-table`.
3. `install_component { "names": ["data-table"] }` → the pinned CLI writes the
   files into the project, pulls in the registry dependencies, and installs the
   npm packages — the result lists every file written.

## Development

```sh
bun run build      # tsc -> dist
bun run typecheck  # tsc --noEmit
bun run test       # vitest (tool logic, no network)
```

## License

MIT
