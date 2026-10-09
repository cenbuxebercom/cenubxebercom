"use client";
import { useEffect } from "react";
import Lenis from "lenis";

type W = Window & { cxLenis?: Lenis };

/** Lenis — inertial/yumşaq scroll (Framer saytlarındakı hiss). */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as W).cxLenis = lenis;
    let id = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      (window as W).cxLenis = undefined;
    };
  }, []);
  return null;
}
