"use client";

import Link from "next/link";
import { CATEGORIES, getComponentDisplayName } from "../../lib/components-index";
import { EXAMPLES } from "../../lib/examples";

export default function ComponentsOverview() {
  return (
    <div className="py-10">
      <header className="border-b border-border/60 pb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">
          All Components
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-fg-secondary">
          Explore the full library — {CATEGORIES.reduce((n, c) => n + c.items.length, 0)} themeable,
          accessible components. Click any one to see variants, states and copy-paste code.
        </p>
      </header>

      <div className="flex flex-col gap-14 py-10">
        {CATEGORIES.map((category) => (
          <section key={category.slug} id={category.slug} className="scroll-mt-24">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
              {category.name}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {category.items.map((item) => {
                const preview = EXAMPLES[item.slug]?.[0]?.preview;
                const displayName = getComponentDisplayName(item.name);

                return (
                  <div
                    key={item.slug}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors hover:border-border-strong focus-within:ring-2 focus-within:ring-ring"
                  >
                    <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-border/60 bg-surface-inset/50 p-6">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(var(--cooud-border)_1px,transparent_1px)] opacity-50 [background-size:16px_16px]"
                      />
                      <div className="pointer-events-none relative flex max-h-full max-w-full scale-90 flex-wrap items-center justify-center gap-2">
                        {preview ?? (
                          <span className="font-display text-lg text-fg-tertiary">
                            {displayName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-5 py-4">
                      <span className="font-medium text-fg transition-colors group-hover:text-primary">
                        {displayName}
                      </span>
                      <span className="line-clamp-1 text-sm text-fg-tertiary">
                        {item.description}
                      </span>
                    </div>
                    {/* Full-card link overlay — sibling of the preview, so previews
                        that contain their own anchors never nest inside an <a>. */}
                    <Link
                      href={`/components/${item.slug}`}
                      aria-label={displayName}
                      className="absolute inset-0 z-20 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
