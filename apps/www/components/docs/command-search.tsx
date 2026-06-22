"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@cooud/ui";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CATEGORIES, getComponentDisplayName } from "../../lib/components-index";
import { DOC_NAV_SECTIONS } from "../../lib/docs";

const docItems = DOC_NAV_SECTIONS.flatMap((section) => section.items);

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const onSelectComponent = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/components/${slug}`);
    },
    [router],
  );

  const onSelectRoute = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <button
        type="button"
        aria-label="Search documentation"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
        className="inline-grid size-9 place-items-center rounded-lg border border-border bg-surface-inset text-xs text-fg-tertiary outline-none transition-colors hover:border-border-strong hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring xl:inline-flex xl:w-64 xl:justify-start xl:gap-2 xl:px-3"
      >
        <Search className="size-4 xl:size-3.5" aria-hidden="true" />
        <span className="hidden xl:inline">Search documentation…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-fg-tertiary xl:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
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
    </>
  );
}
