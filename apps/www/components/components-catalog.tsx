"use client";

import { cn } from "@cooud-ui/ui";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, getComponentDisplayName } from "../lib/components-index";

/**
 * Flattened, server-safe catalog row for every component. Built once from the
 * lightweight `CATEGORIES` metadata — this page renders NO live previews, so it
 * never imports the heavy example families (recharts / forms / overlays). Each
 * card links to `/components/[slug]`, where the live previews stream in.
 */
const ALL_COMPONENTS = CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({
    slug: item.slug,
    name: item.name,
    displayName: getComponentDisplayName(item.name),
    description: item.description,
    category: category.name,
    categorySlug: category.slug,
  })),
);

const TOTAL = ALL_COMPONENTS.length;

const CATEGORY_FILTERS = [
  { slug: "all", name: "All", count: TOTAL },
  ...CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: category.items.length,
  })),
];

export function ComponentsCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const normalized = query.trim().toLowerCase();
  // Default view (no search, "All"): keep the grouped, anchor-linkable sections
  // so deep links like /components#forms still scroll to the right place.
  const isDefaultView = category === "all" && !normalized;

  const filtered = useMemo(() => {
    return ALL_COMPONENTS.filter((component) => {
      const matchesCategory = category === "all" || component.categorySlug === category;
      const matchesSearch =
        !normalized ||
        `${component.displayName} ${component.name} ${component.description} ${component.category}`
          .toLowerCase()
          .includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [category, normalized]);

  return (
    <div className="py-10">
      <header className="border-b border-border/60 pb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">
              All Components
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-fg-secondary">
              Explore the full library — {TOTAL} themeable, accessible components. Click any one to
              see variants, states and copy-paste code.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatPill label="Categories" value={CATEGORIES.length} />
            <StatPill label="Components" value={TOTAL} />
          </div>
        </div>
      </header>

      {/* Sticky filter toolbar: search + category chips, in reach while scrolling
          the long catalog. Sits just under the 4rem site nav. */}
      <div className="sticky top-16 z-10 border-b border-border/60 bg-surface-base/85 py-4 backdrop-blur supports-[backdrop-filter]:bg-surface-base/70">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search components</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components..."
              className="h-10 w-full rounded-xl border border-border bg-surface-inset pl-9 pr-3 text-sm text-fg outline-none placeholder:text-fg-tertiary focus:border-border-strong focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="-mx-6 flex items-center gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {CATEGORY_FILTERS.map((filter) => {
              const active = category === filter.slug;

              return (
                <button
                  key={filter.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(filter.slug)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-border-strong bg-surface-raised text-fg"
                      : "border-border bg-surface-inset text-fg-secondary hover:border-border-strong hover:text-fg",
                  )}
                >
                  <span>{filter.name}</span>
                  <span
                    className={cn("text-xs", active ? "text-fg-secondary" : "text-fg-tertiary")}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-8">
        <p className="text-sm text-fg-tertiary" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "component" : "components"}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface-raised p-10 text-center">
            <p className="text-sm text-fg-secondary">
              No components match {query ? `“${query.trim()}”` : "this filter"}.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-3 text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear filters
            </button>
          </div>
        ) : isDefaultView ? (
          <div className="mt-6 flex flex-col gap-12">
            {CATEGORIES.map((cat) => (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-36">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                  {cat.name}
                </h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {cat.items.map((item) => (
                    <ComponentCard
                      key={item.slug}
                      slug={item.slug}
                      displayName={getComponentDisplayName(item.name)}
                      description={item.description}
                      category={cat.name}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((component) => (
              <ComponentCard
                key={component.slug}
                slug={component.slug}
                displayName={component.displayName}
                description={component.description}
                category={component.category}
                showTag
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentCard({
  slug,
  displayName,
  description,
  category,
  showTag = false,
}: {
  slug: string;
  displayName: string;
  description: string;
  category: string;
  showTag?: boolean;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors hover:border-border-strong focus-within:ring-2 focus-within:ring-ring">
      {/* Lightweight thumbnail — a dotted-grid card with the component name. No
          live preview here (that lives on the /components/[slug] route). */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-border/60 bg-surface-inset/50 p-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(var(--cooud-border)_1px,transparent_1px)] opacity-50 [background-size:16px_16px]"
        />
        <span className="relative px-4 text-center font-display text-lg text-fg-tertiary transition-colors group-hover:text-fg">
          {displayName}
        </span>
      </div>
      <div className="flex flex-col gap-1 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-fg transition-colors group-hover:text-primary">
            {displayName}
          </span>
          {showTag ? (
            <span className="shrink-0 rounded-full border border-border bg-surface-inset px-2 py-0.5 text-xs font-medium text-fg-tertiary">
              {category}
            </span>
          ) : null}
        </div>
        <span className="line-clamp-1 text-sm text-fg-tertiary">{description}</span>
      </div>
      <Link
        href={`/components/${slug}`}
        aria-label={displayName}
        className="absolute inset-0 z-20 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-sm">
      <span className="font-semibold text-fg">{value}</span>
      <span className="text-fg-tertiary">{label}</span>
    </div>
  );
}
