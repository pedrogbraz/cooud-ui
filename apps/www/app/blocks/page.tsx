import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "../../components/showcase-ui";
import {
  BLOCK_CATEGORIES,
  BLOCK_COUNT,
  BLOCK_VARIANT_COUNT,
  getBlockVariantMetas,
} from "../../lib/blocks-index";

export default function BlocksOverview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-10">
        <Eyebrow>Blocks</Eyebrow>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Ready-made sections
        </h1>
        <p className="max-w-2xl text-lg text-fg-secondary">
          {BLOCK_COUNT} block families and {BLOCK_VARIANT_COUNT} copy-paste variations composed from
          Cooud UI. Open a family, compare variations, then launch the live preview and source.
        </p>
      </header>

      <div className="flex flex-col gap-14 py-12">
        {BLOCK_CATEGORIES.map((category) => (
          <section key={category.slug}>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
              {category.name}
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {category.items.map((item) => {
                const variantCount = getBlockVariantMetas(item.slug).length;

                return (
                  <div
                    key={item.slug}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors hover:border-border-strong focus-within:ring-2 focus-within:ring-ring"
                  >
                    {/* Lightweight thumbnail: dotted-grid surface with the family
                        name. The blocks index renders NO live previews, so it never
                        imports the heavy application.tsx / marketing.tsx modules. The
                        live previews live on the /blocks/[slug] gallery. */}
                    <div className="relative flex h-56 items-center justify-center overflow-hidden border-b border-border/60 bg-surface-inset">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(var(--cooud-border)_1px,transparent_1px)] opacity-40 [background-size:16px_16px]"
                      />
                      <span className="relative font-display text-2xl font-semibold tracking-tight text-fg-tertiary transition-colors group-hover:text-fg">
                        {item.name}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-raised to-transparent" />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-fg transition-colors group-hover:text-primary">
                          {item.name}
                        </span>
                        <span className="line-clamp-1 text-sm text-fg-tertiary">
                          {item.description}
                        </span>
                        <span className="mt-1 text-xs text-fg-tertiary">
                          {variantCount} {variantCount === 1 ? "variation" : "variations"}
                        </span>
                      </div>
                      <ArrowRight
                        className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                        aria-hidden="true"
                      />
                    </div>
                    <Link
                      href={`/blocks/${item.slug}`}
                      aria-label={item.name}
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
