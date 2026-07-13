"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ZoomIn } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

const imageZoomVariants = cva(
  // Single-style base (no variant axes yet); the exported const still keeps the
  // frame styling centralized and the `<name>Variants` contract intact.
  "group/image-zoom relative block w-full cursor-zoom-in select-none overflow-hidden rounded-xl border border-border bg-surface-inset outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50 data-[state=zoomed]:cursor-zoom-out",
);

export interface ImageZoomLabels {
  /** Action part of the toggle's accessible name; `alt` is appended when set. */
  zoom: string;
}

const DEFAULT_LABELS: ImageZoomLabels = {
  zoom: "Zoom image",
};

export interface ImageZoomProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof imageZoomVariants> {
  /** Image URL for the built-in `<img>`. Ignored when `children` is passed. */
  src?: string;
  /**
   * Describes the image for assistive tech. The root is a button whose
   * `aria-label` overrides the inner image's alt, so the description is
   * composed into the toggle's accessible name (`"{labels.zoom}: {alt}"`)
   * in addition to serving as the built-in `<img>` alt. @default ""
   */
  alt?: string;
  /** Magnification applied while zoomed. Values below `1` clamp to `1`. @default 2 */
  zoom?: number;
  /** Disables all zoom interaction. @default false */
  disabled?: boolean;
  /** Renders the zoom-in indicator overlay, which fades out while zoomed. @default true */
  showIndicator?: boolean;
  /** Assistive strings, merged over the English defaults. */
  labels?: Partial<ImageZoomLabels>;
  /** Controlled zoom state. Pair with `onZoomChange`. */
  zoomed?: boolean;
  /** Initial zoom state for uncontrolled usage. @default false */
  defaultZoomed?: boolean;
  /** Called with the next state whenever zoom toggles on or off. */
  onZoomChange?: (zoomed: boolean) => void;
  /** Custom image markup to zoom instead of the built-in `src` image. */
  children?: ReactNode;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/**
 * Inline hover/press zoom for product and detail imagery. Fine pointers zoom
 * while hovering and the pan follows the cursor via transform-origin tracking;
 * touch, pen, and keyboard (Enter/Space) toggle a sticky zoom centered on the
 * last point (or the center). The root is a toggle button whose `aria-pressed`
 * reflects the zoom state and whose accessible name folds in the image `alt`
 * (a button's label would otherwise swallow it). The zoom state is
 * uncontrolled by default (`defaultZoomed`) or controlled via `zoomed` +
 * `onZoomChange`.
 */
export const ImageZoom = forwardRef<HTMLButtonElement, ImageZoomProps>(
  (
    {
      src,
      alt = "",
      zoom = 2,
      disabled = false,
      showIndicator = true,
      labels,
      zoomed: zoomedProp,
      defaultZoomed = false,
      onZoomChange,
      className,
      children,
      onClick,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const isControlled = zoomedProp !== undefined;
    const [uncontrolledZoomed, setUncontrolledZoomed] = useState(defaultZoomed);
    const zoomed = isControlled ? zoomedProp : uncontrolledZoomed;
    // transform-origin of the zoom pan, as percentages of the frame.
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    // Pointer type of the press behind the upcoming click. Only consulted
    // for pointer-driven clicks (detail > 0), which are always preceded by
    // their own pointerdown — so an abandoned press (drag off, pointercancel)
    // can never leave a stale value that suppresses keyboard activation.
    const pressPointerTypeRef = useRef("");

    const mergedLabels: ImageZoomLabels = { ...DEFAULT_LABELS, ...labels };
    // Buttons have children-presentational semantics and `aria-label`
    // overrides name-from-content, so a meaningful `alt` would never reach
    // assistive tech unless it is composed into the accessible name.
    const accessibleName = alt ? `${mergedLabels.zoom}: ${alt}` : mergedLabels.zoom;
    // Non-finite zoom (NaN/Infinity) falls back to the default instead of
    // reaching `scale()` as an invalid value.
    const scale = Math.max(1, Number.isFinite(zoom) ? zoom : 2);

    const applyZoom = (next: boolean) => {
      if (next === zoomed) return;
      if (!isControlled) setUncontrolledZoomed(next);
      onZoomChange?.(next);
    };

    /** Moves the transform-origin to the pointer, clamped inside the frame. */
    const updateOrigin = (event: PointerEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setOrigin({
        x: clampPercent(((event.clientX - rect.left) / rect.width) * 100),
        y: clampPercent(((event.clientY - rect.top) / rect.height) * 100),
      });
    };

    const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
      if (disabled) return;
      updateOrigin(event);
      // Fine pointers zoom on hover, so the pan simply follows the cursor.
      if (event.pointerType === "mouse") applyZoom(true);
    };

    const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event);
      if (disabled) return;
      // Hover-driven zoom ends with the hover; a toggled (touch/keyboard)
      // zoom sticks until the next activation.
      if (event.pointerType === "mouse") applyZoom(false);
    };

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (disabled) return;
      pressPointerTypeRef.current = event.pointerType;
      updateOrigin(event);
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (disabled) return;
      const pressPointerType = pressPointerTypeRef.current;
      pressPointerTypeRef.current = "";
      // Mouse zoom is hover-driven — a mouse click toggling here would fight
      // the hover state. Touch, pen, and keyboard clicks toggle at the last
      // recorded point (the center when none was recorded). Keyboard clicks
      // fire with `detail === 0`, so they always toggle even when a mouse
      // press was abandoned without producing a click.
      if (event.detail !== 0 && pressPointerType === "mouse") return;
      applyZoom(!zoomed);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (disabled) return;
      if (event.key !== "Escape" || !zoomed) return;
      // Scope Escape to the active zoom so an enclosing dialog/lightbox is not
      // dismissed by the same press; an idle Escape passes through untouched.
      event.preventDefault();
      event.stopPropagation();
      applyZoom(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="image-zoom"
        data-state={zoomed ? "zoomed" : "idle"}
        aria-pressed={zoomed}
        aria-label={accessibleName}
        disabled={disabled}
        className={cn(imageZoomVariants(), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        <span
          data-slot="image-zoom-content"
          // will-change promotion is scoped to hover/zoom so idle instances
          // (e.g. a product grid full of frames) don't hold compositor layers.
          className="pointer-events-none block size-full group-hover/image-zoom:will-change-transform group-data-[state=zoomed]/image-zoom:will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[var(--ease-out-quart)] [&_img]:block [&_img]:size-full [&_img]:select-none [&_img]:object-cover"
          style={{
            transform: `scale(${zoomed ? scale : 1})`,
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        >
          {children ?? (src ? <img src={src} alt={alt} draggable={false} /> : null)}
        </span>
        {showIndicator ? (
          <span
            aria-hidden="true"
            data-slot="image-zoom-indicator"
            className="pointer-events-none absolute end-2 bottom-2 inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface-overlay/90 text-fg-secondary shadow-sm transition-opacity duration-200 group-data-[state=zoomed]/image-zoom:opacity-0 [&_svg]:size-4"
          >
            <ZoomIn aria-hidden="true" />
          </span>
        ) : null}
      </button>
    );
  },
);
ImageZoom.displayName = "ImageZoom";

export { imageZoomVariants };
