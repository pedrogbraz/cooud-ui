"use client";

import { motion } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../lib/cn.js";
import { type ButtonProps, buttonVariants } from "./button.js";
import { springSnappy } from "./motion-presets.js";

export interface AnimatedButtonProps extends ButtonProps {}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      type,
      // drop asChild — not supported here
      asChild: _asChild,
      // omit handlers that clash with motion's prop signatures
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        data-slot="animated-button"
        type={type ?? "button"}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={springSnappy}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
AnimatedButton.displayName = "AnimatedButton";
