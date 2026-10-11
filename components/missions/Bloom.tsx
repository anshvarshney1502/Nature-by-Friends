"use client";
import { motion, useReducedMotion } from "motion/react";

/** A flower opens when a mission is saved. */
export function Bloom() {
  const reduce = useReducedMotion();
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 120 120" className="mx-auto h-36 w-36" aria-hidden>
      <motion.path d="M60 70 C 58 90, 62 104, 60 118" stroke="#3f6e2c" strokeWidth="4" fill="none" strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      {petals.map((deg, i) => (
        <motion.ellipse key={deg} cx="60" cy="34" rx="9" ry="17" fill={i % 2 ? "#f7d6cb" : "#e0785f"} stroke="#2d2a22" strokeWidth="2"
          style={{ transformOrigin: "60px 50px", rotate: deg }}
          initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.35 + i * 0.05, type: "spring", stiffness: 220, damping: 14 }} />
      ))}
      <motion.circle cx="60" cy="50" r="11" fill="#f6d77a" stroke="#2d2a22" strokeWidth="2.5"
        initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} />
    </svg>
  );
}
