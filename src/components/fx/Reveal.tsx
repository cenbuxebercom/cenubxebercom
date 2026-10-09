"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const from = {
  up: { y: 28 },
  down: { y: -24 },
  left: { x: 32 },
  right: { x: -32 },
};

/**
 * Yumşaq scroll-reveal. Səhifə açılanda ekranda olan elementlər animasiyasız dərhal görünür;
 * yalnız aşağıda qalanlar scroll ilə ekrana girəndə yumşaq şəkildə açılır.
 */
export default function Reveal({
  children, className, delay = 0, dir = "up",
}: { children: React.ReactNode; className?: string; delay?: number; dir?: keyof typeof from }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -6% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    // yalnız ilk açılışda ekrandan aşağıda olan elementlər animasiya olunur
    if (el.getBoundingClientRect().top > window.innerHeight * 0.95) setArmed(true);
  }, [reduce]);

  const show = !armed || inView;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...from[dir] }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: show ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}
