"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Paper-card unfold: rises and settles once when scrolled into view. */
export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16, rotate: -0.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}
