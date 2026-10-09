"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** 3D tilt — yalnız hover edilən kartda, zəif bucaqla (±5°). */
export default function Tilt({ children, className, deg = 5 }: { children: React.ReactNode; className?: string; deg?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * deg * 2);
        rx.set((0.5 - py) * deg * 2);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}
