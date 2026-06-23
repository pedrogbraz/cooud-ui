"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentType,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type SVGProps,
  useEffect,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { easeOutQuart } from "./motion-presets.js";

export interface LogoCarouselItem {
  id: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  node?: ReactNode;
}

export type LogoCarouselVariant = "ghost" | "surface";
export type LogoCarouselSize = "sm" | "md" | "lg";
export type LogoCarouselMotionPreference = "user" | "always" | "never";

interface LogoCarouselStyle extends CSSProperties {
  "--logo-carousel-columns"?: number;
}

export interface LogoCarouselProps extends HTMLAttributes<HTMLUListElement> {
  items: LogoCarouselItem[];
  columns?: number;
  /** Alias kept for snippets that call this pattern `columnCount`. */
  columnCount?: number;
  interval?: number;
  staggerDelay?: number;
  pauseOnHover?: boolean;
  ariaLabel?: string;
  variant?: LogoCarouselVariant;
  size?: LogoCarouselSize;
  motionPreference?: LogoCarouselMotionPreference;
  itemClassName?: string;
  logoClassName?: string;
}

const MIN_INTERVAL = 800;
const MAX_COLUMNS = 8;
const COLUMN_KEYS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
const itemVariantClasses: Record<LogoCarouselVariant, string> = {
  ghost:
    "border border-transparent bg-transparent px-3 text-fg-secondary/70 shadow-none hover:text-fg",
  surface:
    "border border-border bg-surface-raised/80 px-4 text-fg-secondary shadow-sm backdrop-blur hover:text-fg",
};
const itemSizeClasses: Record<LogoCarouselSize, string> = {
  sm: "h-12 sm:h-14",
  md: "h-16 sm:h-20",
  lg: "h-20 sm:h-24",
};
const logoSizeClasses: Record<LogoCarouselSize, string> = {
  sm: "text-base sm:text-lg",
  md: "text-xl sm:text-2xl",
  lg: "text-4xl sm:text-6xl",
};

interface VisibleLogoCarouselItem {
  item: LogoCarouselItem;
  slotKey: string;
  columnIndex: number;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInitials(label: string) {
  const words = label.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  return words
    .slice(0, 2)
    .map((word) => word.at(0) ?? "")
    .join("")
    .toUpperCase();
}

function LogoMark({
  item,
  className,
  size,
}: {
  item: LogoCarouselItem;
  className?: string;
  size: LogoCarouselSize;
}) {
  const Icon = item.icon;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex max-w-full items-center justify-center gap-2 font-display font-semibold leading-none text-current [&>svg]:shrink-0",
        item.node ? "whitespace-normal" : "truncate",
        logoSizeClasses[size],
        className,
      )}
    >
      {item.node ? (
        item.node
      ) : Icon ? (
        <Icon className="size-[1em] shrink-0" focusable="false" />
      ) : (
        <span className="tracking-normal">{getInitials(item.label)}</span>
      )}
    </span>
  );
}

export const LogoCarousel = forwardRef<HTMLUListElement, LogoCarouselProps>(
  (
    {
      className,
      itemClassName,
      logoClassName,
      items,
      columns,
      columnCount,
      interval = 2200,
      staggerDelay = 0.07,
      pauseOnHover = true,
      ariaLabel = "Logo carousel",
      variant = "ghost",
      size = "lg",
      motionPreference = "user",
      style,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const [activePage, setActivePage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const logos = items.filter((item) => item.id && item.label);
    const requestedColumns = finiteOr(columnCount ?? columns ?? 3, 3);
    const resolvedColumns =
      logos.length > 0
        ? clamp(Math.round(requestedColumns), 1, Math.min(MAX_COLUMNS, logos.length))
        : 1;
    const safeInterval = Math.max(finiteOr(interval, 2200), MIN_INTERVAL);
    const safeStaggerDelay = Math.max(finiteOr(staggerDelay, 0.07), 0);
    const canCycle = logos.length > resolvedColumns;
    const motionEnabled =
      motionPreference === "always" || (motionPreference === "user" && !shouldReduceMotion);
    const shouldAnimate = motionEnabled && canCycle;
    const visibleItems =
      logos.length > 0
        ? Array.from(
            { length: resolvedColumns },
            (_, columnIndex): VisibleLogoCarouselItem | null => {
              const item = logos[(activePage * resolvedColumns + columnIndex) % logos.length];
              if (!item) return null;

              return {
                item,
                slotKey: COLUMN_KEYS[columnIndex] ?? `column-${columnIndex + 1}`,
                columnIndex,
              };
            },
          ).filter((entry): entry is VisibleLogoCarouselItem => entry !== null)
        : [];

    useEffect(() => {
      if (!shouldAnimate || isPaused) return;

      const timer = window.setInterval(() => {
        setActivePage((current) => current + 1);
      }, safeInterval);

      return () => window.clearInterval(timer);
    }, [isPaused, safeInterval, shouldAnimate]);

    return (
      <ul
        ref={ref}
        aria-label={ariaLabel}
        aria-live="off"
        data-slot="logo-carousel"
        style={{ ...style, "--logo-carousel-columns": resolvedColumns } as LogoCarouselStyle}
        className={cn(
          "m-0 grid w-full list-none grid-cols-2 gap-3 p-0 sm:[grid-template-columns:repeat(var(--logo-carousel-columns),minmax(0,1fr))]",
          className,
        )}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (pauseOnHover) setIsPaused(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          if (pauseOnHover) setIsPaused(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (pauseOnHover) setIsPaused(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (pauseOnHover) setIsPaused(false);
        }}
        {...props}
      >
        {visibleItems.map(({ item, slotKey, columnIndex }) => (
          <li
            key={slotKey}
            aria-label={item.label}
            data-slot="logo-carousel-item"
            className={cn(
              "relative flex min-w-0 items-center justify-center overflow-hidden rounded-xl transition-colors",
              itemVariantClasses[variant],
              itemSizeClasses[size],
              itemClassName,
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={item.id}
                className="absolute inset-0 flex items-center justify-center px-4"
                initial={
                  shouldAnimate ? { opacity: 0, y: 22, scale: 0.96, filter: "blur(10px)" } : false
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={
                  shouldAnimate
                    ? { opacity: 0, y: -22, scale: 0.96, filter: "blur(10px)" }
                    : undefined
                }
                transition={
                  shouldAnimate
                    ? { ...easeOutQuart, delay: columnIndex * safeStaggerDelay }
                    : { duration: 0 }
                }
              >
                <LogoMark item={item} size={size} className={logoClassName} />
              </motion.div>
            </AnimatePresence>
          </li>
        ))}
      </ul>
    );
  },
);
LogoCarousel.displayName = "LogoCarousel";
