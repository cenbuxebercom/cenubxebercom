"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/** Scroll parallax — daxili element konteynerin içində yavaş sürüşür. */
export default function Parallax({ children, className, amount = 40 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y, scale: 1.12 }} className="h-full w-full">{children}</motion.div>
    </div>
  );
}
