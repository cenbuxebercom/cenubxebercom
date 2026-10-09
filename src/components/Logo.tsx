"use client";
import Link from "next/link";

/** Logo — "Cənub" + qırmızı "Xəbər" lövhəsi. Ana səhifədə olanda kliklə yuxarı qalxır. */
export function goTop(e: React.MouseEvent) {
  if (window.location.pathname === "/") {
    e.preventDefault();
    const l = (window as Window & { cxLenis?: { scrollTo: (y: number, o?: object) => void } }).cxLenis;
    if (l) l.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const a = size === "lg" ? "text-[34px]" : "text-[26px]";
  const b = size === "lg" ? "text-[30px]" : "text-[22px]";
  return (
    <Link href="/" onClick={goTop} aria-label="Cənub Xəbər — ana səhifə" className="group flex items-center gap-1.5 leading-none">
      <span className={`${a} font-extrabold tracking-[-0.05em] text-white`}>Cənub</span>
      <span className={`${b} -skew-x-6 rounded-[5px] bg-brand px-2 py-1 font-extrabold tracking-[-0.04em] text-white shadow-[0_4px_14px_rgba(220,68,55,0.45)] transition-transform group-hover:-translate-y-0.5`}>Xəbər</span>
    </Link>
  );
}
