"use client";
import { useEffect } from "react";

/** Xəbər açılanda baxış sayını 1 artırır (sessiyada bir dəfə). */
export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const k = `cx-v-${slug}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {}
    fetch("/api/views", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug }), keepalive: true }).catch(() => {});
  }, [slug]);
  return null;
}
