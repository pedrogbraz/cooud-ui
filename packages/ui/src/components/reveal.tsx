"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { fadeInUp } from "./motion-presets.js";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  once?: boolean;
}

export const Reveal = ({
  className,
  delay,
  once,
  children,
  // omit handlers that clash with motion's prop signatures
  onDrag,
  onDragStart,
  onDragEnd,
  onAnimationStart,
  ...props
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: once ?? true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      data-slot="reveal"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
Reveal.displayName = "Reveal";
