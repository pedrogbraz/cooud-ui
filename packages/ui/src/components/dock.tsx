"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { forwardRef, type HTMLAttributes, type ReactNode, useRef } from "react";
import { cn } from "../lib/cn.js";

/** A single dock entry — an icon button or, when `href` is set, a link. */
export interface DockItem {
  /** The glyph shown in the dock (kept `aria-hidden`; the button carries the name). */
  icon: ReactNode;
  /** Accessible name — wired to both `title` and `aria-label`. */
  label: string;
  /** Activated on click (ignored when `href` is set). */
  onClick?: () => void;
  /** Render the item as a link to this destination instead of a button. */
  href?: string;
}

export interface DockProps extends HTMLAttributes<HTMLDivElement> {
  /** The dock entries, left to right. */
  items: DockItem[];
  /** Peak scale an item reaches at the pointer's center. Defaults to `1.6`. */
  magnification?: number;
  /** Resting item size in pixels. Defaults to `44`. */
  baseItemSize?: number;
  /** Pointer influence radius in pixels — how far the magnify reaches. Defaults to `120`. */
  distance?: number;
}

const DEFAULT_MAGNIFICATION = 1.6;
const DEFAULT_BASE_ITEM_SIZE = 44;
const DEFAULT_DISTANCE = 120;

/**
 * A macOS-style icon dock with magnify-on-hover. Items grow as the pointer
 * approaches and settle back as it moves away, smoothed with a spring. The bar
 * is a rounded, bordered, backdrop-blurred surface of icon buttons (or links,
 * when an item has an `href`).
 *
 * Each item is named by its `label` (via `title` + `aria-label`); the glyphs
 * themselves stay `aria-hidden`. When the visitor prefers reduced motion the
 * magnify is skipped entirely and every item renders at {@link DockProps.baseItemSize}.
 */
export const Dock = forwardRef<HTMLDivElement, DockProps>(
  (
    {
      items,
      magnification = DEFAULT_MAGNIFICATION,
      baseItemSize = DEFAULT_BASE_ITEM_SIZE,
      distance = DEFAULT_DISTANCE,
      className,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();
    // Pointer X relative to the viewport; items read it to size themselves.
    // Park it far away so nothing is magnified before the pointer arrives.
    const pointerX = useMotionValue(Number.POSITIVE_INFINITY);

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: pointer tracking only drives the decorative magnify; the real controls are the inner item buttons/links.
      <div
        ref={ref}
        data-slot="dock"
        onMouseMove={(event) => {
          if (!reducedMotion) pointerX.set(event.clientX);
          onMouseMove?.(event);
        }}
        onMouseLeave={(event) => {
          pointerX.set(Number.POSITIVE_INFINITY);
          onMouseLeave?.(event);
        }}
        className={cn(
          "inline-flex items-end gap-2 rounded-2xl border border-border bg-surface-raised/70 px-3 py-2 backdrop-blur",
          className,
        )}
        {...props}
      >
        {items.map((item) => (
          <DockButton
            key={item.label}
            item={item}
            pointerX={pointerX}
            magnification={magnification}
            baseItemSize={baseItemSize}
            distance={distance}
            reducedMotion={!!reducedMotion}
          />
        ))}
      </div>
    );
  },
);
Dock.displayName = "Dock";

interface DockButtonProps {
  item: DockItem;
  pointerX: MotionValue<number>;
  magnification: number;
  baseItemSize: number;
  distance: number;
  reducedMotion: boolean;
}

function DockButton({
  item,
  pointerX,
  magnification,
  baseItemSize,
  distance,
  reducedMotion,
}: DockButtonProps) {
  // Live element ref so the transforms can read this item's center on each
  // frame; stable for the item's lifetime.
  const ref = useRef<HTMLElement | null>(null);

  // Signed distance from the pointer to this item's horizontal center. When the
  // pointer is parked at +Infinity this resolves to Infinity, so the item rests
  // at its base size.
  const delta = useTransform(pointerX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return Number.POSITIVE_INFINITY;
    return x - (rect.left + rect.width / 2);
  });
  const targetSize = useTransform(
    delta,
    [-distance, 0, distance],
    [baseItemSize, baseItemSize * magnification, baseItemSize],
    { clamp: true },
  );
  const size = useSpring(targetSize, { stiffness: 260, damping: 22, mass: 0.2 });

  const sharedClassName =
    "inline-flex aspect-square items-center justify-center rounded-xl bg-surface-overlay text-fg outline-none transition-colors hover:bg-surface-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base [&_svg]:size-1/2 [&_svg]:shrink-0 [&_svg]:pointer-events-none";

  const style = reducedMotion ? { width: baseItemSize, height: baseItemSize } : { width: size };

  const glyph = (
    <span aria-hidden="true" className="contents">
      {item.icon}
    </span>
  );

  if (item.href) {
    return (
      <motion.a
        ref={(node: HTMLAnchorElement | null) => {
          ref.current = node;
        }}
        href={item.href}
        title={item.label}
        aria-label={item.label}
        data-slot="dock-item"
        style={style}
        className={sharedClassName}
      >
        {glyph}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={(node: HTMLButtonElement | null) => {
        ref.current = node;
      }}
      type="button"
      title={item.label}
      aria-label={item.label}
      data-slot="dock-item"
      onClick={item.onClick}
      style={style}
      className={sharedClassName}
    >
      {glyph}
    </motion.button>
  );
}
