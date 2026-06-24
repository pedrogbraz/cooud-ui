# cooud-ui-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for
**Cooud UI**. It lets MCP-compatible AI agents and assistants discover and fetch
Cooud UI components and blocks straight from the registry — so an agent can list
what's available, search it, and pull the exact source files (plus the
`npx cooud-ui add` command) while scaffolding a UI.

It speaks MCP over **stdio** and is the same registry the
[`cooud-ui`](https://www.npmjs.com/package/cooud-ui) CLI installs from.

## What it exposes

### Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `list_components` | — | All installable components (`registry:ui`): name, title, dependencies, and the install command. |
| `list_blocks` | — | All installable blocks (`registry:block`) — composed sections like hero, pricing, login, dashboard. |
| `search_registry` | `{ query: string }` | Components and blocks whose name (or readable title) matches `query` (case-insensitive substring). |
| `get_component` | `{ name: string }` | Full detail for one component **or** block: source `files` (path + content), npm `dependencies`, `registryDependencies`, and the install command. |
| `get_install_command` | `{ names: string[] }` | The `npx cooud-ui add ...` command for one or more items. |

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
| `COOUD_UI_REGISTRY` | The public Cooud UI registry for the pinned version. | Registry source override — either an `http(s)` base URL or a local directory path. Useful for testing a fork or an unpublished registry locally. |

The server fetches `index.json` for listings and `<name>.json` for item detail,
and caches both in memory for the lifetime of the process. All diagnostics are
written to **stderr**; **stdout** carries only the MCP protocol.

## Example agent flow

1. `search_registry { "query": "table" }` → finds `data-table`, `table`, `filter-bar`.
2. `get_component { "name": "data-table" }` → returns the `.tsx` source, its npm
   deps (`@tanstack/react-table`, …), its registry deps, and
   `npx cooud-ui add data-table`.
3. The agent writes the component, then runs the install command (which also
   pulls in the registry dependencies automatically).

## Development

```sh
bun run build      # tsc -> dist
bun run typecheck  # tsc --noEmit
bun run test       # vitest (tool logic, no network)
```

## License

MIT
