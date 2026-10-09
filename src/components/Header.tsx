"use client";
import Link from "next/link";
import { useState } from "react";

export const nav = [
  { label: "About", href: "/about" },
  { label: "Authors", href: "/authors" },
  { label: "Subscription", href: "/subscription" },
  { label: "Contact Us", href: "/contact" },
  { label: "Category", href: "/category" },
  { label: "News", href: "/news" },
];

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link href="/" className={`font-bold leading-none tracking-[-0.06em] text-white ${className}`}>PressPoint</Link>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-navy">
      <div className="mx-auto flex h-[88px] w-full max-w-[1360px] items-center justify-between px-5 sm:px-8 md:h-[111px] xl:px-0">
        <Logo className="text-[44px] md:text-[60px]" />
        <nav className="hidden items-center text-[17px] text-[#b8c0ff] lg:flex">
          {nav.map((n, i) => (
            <span key={n.href} className="flex items-center">
              {i > 0 && <span className="mx-3.5 text-[10px]">•</span>}
              <Link href={n.href} className="transition-colors hover:text-white">{n.label}</Link>
            </span>
          ))}
        </nav>
        <Link href="/subscription" className="hidden bg-white px-8 py-3.5 text-[17px] font-medium text-navy transition-colors hover:bg-[#f2eeea] lg:block">
          Subscribe
        </Link>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden">
          <span className="h-0.5 w-6 bg-white" /><span className="h-0.5 w-6 bg-white" /><span className="h-0.5 w-6 bg-white" />
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-5 pb-5 pt-3 text-[18px] text-[#b8c0ff] lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5">{n.label}</Link>
          ))}
          <Link href="/subscription" onClick={() => setOpen(false)} className="mt-2 bg-white py-3 text-center font-medium text-navy">Subscribe</Link>
        </nav>
      )}
    </header>
  );
}
