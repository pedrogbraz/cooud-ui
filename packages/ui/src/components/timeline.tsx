import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TimeHTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

/* ------------------------------------------------------------------ *
 * Timeline (root)
 * ------------------------------------------------------------------ */

/**
 * Vertical activity / history feed. Renders an ordered list (`<ol>`) of
 * {@link TimelineItem}s, each with a dot on a left rail and a connector line
 * running down to the next event. Purely presentational and SSR-safe — there
 * is no state or effects. Compose items inside it:
 *
 * ```tsx
 * <Timeline>
 *   <TimelineItem>
 *     <TimelineDot tone="success" />
 *     <TimelineContent>
 *       <TimelineTitle>Order shipped</TimelineTitle>
 *       <TimelineTime dateTime="2026-06-23">Jun 23</TimelineTime>
 *       <TimelineDescription>Left the warehouse.</TimelineDescription>
 *     </TimelineContent>
 *   </TimelineItem>
 * </Timeline>
 * ```
 */
export const Timeline = forwardRef<HTMLOListElement, OlHTMLAttributes<HTMLOListElement>>(
  ({ className, children, ...props }, ref) => {
    // Find the index of the last real `TimelineItem` so its trailing connector
    // can be suppressed (the rail should stop at the final dot). Done here —
    // synchronously, no effects — so it is correct on the first server render.
    const items = Children.toArray(children);
    let lastItemIndex = -1;
    for (let i = items.length - 1; i >= 0; i -= 1) {
      const child = items[i];
      if (isValidElement(child) && child.type === TimelineItem) {
        lastItemIndex = i;
        break;
      }
    }

    return (
      <ol
        ref={ref}
        // biome-ignore lint/a11y/noRedundantRoles: Safari/VoiceOver drops list semantics from an <ol> styled `list-style: none`; the explicit role="list" is the documented workaround so the feed still reads as a list.
        role="list"
        data-slot="timeline"
        className={cn("flex w-full min-w-0 flex-col", className)}
        {...props}
      >
        {items.map((child, index) => {
          if (
            index === lastItemIndex &&
            isValidElement<TimelineItemProps>(child) &&
            // Respect an explicit `connector` on the item; only auto-suppress
            // when the consumer left it to the default.
            child.props.connector === undefined
          ) {
            return cloneElement(child as ReactElement<TimelineItemProps>, { connector: false });
          }
          return child;
        })}
      </ol>
    );
  },
);
Timeline.displayName = "Timeline";

/* ------------------------------------------------------------------ *
 * Timeline item
 * ------------------------------------------------------------------ */

export interface TimelineItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /**
   * Render the trailing connector line below this item's dot. Defaults to
   * `true`; the rail draws a line down to the next event. Set `false` on the
   * final item so the rail stops at its dot (auto-detected when the item is the
   * last child of a {@link Timeline}, so this is rarely needed by hand).
   */
  connector?: boolean;
}

/**
 * A single event row. Lays out as a two-column grid — a left rail holding the
 * {@link TimelineDot} plus the vertical {@link TimelineConnector}, and the
 * content column. The connector is rendered automatically (no trailing line on
 * the last item); pass `connector={false}` to drop it explicitly. Any
 * {@link TimelineDot} child is hoisted onto the rail, so the common markup is
 * just the dot followed by the content.
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ connector = true, className, children, ...props }, ref) => {
    // Split the dot (rail) out from the rest (content column) so a consumer can
    // write `<TimelineItem><TimelineDot/><TimelineContent/></TimelineItem>` and
    // still get the correct two-column layout.
    let dot: ReactNode = null;
    const rest: ReactNode[] = [];
    Children.forEach(children, (child) => {
      if (dot === null && isValidElement(child) && child.type === TimelineDot) {
        dot = child;
        return;
      }
      rest.push(child);
    });

    return (
      <li
        ref={ref}
        data-slot="timeline-item"
        className={cn(
          "group/timeline-item relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-3",
          // Reserve room for the next item's connector to reach this one, unless
          // this is the last item (no trailing line).
          connector ? "pb-6 last:pb-0" : "pb-0",
          className,
        )}
        {...props}
      >
        <div data-slot="timeline-rail" className="relative flex flex-col items-center">
          {dot ?? <TimelineDot />}
          {connector ? <TimelineConnector /> : null}
        </div>
        <div data-slot="timeline-body" className="min-w-0 pt-0.5">
          {rest}
        </div>
      </li>
    );
  },
);
TimelineItem.displayName = "TimelineItem";

/* ------------------------------------------------------------------ *
 * Timeline dot
 * ------------------------------------------------------------------ */

