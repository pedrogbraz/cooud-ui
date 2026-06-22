"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { type ExampleFamily, getExampleFamily } from "../../lib/examples/registry";

/**
 * Skeleton shown while a component's example *family* chunk streams in. Mirrors
 * the rhythm of `ExampleBlock` (heading + framed preview + code block) so the
 * detail page doesn't shift layout once the live examples hydrate.
 */
function ExamplesSkeleton() {
  return (
    <div className="flex flex-col gap-12" aria-hidden="true">
      {[0, 1].map((row) => (
        <section key={row} className="flex flex-col gap-4">
          <div className="h-6 w-40 animate-pulse rounded-md bg-surface-inset" />
          <div className="h-3 w-72 max-w-full animate-pulse rounded bg-surface-inset/70" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-surface-inset/50" />
          <div className="h-10 animate-pulse rounded-xl bg-surface-inset/60" />
        </section>
      ))}
    </div>
  );
}

type FamilyView = ComponentType<{ slug: string }>;

/**
 * One `next/dynamic` per family. The import specifiers are static (so the
 * bundler can split them), but only the family a slug belongs to is ever
 * imported — visiting `/components/button` pulls the buttons chunk and never
 * touches recharts, forms or overlays. `ssr: false` is intentionally NOT set:
 * the examples still server-render (showcase stays crawlable / no blank flash);
 * the win is that each family is a separate, route-scoped chunk instead of one
 * eager catalog barrel.
 */
const FAMILY_VIEWS: Record<ExampleFamily, FamilyView> = {
  buttons: dynamic(() => import("../../lib/examples/buttons"), { loading: ExamplesSkeleton }),
  forms: dynamic(() => import("../../lib/examples/forms"), { loading: ExamplesSkeleton }),
  "data-display": dynamic(() => import("../../lib/examples/data-display"), {
    loading: ExamplesSkeleton,
  }),
  feedback: dynamic(() => import("../../lib/examples/feedback"), { loading: ExamplesSkeleton }),
  overlays: dynamic(() => import("../../lib/examples/overlays"), { loading: ExamplesSkeleton }),
  navigation: dynamic(() => import("../../lib/examples/navigation"), { loading: ExamplesSkeleton }),
  "date-time": dynamic(() => import("../../lib/examples/date-time"), { loading: ExamplesSkeleton }),
  charts: dynamic(() => import("../../lib/examples/charts"), { loading: ExamplesSkeleton }),
  premium: dynamic(() => import("../../lib/examples/premium"), { loading: ExamplesSkeleton }),
};

export function ComponentExamples({ slug, displayName }: { slug: string; displayName: string }) {
  const family = getExampleFamily(slug);
  const FamilyView = family ? FAMILY_VIEWS[family] : undefined;

  if (!FamilyView) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface-inset/40 px-6 py-10 text-center text-sm text-fg-tertiary">
        Interactive examples for {displayName} are coming soon.
      </p>
    );
  }

  return <FamilyView slug={slug} />;
}
