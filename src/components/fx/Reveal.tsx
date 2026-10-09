"use client";
import { motion, useReducedMotion } from "motion/react";

const from = {
  up: { y: 44 },
  down: { y: -38 },
  left: { x: 52 },
  right: { x: -52 },
};

/** Scroll-reveal: istiqamətli sürüşmə + yüngül skala + yumşaq blur. Hər görünəndə təkrarlanır. */
export default function Reveal({
  children, className, delay = 0, dir = "up", once = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dir?: keyof typeof from;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(2px)", scale: 0.985, ...from[dir] }}
      whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
