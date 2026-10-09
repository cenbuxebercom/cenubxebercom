"use client";
import { useEffect, useState } from "react";
import { setReady } from "./ready";

const Mark = () => (
  <div className="preloader-mark">
    <span>C</span>
    <span className="text-brand">X</span>
  </div>
);

/** Giriş preloader-i: logo → "şüşə qırılması" (8 üçbucaq parça) → sayt açılır. */
export default function Preloader() {
  const [phase, setPhase] = useState<"in" | "breaking" | "done" | "gone">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t: ReturnType<typeof setTimeout>[] = [];
    if (reduce) {
      t.push(setTimeout(() => { setPhase("done"); setReady(); }, 350));
    } else {
      t.push(setTimeout(() => setPhase("breaking"), 780));
      t.push(setTimeout(() => { setPhase("done"); setReady(); }, 1320));
    }
    t.push(setTimeout(() => setPhase("gone"), 2000));
    // təhlükəsizlik klapanı
    t.push(setTimeout(() => { setReady(); setPhase("gone"); }, 4000));
    return () => t.forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;
  return (
    <div
      className={`preloader ${phase === "breaking" ? "is-breaking" : ""} ${phase === "done" ? "is-done" : ""}`}
      aria-hidden
    >
      <div className="preloader-logo-wrap">
        <div className="preloader-logo"><Mark /></div>
        <div className="preloader-shards">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shard"><Mark /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
