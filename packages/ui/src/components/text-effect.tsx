"use client";

import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { forwardRef, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn.js";

/**
 * Grapheme segmenter for `per: "char"` so user-perceived characters stay whole.
 * Splitting by code point shatters ZWJ emoji (👨‍👩‍👧‍👦), flags (🇧🇷), and complex
 * scripts; segmenting by grapheme keeps each cluster as one animated unit. Null
 * on platforms without `Intl.Segmenter`, where we fall back to code-point split.
 */
const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

/** How the text is broken up before staggering the enter animation. */
export type TextEffectPer = "word" | "char";

/** Which per-unit enter animation plays. */
export type TextEffectPreset = "fade" | "blur" | "slide";

/** When the reveal fires. */
export type TextEffectTrigger = "mount" | "inView";

/**
 * Per-unit enter animations. Each is a {@link Variants} pair keyed `hidden` /
 * `visible`; the container orchestrates timing via `staggerChildren`, so the
 * per-unit `transition` only carries the easing/duration (duration is injected
 * at runtime from the `duration` prop). All presets land on the fully-visible
 * resting state — no residual transform/filter — so layout and text rendering
 * are pixel-identical to plain text once the animation settles.
 */
const PRESETS: Record<TextEffectPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slide: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  },
};

/** Default per-unit stagger, tuned so a whole title still reads as one gesture. */
const DEFAULT_STAGGER: Record<TextEffectPer, number> = {
  word: 0.04,
  char: 0.02,
};

export interface TextEffectProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /**
   * The text to reveal. Must be a plain string so it can be split into words
   * or characters — pass interpolated values as a single template string, not
   * as child nodes.
   */
  children: string;
  /** Split granularity. `"word"` (default) staggers words; `"char"` staggers letters. */
  per?: TextEffectPer;
  /** Which enter animation each unit plays. Defaults to `"blur"`. */
  preset?: TextEffectPreset;
  /**
   * The rendered wrapper element/tag (e.g. `"h1"`, `"span"`). Defaults to `"p"`.
   * The wrapper itself is not animated — it carries the accessible label while
   * inner `motion.span`s do the animating.
   */
  as?: React.ElementType;
  /** Delay (seconds) before the first unit animates. Defaults to `0`. */
  delay?: number;
  /**
   * Time (seconds) between consecutive units. Defaults to `0.04` for words and
   * `0.02` for characters.
   */
  stagger?: number;
  /** Per-unit animation duration (seconds). Defaults to `0.4`. */
  duration?: number;
  /**
   * `"inView"` (default) animates once when the element scrolls into view;
   * `"mount"` animates immediately on mount.
   */
  trigger?: TextEffectTrigger;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"` (render the
   * text statically for users who opt out). Pass `"never"` to always play the
   * stagger — e.g. a showcase that must demonstrate it — or `"always"` to force
   * the static render.
   */
  reducedMotion?: "user" | "always" | "never";
}

/**
 * Container variants: hold children hidden, then release them on a stagger.
 * When `reduced` is set the stagger collapses to an instant, zero-delay release
 * so reduced-motion users get fully-static text the frame after hydration.
 */
