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
import { CATEGORIES, getComponentDisplayName } from "../../lib/components-index";
import { DOC_NAV_SECTIONS } from "../../lib/docs";

const docItems = DOC_NAV_SECTIONS.flatMap((section) => section.items);

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
            value="Blocks"
            onSelect={() => onSelectRoute("/blocks")}
            className="flex flex-col items-start gap-0.5"
          >
            <span className="text-sm text-fg">Blocks</span>
            <span className="text-xs text-fg-tertiary">Browse production-ready blocks.</span>
          </CommandItem>
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
