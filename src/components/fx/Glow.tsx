"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Daxilində kursoru izləyən dairəvi işıq (mouse-glow). */
export default function Glow({ children, className = "", color = "rgba(220,68,55,0.28)" }: { children: React.ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 20 });
  const y = useSpring(my, { stiffness: 120, damping: 20 });
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set(e.clientX - r.left - 200);
        my.set(e.clientY - r.top - 200);
      }}
    >
      <motion.div
        aria-hidden
        style={{ x, y, background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
