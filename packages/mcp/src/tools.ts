import type { RegistryClient, RegistryIndexEntry, RegistryItem } from "./registry.js";

/** The CLI invoked to install registry items into a consumer project. */
export const ADD_COMMAND = "npx cooud-ui add";

/**
 * Build the `npx cooud-ui add <names...>` command for one or more items.
 * Names are emitted in the given order, de-duplicated, preserving the first
 * occurrence. Throws on an empty list so callers surface a clear error.
 */
export function buildInstallCommand(names: string[]): string {
  const cleaned: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const name = raw.trim();
    if (name.length === 0 || seen.has(name)) continue;
    seen.add(name);
    cleaned.push(name);
  }
  if (cleaned.length === 0) {
    throw new Error("Provide at least one component or block name.");
  }
  return `${ADD_COMMAND} ${cleaned.join(" ")}`;
}

/**
 * Derive a short, human-readable label from a registry item name
 * (e.g. "alert-dialog" -> "Alert Dialog"). The registry index carries no
 * descriptions, so this gives agents a readable title without inventing prose.
 */
export function humanizeName(name: string): string {
  return name
    .split(/[-_]/g)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** A registry item as summarised for `list_*` / `search_registry` results. */
export interface ItemSummary {
  name: string;
  type: RegistryIndexEntry["type"];
  /** A readable label derived from the name. */
  title: string;
  dependencies: string[];
  registryDependencies: string[];
  /** The command that installs this item. */
  install: string;
}

function summarise(entry: RegistryIndexEntry): ItemSummary {
  return {
    name: entry.name,
    type: entry.type,
    title: humanizeName(entry.name),
    dependencies: entry.dependencies,
    registryDependencies: entry.registryDependencies,
    install: buildInstallCommand([entry.name]),
  };
}

/** Output of {@link listComponents}. */
export interface ListResult {
  count: number;
  items: ItemSummary[];
}

/** List installable UI components (registry items of type `registry:ui`). */
export async function listComponents(client: RegistryClient): Promise<ListResult> {
  const index = await client.index();
  const items = index.filter((entry) => entry.type === "registry:ui").map(summarise);
  return { count: items.length, items };
}

/** List installable blocks (registry items of type `registry:block`). */
export async function listBlocks(client: RegistryClient): Promise<ListResult> {
  const index = await client.index();
  const items = index.filter((entry) => entry.type === "registry:block").map(summarise);
  return { count: items.length, items };
}

/** Output of {@link searchRegistry}. */
export interface SearchResult extends ListResult {
  query: string;
}

/**
 * Fuzzy-filter components and blocks by name (case-insensitive substring on the
 * raw name and its humanized title). The lib primitive (`cn`) is excluded — it
 * is pulled in automatically as a dependency, not something agents add directly.
 */
export async function searchRegistry(client: RegistryClient, query: string): Promise<SearchResult> {
  const index = await client.index();
  const needle = query.trim().toLowerCase();
  const items = index
    .filter((entry) => entry.type === "registry:ui" || entry.type === "registry:block")
    .filter((entry) => {
      if (needle.length === 0) return true;
      const haystack = `${entry.name} ${humanizeName(entry.name)}`.toLowerCase();
      return haystack.includes(needle);
    })
    .map(summarise);
  return { query, count: items.length, items };
}

/** Output of {@link getComponent}. */
export interface ComponentDetail {
  name: string;
  type: RegistryItem["type"];
  title: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryItem["files"];
  /** The command that installs this item (and its registry dependencies). */
  install: string;
}

/**
 * Fetch the full detail for a single component or block: its source file(s),
 * npm `dependencies`, `registryDependencies`, and the install command.
 */
export async function getComponent(client: RegistryClient, name: string): Promise<ComponentDetail> {
  const item = await client.item(name);
  return {
    name: item.name,
    type: item.type,
    title: humanizeName(item.name),
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files,
    install: buildInstallCommand([item.name]),
  };
}

/** Output of {@link getInstallCommand}. */
export interface InstallCommandResult {
  names: string[];
  command: string;
}

/** Build the install command for one or more component/block names. */
export function getInstallCommand(names: string[]): InstallCommandResult {
  const command = buildInstallCommand(names);
  return { names, command };
}
