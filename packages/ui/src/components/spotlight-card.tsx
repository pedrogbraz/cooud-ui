"use client";

import { forwardRef, type HTMLAttributes, useRef, useState } from "react";
import { cn } from "../lib/cn.js";

export const SpotlightCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, onMouseMove, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const setRef = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: pointer tracking drives a purely decorative spotlight; the card is not a control.
      <div
        ref={setRef}
        data-slot="spotlight-card"
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-6 text-fg",
          className,
        )}
        onMouseMove={(event) => {
          const rect = localRef.current?.getBoundingClientRect();
          if (rect) {
            setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          }
          onMouseMove?.(event);
        }}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        {...props}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
          style={{
            background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--cooud-primary) 14%, transparent), transparent 72%)`,
          }}
        />
        <div className="relative">{children}</div>
      </div>
    );
  },
);
SpotlightCard.displayName = "SpotlightCard";
