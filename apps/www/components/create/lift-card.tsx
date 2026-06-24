"use client";

import { LazyMotion, m, type Transition, useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Loads the `domAnimation` feature set in its own async chunk (see
 * `lift-features.ts`) so it stays out of `/create`'s first-load JS. Returned to
 * `LazyMotion`'s async `features` prop; resolves right after hydration.
 */
const loadLiftFeatures = () => import("./lift-features").then((mod) => mod.default);

/**
 * Shared hover-lift physics for the `/create` preview.
 *
 * The preview cards + icon tiles lift on hover. A fixed-duration CSS ease felt
 * "dry" — it travels a set distance in a set time and stops dead. A spring has
 * natural momentum: it glides up, settles with a whisper of overshoot, and
 * springs back fluidly on exit. This is the house motion tool (`motion/react`).
 *
 * Tuning notes — fluid but CLEAN (premium, not cartoonish):
 *   stiffness 300 · damping 26 · mass 0.6  →  damping ratio ζ ≈ 0.97 (just shy
 *   of critical), so the lift glides and settles with at most a whisper of
 *   overshoot and never bounces. The same spring drives the cards and the tiles
 *   so the whole preview shares one coherent motion language.
 *
 * Only the transform (lift / scale) is the spring — border + shadow stay CSS
 * `hover:`, which animate fine and keep the surface fully token-driven so the
 * dashboard re-themes live. The transform is GPU-composited, so this is cheap
 * for the ~8 cards + ~20 tiles on the page.
 *
 * Bundle: this is the only motion import on `/create`, and that route's
 * first-load JS sits right against its budget. So we use the slim `LazyMotion` +
 * `m` path AND load the `domAnimation` features ASYNCHRONOUSLY — only the tiny
 * `m` component ships up front; the feature set code-splits into its own chunk
 * (see `loadLiftFeatures`) that loads after hydration. `strict` makes `m` refuse
 * to silently fall back to the full feature set, so the slim path can't regress.
 */
export const liftSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
  mass: 0.6,
};

type LiftCardProps = ComponentPropsWithoutRef<typeof m.div> & {
  /** Lift distance in px (negative = up). Defaults to -6. */
  lift?: number;
  children: ReactNode;
};

/**
 * Wraps a preview card so its hover lift is a spring instead of a CSS
 * transition. The card's own border/shadow still react via `hover:`. Honors
 * `prefers-reduced-motion`: when the user opts out the lift is disabled and the
 * card simply sits still on hover.
 */
export function LiftCard({ lift = -6, children, className, ...props }: LiftCardProps) {
  const reduceMotion = useReducedMotion();
  return (
    <LazyMotion features={loadLiftFeatures} strict>
      <m.div
        className={className}
        whileHover={reduceMotion ? undefined : { y: lift }}
        transition={liftSpring}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

type LiftTileProps = ComponentPropsWithoutRef<typeof m.span> & {
  /** Lift distance in px (negative = up). Defaults to -4. */
  lift?: number;
  /** Hover scale. Defaults to 1.06. */
  scale?: number;
  children: ReactNode;
};

/**
 * The icon-tile variant: a `m.span` that lifts + scales on hover via the shared
 * spring (the brand-tint/border/shadow stay CSS `hover:`). Reduced motion
 * disables the lift + scale.
 */
export function LiftTile({
  lift = -4,
  scale = 1.06,
  children,
  className,
  ...props
}: LiftTileProps) {
  const reduceMotion = useReducedMotion();
  return (
    <LazyMotion features={loadLiftFeatures} strict>
      <m.span
        className={className}
        whileHover={reduceMotion ? undefined : { y: lift, scale }}
        transition={liftSpring}
        {...props}
      >
        {children}
      </m.span>
    </LazyMotion>
  );
}
