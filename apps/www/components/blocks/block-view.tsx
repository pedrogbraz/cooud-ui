"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { type BlockFamily, getBlockFamily } from "../../lib/blocks/registry";

/** Skeleton shown while a block family chunk streams in for the detail view. */
function BlockViewSkeleton() {
  return (
    <div className="2xl:grid 2xl:grid-cols-[minmax(28rem,38rem)_minmax(0,1fr)]" aria-hidden="true">
      <div className="flex flex-col gap-4 px-6 py-10 sm:px-10 lg:py-16">
        <div className="h-3 w-40 animate-pulse rounded bg-surface-inset/70" />
        <div className="h-12 w-64 max-w-full animate-pulse rounded-lg bg-surface-inset" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-surface-inset/70" />
        <div className="mt-6 h-96 animate-pulse rounded-2xl border border-border bg-surface-inset/50 2xl:hidden" />
      </div>
      <div className="hidden 2xl:block 2xl:h-[calc(100vh-4rem)] 2xl:border-l 2xl:border-border/60">
        <div className="h-full animate-pulse bg-surface-inset/40" />
      </div>
    </div>
  );
}

type BlockDetailView = ComponentType<{ slug: string; variant: string }>;

// One next/dynamic per family; only the family a slug belongs to is imported,
// so the variant route never loads the *other* family's preview JSX.
const VIEW_VIEWS: Record<BlockFamily, BlockDetailView> = {
  auth: dynamic(() => import("../../lib/blocks/auth").then((m) => m.AuthView), {
    loading: BlockViewSkeleton,
  }),
  marketing: dynamic(() => import("../../lib/blocks/marketing").then((m) => m.MarketingView), {
    loading: BlockViewSkeleton,
  }),
  application: dynamic(
    () => import("../../lib/blocks/application").then((m) => m.ApplicationView),
    { loading: BlockViewSkeleton },
  ),
  onboarding: dynamic(() => import("../../lib/blocks/onboarding").then((m) => m.OnboardingView), {
    loading: BlockViewSkeleton,
  }),
  dashboard: dynamic(() => import("../../lib/blocks/dashboard").then((m) => m.DashboardView), {
    loading: BlockViewSkeleton,
  }),
  billing: dynamic(() => import("../../lib/blocks/billing").then((m) => m.BillingView), {
    loading: BlockViewSkeleton,
  }),
  commerce: dynamic(() => import("../../lib/blocks/commerce").then((m) => m.CommerceView), {
    loading: BlockViewSkeleton,
  }),
  page: dynamic(() => import("../../lib/blocks/page-sections").then((m) => m.PageView), {
    loading: BlockViewSkeleton,
  }),
  ai: dynamic(() => import("../../lib/blocks/ai").then((m) => m.AiView), {
    loading: BlockViewSkeleton,
  }),
  states: dynamic(() => import("../../lib/blocks/states").then((m) => m.StatesView), {
    loading: BlockViewSkeleton,
  }),
  email: dynamic(() => import("../../lib/blocks/email").then((m) => m.EmailView), {
    loading: BlockViewSkeleton,
  }),
  notifications: dynamic(
    () => import("../../lib/blocks/notifications").then((m) => m.NotificationsView),
    { loading: BlockViewSkeleton },
  ),
  survey: dynamic(() => import("../../lib/blocks/survey").then((m) => m.SurveyView), {
    loading: BlockViewSkeleton,
  }),
  social: dynamic(() => import("../../lib/blocks/social").then((m) => m.SocialView), {
    loading: BlockViewSkeleton,
  }),
  changelog: dynamic(() => import("../../lib/blocks/changelog").then((m) => m.ChangelogView), {
    loading: BlockViewSkeleton,
  }),
  integrations: dynamic(
    () => import("../../lib/blocks/integrations").then((m) => m.IntegrationsView),
    { loading: BlockViewSkeleton },
  ),
  waitlist: dynamic(() => import("../../lib/blocks/waitlist").then((m) => m.WaitlistView), {
    loading: BlockViewSkeleton,
  }),
  "feature-matrix": dynamic(
    () => import("../../lib/blocks/feature-matrix").then((m) => m.FeatureMatrixView),
    { loading: BlockViewSkeleton },
  ),
};

export function BlockView({ slug, variant }: { slug: string; variant: string }) {
  const family = getBlockFamily(slug);
  const DetailView = family ? VIEW_VIEWS[family] : undefined;

  if (!DetailView) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }

  return <DetailView slug={slug} variant={variant} />;
}
