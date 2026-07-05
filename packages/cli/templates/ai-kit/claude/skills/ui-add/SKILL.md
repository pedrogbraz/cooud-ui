---
name: ui-add
description: Add a Cooud UI component or block to __APP_NAME__. Use whenever the user asks to build UI or add/create a component, section, page, form, table, dialog, dashboard, or any interface element — resolve the need to a registry slug and install it with `npx cooud-ui add` instead of hand-writing it.
allowed-tools: Bash, Read, Edit, Write
---

# Add a Cooud UI component or block

This app is built on Cooud UI. Prefer **installing** a component or block from the
registry over hand-rolling one. Installed items are copied into the project (source you
own), wired to the design tokens, accessible, and reduced-motion aware.

The thing the user wants to build: `$ARGUMENTS`

## 1. Resolve the need to a slug

Discover what exists before writing anything:

- If the **cooud-ui MCP server** is connected, use it — it is the same registry the CLI
  installs from:
  - `search_registry { "query": "<keyword>" }` to find matches,
  - `list_components` / `list_blocks` to browse,
  - `get_component { "name": "<slug>" }` for the source, deps, and exact install command.
- Otherwise run `npx cooud-ui list` to print the registry.

Pick the smallest thing that covers the need:

- **Components** are single primitives — `button`, `input`, `dialog`, `data-table`,
  `dropdown-menu`, `tabs`, `card`, `badge`.
- **Blocks** are composed sections — `hero`, `pricing`, `login`, `signup`, `dashboard`,
  `settings`, `checkout`, `payouts`, `faq`, `footer`, `navbar`. Reach for a block when the
  user describes a whole section or page, not a single control.

If several slugs together model the screen, install them together.

## 2. Install

```sh
npx cooud-ui add <slug> [<slug> ...]
```

This copies the source into `components/ui` (components) or `components/blocks` (blocks)
and **automatically pulls registry dependencies and npm dependencies**. Do not add those
by hand. Use `--overwrite` only when intentionally refreshing an existing file.

## 3. Wire it in

- Import from the local alias, not from the package: `@/components/ui/<name>` or
  `@/components/blocks/<name>`.
- Compose installed pieces; don't fork their internals unless the task requires it.

## 4. Respect the design system

- **Never inline raw colors, radii, or spacing.** Use the token-backed Tailwind classes
  the components already use (e.g. `bg-primary`, `text-muted-foreground`, `rounded-md`).
  Raw hex or arbitrary values break theming.
- **Honor `prefers-reduced-motion`.** Animated components default to `reducedMotion="user"`
  (they snap for users who opted out). Keep that default; don't force `"always"` without a
  clear reason.
- Keep accessibility intact — labels, roles, and focus states ship with the component.

## 5. Only hand-write when the registry has nothing

If discovery turns up no suitable component or block, build the new piece **out of
existing Cooud UI primitives** and the same tokens, matching their prop and a11y
conventions — never a bespoke, unthemed one-off.
