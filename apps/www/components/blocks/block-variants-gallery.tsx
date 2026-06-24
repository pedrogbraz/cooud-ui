"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { type BlockFamily, getBlockFamily } from "../../lib/blocks/registry";

/** Skeleton shown while a block family chunk streams in for the gallery. */
function GallerySkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)]" aria-hidden="true">
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-inset/70" />
          <div className="h-10 w-72 max-w-full animate-pulse rounded-lg bg-surface-inset" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface-inset/70" />
        </div>
      </div>
      <div className="mx-auto grid max-w-[92rem] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[28rem] animate-pulse rounded-2xl border border-border bg-surface-inset/50"
          />
        ))}
      </div>
    </div>
  );
}

type GalleryView = ComponentType<{ slug: string }>;

// One next/dynamic per family; only the family a slug belongs to is imported,
// so the gallery route never loads the *other* family's preview JSX.
const GALLERY_VIEWS: Record<BlockFamily, GalleryView> = {
  auth: dynamic(() => import("../../lib/blocks/auth").then((m) => m.AuthGallery), {
    loading: GallerySkeleton,
  }),
  marketing: dynamic(() => import("../../lib/blocks/marketing").then((m) => m.MarketingGallery), {
    loading: GallerySkeleton,
  }),
  application: dynamic(
    () => import("../../lib/blocks/application").then((m) => m.ApplicationGallery),
    { loading: GallerySkeleton },
  ),
  onboarding: dynamic(
    () => import("../../lib/blocks/onboarding").then((m) => m.OnboardingGallery),
    { loading: GallerySkeleton },
  ),
  dashboard: dynamic(() => import("../../lib/blocks/dashboard").then((m) => m.DashboardGallery), {
    loading: GallerySkeleton,
  }),
  billing: dynamic(() => import("../../lib/blocks/billing").then((m) => m.BillingGallery), {
    loading: GallerySkeleton,
  }),
  commerce: dynamic(() => import("../../lib/blocks/commerce").then((m) => m.CommerceGallery), {
    loading: GallerySkeleton,
  }),
  page: dynamic(() => import("../../lib/blocks/page-sections").then((m) => m.PageGallery), {
    loading: GallerySkeleton,
  }),
};

export function BlockVariantsGallery({ slug }: { slug: string }) {
  const family = getBlockFamily(slug);
  const GalleryView = family ? GALLERY_VIEWS[family] : undefined;

  if (!GalleryView) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }

  return <GalleryView slug={slug} />;
}