const timelineDotVariants = cva(
  cn(
    "relative z-10 flex shrink-0 items-center justify-center rounded-full",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ),
  {
    variants: {
      tone: {
        default: "bg-fg-tertiary",
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
      },
      // A bare dot is a small disc; with an icon it becomes a ring-bordered
      // chip that holds the glyph.
      withIcon: {
        true: "size-7 border bg-surface-raised",
        false: "size-2.5",
      },
    },
    compoundVariants: [
      { withIcon: true, tone: "default", className: "border-border text-fg-secondary" },
      { withIcon: true, tone: "primary", className: "border-primary/30 text-primary" },
      { withIcon: true, tone: "success", className: "border-success/30 text-success" },
      { withIcon: true, tone: "warning", className: "border-warning/30 text-warning" },
      { withIcon: true, tone: "error", className: "border-error/30 text-error" },
    ],
    defaultVariants: { tone: "default", withIcon: false },
  },
);

export interface TimelineDotProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    Omit<VariantProps<typeof timelineDotVariants>, "withIcon"> {
  /**
   * Optional glyph (e.g. a `lucide-react` icon) rendered inside the dot. When
   * present the dot becomes a ring-bordered chip sized to hold it; otherwise it
   * is a small solid disc.
   */
  icon?: ReactNode;
}

/**
 * The marker on a {@link TimelineItem}'s rail. Without an `icon` it is a small
 * solid disc colored by `tone` (default = muted, primary/success/warning/error
 * map to the matching token); with an `icon` it renders as a ring-bordered chip
 * holding the glyph. Decorative styling only — the event's meaning lives in the
 * adjacent {@link TimelineTitle}.
 */
export const TimelineDot = forwardRef<HTMLSpanElement, TimelineDotProps>(
  ({ tone, icon, className, children, ...props }, ref) => {
    const withIcon = icon != null;
    return (
      <span
        ref={ref}
        data-slot="timeline-dot"
        data-tone={tone ?? "default"}
        className={cn(timelineDotVariants({ tone, withIcon }), className)}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  },
);
TimelineDot.displayName = "TimelineDot";

/* ------------------------------------------------------------------ *
 * Timeline connector
 * ------------------------------------------------------------------ */

/**
 * The vertical line linking one event to the next. Normally rendered for you by
 * {@link TimelineItem} (which omits it on the last item); exposed for manual
 * composition. Stretches to fill the rail below the dot and is decorative, so
 * it is hidden from assistive tech.
 */
export const TimelineConnector = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="timeline-connector"
        aria-hidden="true"
        className={cn("mt-1 w-px flex-1 rounded-full bg-border", className)}
        {...props}
      />
    );
  },
);
TimelineConnector.displayName = "TimelineConnector";

/* ------------------------------------------------------------------ *
 * Timeline content
 * ------------------------------------------------------------------ */

/** Wrapper for an item's text column. Stacks the title, time and description. */
export const TimelineContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="timeline-content"
        className={cn("flex min-w-0 flex-col gap-1", className)}
        {...props}
      />
    );
  },
);
TimelineContent.displayName = "TimelineContent";

/* ------------------------------------------------------------------ *
 * Timeline title / time / description
 * ------------------------------------------------------------------ */

/** The event's headline. */
export const TimelineTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="timeline-title"
        className={cn("text-sm font-medium leading-none text-fg", className)}
        {...props}
      />
    );
  },
);
TimelineTitle.displayName = "TimelineTitle";

/**
 * The muted timestamp for an event. Renders a real `<time>` element — pass
 * `dateTime` for the machine-readable value when the visible text is a friendly
 * label.
 */
export const TimelineTime = forwardRef<HTMLTimeElement, TimeHTMLAttributes<HTMLTimeElement>>(
  ({ className, ...props }, ref) => {
    return (
      <time
        ref={ref}
        data-slot="timeline-time"
        className={cn("text-xs leading-none text-fg-tertiary", className)}
        {...props}
      />
    );
  },
);
TimelineTime.displayName = "TimelineTime";

/** Optional supporting copy under the title. */
export const TimelineDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="timeline-description"
        className={cn("text-sm text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
TimelineDescription.displayName = "TimelineDescription";

export { timelineDotVariants };
