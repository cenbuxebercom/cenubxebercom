"use client";
import { useEffect, useRef } from "react";

const HOT = "a, button, input, textarea, select, label, summary, [role='button']";

/** Xüsusi cursor: boşluqda kiçik nöqtə, interaktiv elementlərdə LED-glow halqa. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const root = document.documentElement;
    root.classList.add("cursor-custom");
    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2, rx: 0, ry: 0 };
    p.rx = p.x;
    p.ry = p.y;

    const move = (e: MouseEvent) => { p.x = e.clientX; p.y = e.clientY; };
    const over = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(HOT)) root.classList.add("cursor-hot");
    };
    const out = (e: MouseEvent) => {
      const t = e.target as Element;
      const r = e.relatedTarget as Element | null;
      if (t?.closest?.(HOT) && !r?.closest?.(HOT)) root.classList.remove("cursor-hot");
    };
    const hide = () => root.classList.add("cursor-hidden");
    const show = () => root.classList.remove("cursor-hidden");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseout", out, { passive: true });
    root.addEventListener("mouseleave", hide);
    root.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);

    let id = 0;
    const frame = () => {
      p.rx += (p.x - p.rx) * 0.2;
      p.ry += (p.y - p.ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${p.rx.toFixed(2)}px, ${p.ry.toFixed(2)}px, 0)`;
      id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      root.removeEventListener("mouseleave", hide);
      root.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
      root.classList.remove("cursor-custom", "cursor-hot", "cursor-hidden");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
