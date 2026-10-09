import Link from "next/link";
import Ticker from "./Ticker";
import { Logo } from "./Header";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "./icons";
import Glow from "./fx/Glow";
import Reveal from "./fx/Reveal";
import { SITE_EMAIL } from "@/data/news";

const colA = [
  { label: "Ana səhifə", href: "/" },
  { label: "Gündəm", href: "/gundem" },
  { label: "Son xəbərlər", href: "/son" },
  { label: "Kateqoriyalar", href: "/kateqoriya" },
];
const colB = [
  { label: "Haqqımızda", href: "/haqqimizda" },
  { label: "Əlaqə", href: "/elaqe" },
  { label: "Məxfilik siyasəti", href: "/mexfilik-siyaseti" },
  { label: "İstifadə şərtləri", href: "/istifade-sertleri" },
];

export default function Footer() {
  return (
    <footer className="mt-24">
      <Ticker />
      <Glow className="bg-navy text-white" color="rgba(120,130,255,0.22)">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-8 pt-14 sm:px-8 2xl:px-0">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-16">
            <Reveal>
              <Logo className="text-[32px] md:text-[36px]" />
              <p className="mt-5 max-w-[480px] text-[15px] leading-[1.9] text-white/40">
                Cənub Xəbər — Azərbaycan və dünyadan operativ, dəqiq və müstəqil xəbərlər.
              </p>
              <p className="mt-16 text-[14px] text-white/40">Bizi izləyin:</p>
              <div className="mt-5 flex gap-7">
                {[XIcon, FacebookIcon, InstagramIcon, LinkedinIcon].map((I, i) => (
                  <a key={i} href="#" aria-label="sosial şəbəkə" className="text-white transition-all hover:-translate-y-1 hover:opacity-70"><I className="h-7 w-7" /></a>
                ))}
              </div>
            </Reveal>
            {[colA, colB].map((col, ci) => (
              <Reveal key={ci} delay={0.08 * (ci + 1)} className="lg:min-w-[150px]">
                <h4 className="text-[16px] font-semibold">Səhifələr</h4>
                <ul className="mt-6 space-y-3.5 text-[15px] text-white/60">
                  {col.map((l) => (
                    <li key={l.label}><Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link></li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.24}>
              <h4 className="text-[16px] font-semibold">Əlaqə</h4>
              <ul className="mt-6 space-y-3.5 text-[15px] text-white/60">
                <li>E-poçt: <a href={`mailto:${SITE_EMAIL}`} className="hover:text-white">{SITE_EMAIL}</a></li>
              </ul>
            </Reveal>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 text-[15px] text-white/60 sm:flex-row">
            <p>© 2026 Cənub Xəbər. Bütün hüquqlar qorunur.</p>
            <p className="flex items-center">
              <Link href="/mexfilik-siyaseti" className="hover:text-white">Məxfilik siyasəti</Link>
              <span className="mx-3 h-5 w-px bg-white/40" />
              <Link href="/istifade-sertleri" className="hover:text-white">İstifadə şərtləri</Link>
            </p>
          </div>
        </div>
      </Glow>
    </footer>
  );
}
