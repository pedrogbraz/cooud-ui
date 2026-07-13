/**
 * Server-safe map of block slug → its content *family* key.
 *
 * The live block previews (heavy composed JSX) live in
 * `lib/blocks/marketing.tsx` and `lib/blocks/application.tsx`. This registry
 * lets the catalog and detail routes know which family a slug belongs to
 * WITHOUT importing either module, so the index never pulls in any preview and
 * a detail route only loads the one family it needs.
 */

export type BlockFamily =
  | "auth"
  | "marketing"
  | "application"
  | "onboarding"
  | "dashboard"
  | "billing"
  | "commerce"
  | "page"
  | "ai"
  | "states"
  | "email"
  | "notifications"
  | "survey"
  | "social"
  | "changelog"
  | "integrations"
  | "waitlist"
  | "feature-matrix"
  | "store"
  | "account"
  | "admin"
  | "content";

/** slug → the family module that owns its content. */
export const BLOCK_FAMILY_BY_SLUG: Record<string, BlockFamily> = {
  // auth
  login: "auth",
  signup: "auth",
  "forgot-password": "auth",
  otp: "auth",
  "magic-link": "auth",
  // marketing
  hero: "marketing",
  pricing: "marketing",
  "feature-grid": "marketing",
  cta: "marketing",
  testimonials: "marketing",
  faq: "marketing",
  footer: "marketing",
  navbar: "marketing",
  // application
  stats: "application",
  settings: "application",
  team: "application",
  // onboarding
  welcome: "onboarding",
  "setup-wizard": "onboarding",
  "setup-checklist": "onboarding",
  // dashboard
  dashboard: "dashboard",
  // billing
  billing: "billing",
  "manage-subscription": "billing",
  "payment-method": "billing",
  "usage-dashboard": "billing",
  "cancel-flow": "billing",
  // commerce
  checkout: "commerce",
  payouts: "commerce",
  "product-grid": "commerce",
  invoice: "commerce",
  // page sections
  "page-header": "page",
  "filter-bar": "page",
  "empty-state": "page",
  "status-page": "page",
  // ai
  "chat-thread": "ai",
  "prompt-box": "ai",
  "ai-response": "ai",
  // states
  "not-found": "states",
  "error-state": "states",
  "success-state": "states",
  maintenance: "states",
  // email
  "email-welcome": "email",
  "email-receipt": "email",
  "email-verify": "email",
  // notifications
  "notification-panel": "notifications",
  "activity-feed": "notifications",
  "toast-stack": "notifications",
  // survey
  "nps-survey": "survey",
  "feedback-form": "survey",
  "contact-form": "survey",
  // social
  "post-card": "social",
  "comment-thread": "social",
  "profile-card": "social",
  // changelog
  changelog: "changelog",
  // integrations
  integrations: "integrations",
  // waitlist
  waitlist: "waitlist",
  // feature matrix
  "feature-matrix": "feature-matrix",
  // store
  "product-detail": "store",
  cart: "store",
  "order-tracking": "store",
  "order-history": "store",
  reviews: "store",
  // account
  "account-security": "account",
  sessions: "account",
  "api-keys": "account",
  "notification-preferences": "account",
  // admin
  "user-management": "admin",
  analytics: "admin",
  "kanban-board": "admin",
  "audit-log": "admin",
  // content
  blog: "content",
  "blog-post": "content",
  "logo-cloud": "content",
  about: "content",
};

export function getBlockFamily(slug: string): BlockFamily | undefined {
  return BLOCK_FAMILY_BY_SLUG[slug];
}
