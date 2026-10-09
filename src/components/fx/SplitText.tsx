"use client";
import { motion, useReducedMotion } from "motion/react";

/** Söz maskası ilə başlıq animasiyası (hər söz aşağıdan fırlanaraq qalxır). */
export default function SplitText({
  text, className, as: Tag = "h1", delay = 0, step = 0.045,
}: { text: string; className?: string; as?: "h1" | "h2" | "h3" | "p"; delay?: number; step?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              initial={reduce ? false : { y: "115%", rotate: 6, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + i * step }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
