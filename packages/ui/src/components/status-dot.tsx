import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

const statusDotVariants = cva("relative inline-block shrink-0 rounded-full", {
  variants: {
    status: {
      online: "bg-success",
      // Hollow outline so "offline" reads as absence and stays distinguishable
      // without relying on color alone. The gray is a glyph fill, not text.
      offline: "border-2 border-fg-muted bg-transparent",
      busy: "bg-error",
      away: "bg-warning",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
      info: "bg-info",
      neutral: "bg-fg-muted",
    },
    size: {
      xs: "size-1.5",
      sm: "size-2",
      md: "size-2.5",
      lg: "size-3",
    },
    ring: {
      // Surface-colored ring that cuts the dot out of whatever sits behind it
      // (matches AvatarGroup's overlap ring) — for badge-on-avatar overlays.
      true: "ring-2 ring-surface-base",
      false: "",
    },
  },
  defaultVariants: { status: "online", size: "md", ring: false },
});

type StatusDotStatus = NonNullable<VariantProps<typeof statusDotVariants>["status"]>;
type StatusDotSize = NonNullable<VariantProps<typeof statusDotVariants>["size"]>;
type StatusDotPosition = "top-right" | "bottom-right" | "none";

/** Default English name per status; override via `label` for i18n. */
const DEFAULT_STATUS_LABELS: Record<StatusDotStatus, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
  neutral: "Neutral",
};

// Corner anchors for badge-on-avatar composition. "right" maps to the inline
// end (`end-0`), so the dot mirrors automatically under RTL.
const POSITION_CLASSES: Record<StatusDotPosition, string> = {
  "top-right": "absolute top-0 end-0",
  "bottom-right": "absolute bottom-0 end-0",
  none: "",
};

const GAP_CLASSES: Record<StatusDotSize, string> = {
  xs: "gap-1",
  sm: "gap-1.5",
  md: "gap-1.5",
  lg: "gap-2",
};

const LABEL_SIZE_CLASSES: Record<StatusDotSize, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export interface StatusDotProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof statusDotVariants> {
  /**
   * Presence / semantic state the dot communicates. Drives the fill color and
   * the default accessible name.
   * @default "online"
   */
  status?: StatusDotStatus;
  /**
   * Dot size preset.
   * @default "md"
   */
  size?: StatusDotSize;
  /**
   * Draws a surface-colored ring around the dot so it cuts out cleanly when
   * overlaid on an avatar or icon.
   * @default false
   */
  ring?: boolean;
  /**
   * Status text. Rendered next to the dot when `withLabel` is set; otherwise
   * rendered as visually-hidden live-region content so screen readers
   * announce both the initial status and later `status` changes.
   * @default The English name of `status` (e.g. `"Online"`).
   */
  label?: string;
  /**
   * Renders `label` visibly next to the dot (in `text-fg-secondary`) instead
   * of exposing it only to assistive technology.
   * @default false
   */
  withLabel?: boolean;
  /**
   * Animates an expanding "ping" halo behind the dot to draw attention. The
   * halo reuses the dot's fill; the hollow `offline` dot gets a matching
   * outline halo instead (its fill is transparent). The animation only runs
   * for users who have not requested reduced motion.
   * @default false
   */
  pulse?: boolean;
  /**
   * Absolute corner anchor for overlaying the dot on an avatar or icon —
   * place the component inside a `relative` wrapper. The "right" corners map
   * to the inline end, so they mirror under RTL.
   * @default "none"
   */
  position?: StatusDotPosition;
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  (
    {
      className,
      status,
      size,
      ring,
      label,
      withLabel = false,
      pulse = false,
      position = "none",
      ...props
    },
    ref,
  ) => {
    const resolvedStatus = status ?? "online";
    const resolvedSize = size ?? "md";
    const resolvedLabel = label ?? DEFAULT_STATUS_LABELS[resolvedStatus];

    return (
      <span
        ref={ref}
        data-slot="status-dot"
        data-status={resolvedStatus}
        role="status"
        className={cn(
          "inline-flex items-center",
          GAP_CLASSES[resolvedSize],
          POSITION_CLASSES[position],
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          data-slot="status-dot-indicator"
          className={statusDotVariants({ status: resolvedStatus, size: resolvedSize, ring })}
        >
          {pulse ? (
            // `bg-inherit` reuses the dot's fill; `motion-safe:` keeps the halo
            // static for users who prefer reduced motion. The offline dot has a
            // transparent fill (hollow outline), so `bg-inherit` would paint an
            // invisible halo — it gets a matching outline instead, nudged out
            // by the dot's own border width so both outer edges align.
            <span
              data-slot="status-dot-ping"
              className={cn(
                "absolute rounded-full opacity-75 motion-safe:animate-ping",
                resolvedStatus === "offline"
                  ? "-inset-0.5 border-2 border-fg-muted"
                  : "inset-0 bg-inherit",
              )}
            />
          ) : null}
        </span>
        {withLabel ? (
          <span
            data-slot="status-dot-label"
            className={cn("text-fg-secondary", LABEL_SIZE_CLASSES[resolvedSize])}
          >
            {resolvedLabel}
          </span>
        ) : (
          // Live regions announce content MUTATIONS, not accessible-name
          // changes — an `aria-label` swap on a status flip stays silent in
          // NVDA/JAWS/VoiceOver. Rendering the label as visually-hidden
          // content makes dynamic `status` changes announce politely. A
          // consumer-supplied `aria-label` still overrides the region's name.
          <span data-slot="status-dot-sr-label" className="sr-only">
            {resolvedLabel}
          </span>
        )}
      </span>
    );
  },
);
StatusDot.displayName = "StatusDot";

export { statusDotVariants };
