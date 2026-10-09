"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { categories } from "@/data/news";

const nav = [
  { label: "Ana səhifə", href: "/" },
  { label: "Gündəm", href: "/gundem" },
  { label: "Son xəbərlər", href: "/son" },
  { label: "Kateqoriyalar", href: "/kateqoriya", menu: true },
  { label: "Haqqımızda", href: "/haqqimizda" },
  { label: "Əlaqə", href: "/elaqe" },
];

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link href="/" className={`font-bold leading-none tracking-[-0.06em] text-white ${className}`}>Cənub Xəbər</Link>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const path = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y <= 120) setHidden(false);
    else if (y - prev > 4 && !open) setHidden(true);
    else if (y - prev < -4) setHidden(false);
  });

  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-navy"
    >
      <div className="mx-auto flex h-[88px] w-full max-w-[1360px] items-center justify-between px-5 sm:px-8 md:h-[111px] xl:px-0">
        <Logo className="text-[38px] md:text-[48px]" />
        <nav className="hidden items-center text-[17px] text-[#b8c0ff] xl:flex">
          {nav.map((n, i) => (
            <span key={n.href} className="group relative flex items-center">
              {i > 0 && <span className="mx-3.5 text-[10px]">•</span>}
              <Link href={n.href} className={`transition-colors hover:text-white ${active(n.href) ? "text-white" : ""}`}>{n.label}</Link>
              {n.menu && (
                <div className="invisible absolute left-1/2 top-full z-50 w-[260px] -translate-x-1/2 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-xl bg-white p-3 text-[16px] text-ink shadow-2xl">
                    {categories.map((c) => (
                      <Link key={c.slug} href={`/kateqoriya/${c.slug}`} className="block rounded-lg px-4 py-2.5 transition-colors hover:bg-[#fdf3ee] hover:text-brand">{c.name}</Link>
                    ))}
                  </div>
                </div>
              )}
            </span>
          ))}
        </nav>
        <button aria-label="Menyu" onClick={() => setOpen(!open)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 xl:hidden">
          <span className={`h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="max-h-[75vh] overflow-y-auto border-t border-white/10 px-5 pb-5 pt-3 text-[18px] text-[#b8c0ff] xl:hidden" data-lenis-prevent>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2.5">{n.label}</Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-x-4 border-t border-white/10 pt-3 text-[16px]">
            {categories.map((c) => (
              <Link key={c.slug} href={`/kateqoriya/${c.slug}`} onClick={() => setOpen(false)} className="py-2 text-white/70">{c.name}</Link>
            ))}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
