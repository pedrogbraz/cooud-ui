"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@cooud/ui";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
// Server-safe block metadata only — names, slugs, variant ids + descriptions.
// This deliberately avoids `lib/blocks/marketing` / `lib/blocks/application`,
// whose heavy composed preview JSX would defeat the dialog's lazy-load.
import { BLOCK_CATEGORIES } from "../../lib/blocks-index";
import { CATEGORIES, getComponentDisplayName } from "../../lib/components-index";
import { DOC_NAV_SECTIONS } from "../../lib/docs";

const docItems = DOC_NAV_SECTIONS.flatMap((section) => section.items);

/**
 * Hand-curated search aliases so the cmdk fuzzy match resolves the obvious
 * intent words people type that don't literally appear in a block/variant name
 * (e.g. "auth"/"sign in" → Login, "dashboard"/"kpi" → Stats). Keyed by block
 * slug; folded into each block's (and its variants') searchable `value`.
 */
const BLOCK_ALIASES: Record<string, string> = {
  hero: "landing header banner headline above the fold marketing splash",
  pricing: "plans tiers subscription billing cost price upgrade paywall",
  "feature-grid": "features capabilities benefits highlights icons grid",
  cta: "call to action banner conversion signup convert promo",
  stats: "dashboard kpi metrics analytics numbers overview reporting cards",
  login: "auth authentication sign in signin log in account credentials social oauth",
  settings: "preferences account profile configuration form options",
  team: "members people roster users collaborators roles avatars",
};

interface BlockSearchEntry {
  key: string;
  /** The cmdk `value`: packed with name, description, slug, category + aliases. */
  value: string;
  primary: string;
  secondary: string;
  href: string;
}

/**
 * Flatten every block — and every selectable variant — into individually
 * searchable entries pointing at `/blocks/[slug]` and `/blocks/[slug]/[variant]`.
 * Each `value` folds in the block name, category, slug and curated aliases so a
 * variant query ("split hero", "annual pricing", "compact summary") still
 * matches and routes precisely.
 */
const blockSearchEntries: BlockSearchEntry[] = BLOCK_CATEGORIES.flatMap((category) =>
  category.items.flatMap((block) => {
    const aliases = BLOCK_ALIASES[block.slug] ?? "";
    const blockTerms = `${block.name} ${block.description} ${block.slug} ${category.name} block ${aliases}`;

    const blockEntry: BlockSearchEntry = {
      key: block.slug,
      value: blockTerms,
      primary: block.name,
      secondary: block.description,
      href: `/blocks/${block.slug}`,
    };

    const variantEntries: BlockSearchEntry[] = (block.variants ?? []).map((variant) => ({
      key: `${block.slug}/${variant.id}`,
      // Variant value also carries the parent block terms so e.g. "hero split"
      // and "split" both resolve to this variant.
      value: `${variant.name} ${variant.description} ${variant.id} ${blockTerms} variation`,
      primary: `${block.name} · ${variant.name}`,
      secondary: variant.description,
      href: `/blocks/${block.slug}/${variant.id}`,
    }));

    return [blockEntry, ...variantEntries];
  }),
);

/**
 * The heavy half of the command palette: the cmdk-backed `CommandDialog` plus the
 * full documentation / component search index. This module is pulled in via
 * `next/dynamic` only after the user signals intent (clicking the search button
 * or pressing ⌘/Ctrl-K), so cmdk and the nav index never enter any page's
 * first-load JS. The parent owns `open` state, so opening triggers the import and
 * the dialog mounts already-open with no extra interaction.
 */
export default function CommandSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const onSelectComponent = useCallback(
    (slug: string) => {
      onOpenChange(false);
      router.push(`/components/${slug}`);
    },
    [router, onOpenChange],
  );

  const onSelectRoute = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search documentation"
      description="Find docs, components, studio routes, and release notes."
    >
      <CommandInput placeholder="Search documentation…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documentation">
          {docItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.label} ${item.description}`}
              onSelect={() => onSelectRoute(item.href)}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="text-sm text-fg">{item.label}</span>
              <span className="text-xs text-fg-tertiary">{item.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Studio">
          <CommandItem
            value="Create design-system studio"
            onSelect={() => onSelectRoute("/create")}
            className="flex flex-col items-start gap-0.5"
          >
            <span className="text-sm text-fg">Create</span>
            <span className="text-xs text-fg-tertiary">
              Build, save, shuffle, and export a complete design-system preset.
            </span>
          </CommandItem>
          <CommandItem
            value="Blocks browse all production-ready blocks gallery"
            onSelect={() => onSelectRoute("/blocks")}
            className="flex flex-col items-start gap-0.5"
          >
            <span className="text-sm text-fg">Blocks</span>
            <span className="text-xs text-fg-tertiary">Browse production-ready blocks.</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Blocks">
          {blockSearchEntries.map((entry) => (
            <CommandItem
              key={entry.key}
              value={entry.value}
              onSelect={() => onSelectRoute(entry.href)}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="text-sm text-fg">{entry.primary}</span>
              <span className="text-xs text-fg-tertiary">{entry.secondary}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {CATEGORIES.map((category) => (
          <CommandGroup key={category.slug} heading={category.name}>
            {category.items.map((item) => {
              const displayName = getComponentDisplayName(item.name);

              return (
                <CommandItem
                  key={item.slug}
                  value={displayName}
                  onSelect={() => onSelectComponent(item.slug)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="text-sm text-fg">{displayName}</span>
                  {item.description ? (
                    <span className="text-xs text-fg-tertiary">{item.description}</span>
                  ) : null}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
