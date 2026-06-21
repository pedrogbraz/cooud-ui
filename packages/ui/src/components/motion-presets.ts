import type { Transition, Variants } from "motion/react";

export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 26 };

export const springSnappy: Transition = { type: "spring", stiffness: 400, damping: 30 };

export const easeOutQuart: Transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: easeOutQuart },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeOutQuart },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: springSoft },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
