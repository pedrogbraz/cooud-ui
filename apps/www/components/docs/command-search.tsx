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
import { CATEGORIES } from "../../lib/components-index";

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

  const onSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/components/${slug}`);
    },
    [router],
  );

  return (
    <>
      <button
        type="button"
        aria-label="Search components"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
        className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface-inset px-3 text-xs text-fg-tertiary outline-none transition-colors hover:border-border-strong hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span>Search components…</span>
        <kbd className="ml-2 rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-fg-tertiary">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search components"
        description="Find a component and jump to its documentation."
      >
        <CommandInput placeholder="Search components…" />
        <CommandList>
          <CommandEmpty>No components found.</CommandEmpty>
          {CATEGORIES.map((category) => (
            <CommandGroup key={category.slug} heading={category.name}>
              {category.items.map((item) => (
                <CommandItem
                  key={item.slug}
                  value={item.name}
                  onSelect={() => onSelect(item.slug)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="text-sm text-fg">{item.name}</span>
                  {item.description ? (
                    <span className="text-xs text-fg-tertiary">{item.description}</span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
