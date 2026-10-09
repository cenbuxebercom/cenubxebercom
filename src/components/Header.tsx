"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  <Link href="/" className={`font-bold leading-none tracking-[-0.05em] text-white ${className}`}>Cənub Xəbər</Link>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <header className="sticky top-0 z-50 border-t border-white/10 bg-navy">
      <div className="mx-auto flex h-[60px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 2xl:px-0">
        <Logo className="text-[28px]" />
        <nav className="hidden items-center text-[14px] text-[#b8c0ff] lg:flex">
          {nav.map((n, i) => (
            <span key={n.href} className="group relative flex items-center">
              {i > 0 && <span className="mx-3 text-[8px] opacity-60">•</span>}
              <Link href={n.href} className={`py-5 transition-colors hover:text-white ${active(n.href) ? "text-white" : ""}`}>{n.label}</Link>
              {n.menu && (
                <div className="invisible absolute left-1/2 top-full z-50 w-[220px] -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-lg bg-white p-2 text-[14px] text-ink shadow-2xl">
                    {categories.map((c) => (
                      <Link key={c.slug} href={`/kateqoriya/${c.slug}`} className="block rounded-md px-3 py-2 transition-colors hover:bg-[#fdf3ee] hover:text-brand">{c.name}</Link>
                    ))}
                  </div>
                </div>
              )}
            </span>
          ))}
        </nav>
        <button aria-label="Menyu" onClick={() => setOpen(!open)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden">
          <span className={`h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="max-h-[75vh] overflow-y-auto border-t border-white/10 px-5 pb-4 pt-2 text-[15px] text-[#b8c0ff] lg:hidden" data-lenis-prevent>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2.5">{n.label}</Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-x-4 border-t border-white/10 pt-3 text-[14px]">
            {categories.map((c) => (
              <Link key={c.slug} href={`/kateqoriya/${c.slug}`} onClick={() => setOpen(false)} className="py-2 text-white/70">{c.name}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