function buildContainerVariants(stagger: number, delay: number, reduced: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduced
        ? { staggerChildren: 0, delayChildren: 0, duration: 0 }
        : { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/**
 * Split text into renderable units while keeping word boundaries intact.
 *
 * For `per: "word"` each token is a word and a trailing space is preserved as a
 * separate token so wrapping/justification behave exactly like normal text. For
 * `per: "char"` we split into words *first*, then into characters, so a word can
 * never wrap mid-token — the word stays an inline-block group whose own letters
 * stagger inside it.
 */
function splitText(text: string, per: TextEffectPer): string[][] {
  // Split on whitespace runs but keep the separators, so multiple/explicit
  // spaces survive round-tripping.
  const tokens = text.split(/(\s+)/).filter((token) => token.length > 0);
  if (per === "word") {
    return tokens.map((token) => [token]);
  }
  return tokens.map((token) =>
    /^\s+$/.test(token)
      ? [token]
      : graphemeSegmenter
        ? Array.from(graphemeSegmenter.segment(token), (s) => s.segment)
        : Array.from(token),
  );
}

/**
 * Reveal a string by splitting it into words or characters and staggering an
 * enter animation across the units. Built for heros, section titles, and
 * onboarding moments where copy should "arrive" rather than pop.
 *
 * **Presets** — `fade` (opacity), `blur` (opacity + a clearing 8px blur, the
 * default and most premium-feeling), and `slide` (opacity + an 8px rise). The
 * container drives timing via `staggerChildren`; each unit only animates its own
 * property, so the settled state is byte-identical to plain text.
 *
 * **Trigger** — `inView` (default) plays the reveal once when the text scrolls
 * into view; `mount` plays it immediately. In-view detection fires a little
 * before the element fully enters the viewport so the motion feels anticipatory.
 *
 * **Accessibility** — split text is hostile to screen readers, selection, and
 * find-in-page. So the wrapper carries `aria-label={children}` (assistive tech
 * reads the whole string once, naturally) while the animated `motion.span` tree
 * is marked `aria-hidden`. Sighted users see the staggered reveal; AT users get
 * the clean string.
 *
 * **Reduced motion** — when the user prefers reduced motion the text renders
 * fully visible with no blur, transform, or stagger (a single instant fade at
 * most). Honours `prefers-reduced-motion` via {@link useReducedMotion}.
 */
export const TextEffect = forwardRef<HTMLElement, TextEffectProps>(
  (
    {
      children,
      per = "word",
      preset = "blur",
      as: Component = "p",
      delay = 0,
      stagger,
      duration = 0.4,
      trigger = "inView",
      reducedMotion = "user",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement>(null);
    const systemReducedMotion = useReducedMotion();
    const prefersReducedMotion =
      reducedMotion === "never" ? false : reducedMotion === "always" ? true : systemReducedMotion;

    // `will-change` is only worth its GPU layer while a unit is actually moving;
    // gating on this flag (set/cleared by the container's animation lifecycle)
    // lets the leaf spans drop their promoted layers at rest.
    const [isAnimating, setIsAnimating] = useState(false);

    const resolvedStagger = stagger ?? DEFAULT_STAGGER[per];

    // Observe for the in-view trigger. We render a single DOM tree for server
    // and client (no early reduced-motion return) so reduced motion is driven
    // purely through animation props below — not through divergent markup.
    const isInView = useInView(localRef, { once: true, margin: "-80px" });
    // Reduced-motion users snap straight to `visible` (post-hydration, instantly
    // via the zero-duration transitions); everyone else plays on mount/in-view.
    const shouldPlay = prefersReducedMotion ? true : trigger === "mount" ? true : isInView;

    const units = useMemo(() => splitText(children, per), [children, per]);

    const containerVariants = useMemo(
      () => buildContainerVariants(resolvedStagger, delay, !!prefersReducedMotion),
      [resolvedStagger, delay, prefersReducedMotion],
    );

    const itemVariants = PRESETS[preset];
    const itemTransition = useMemo(() => ({ duration, ease: "easeOut" as const }), [duration]);

    const setRef = (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return (
      <Component ref={setRef} data-slot="text-effect" className={cn(className)} {...props}>
        {/* Readable copy for assistive tech / find-in-page; the animated pieces
            below are aria-hidden so the string is announced once, not per-unit.
            An sr-only span (vs aria-label) keeps this valid on any `as` element —
            aria-label is prohibited on generic tags like <p>/<div>/<span>. */}
        <span className="sr-only">{children}</span>
        <motion.span
          aria-hidden="true"
          // `initial` is the only variant framer renders into the SSR'd HTML, so
          // it must be deterministic across server (reduced-motion null) and a
          // reduced-motion client — keep it `"hidden"` unconditionally to avoid a
          // hydration mismatch. Reduced motion is expressed by the transitions.
          initial="hidden"
          animate={shouldPlay ? "visible" : "hidden"}
          variants={containerVariants}
          // Drive the will-change flag from the container's animation lifecycle so
          // the leaf spans only promote a GPU layer while motion is in flight.
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          // inline so the wrapper's own typography (line-height, alignment) is
          // unaffected; child word-groups handle wrapping.
          style={{ display: "inline" }}
        >
          {units.map((unit, unitIndex) => {
            const unitKey = `unit-${unitIndex}`;
            // A whitespace-only token: render as a plain inline span so the
            // space can break/collapse like normal text (not an inline-block).
            if (unit.length === 1 && /^\s+$/.test(unit[0] ?? "")) {
              return (
                <span key={unitKey} style={{ whiteSpace: "pre" }}>
                  {unit[0]}
                </span>
              );
            }

            // For `per: "word"` the unit is a single word token; for
            // `per: "char"` it is the word's characters. Either way wrap the
            // group inline-block so it never breaks mid-word.
            return (
              <span key={unitKey} className="inline-block">
                {unit.map((piece, pieceIndex) => (
                  <motion.span
                    // biome-ignore lint/suspicious/noArrayIndexKey: split text pieces are positional and stable within their word.
                    key={`${unitKey}-piece-${pieceIndex}`}
                    className="inline-block"
                    variants={itemVariants}
                    // Reduced motion snaps instantly to `visible` (no movement);
                    // otherwise carry the easing/duration from the `duration` prop.
                    transition={prefersReducedMotion ? { duration: 0 } : itemTransition}
                    // `will-change` only while animating; the `inline-block`
                    // class (not will-change) gives transforms/filters their
                    // formatting context, so dropping the hint at rest is safe.
                    style={{ willChange: isAnimating ? "transform, filter, opacity" : undefined }}
                  >
                    {piece}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </motion.span>
      </Component>
    );
  },
);
TextEffect.displayName = "TextEffect";
