import Link from "next/link";
import Ticker from "./Ticker";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";
import Glow from "./fx/Glow";
import Reveal from "./fx/Reveal";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_TEL, SOCIALS } from "@/lib/site";

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
const socials = [
  { label: "Facebook", href: SOCIALS.facebook, I: FacebookIcon },
  { label: "Instagram", href: SOCIALS.instagram, I: InstagramIcon },
  { label: "YouTube", href: SOCIALS.youtube, I: YoutubeIcon },
  { label: "TikTok", href: SOCIALS.tiktok, I: TiktokIcon },
];

export default function Footer() {
  return (
    <footer className="mt-24">
      <Ticker />
      <Glow className="bg-navy text-white" color="rgba(120,130,255,0.22)">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-8 pt-14 sm:px-8 2xl:px-0">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-16">
            <Reveal>
              <Logo size="lg" />
              <p className="mt-5 max-w-[420px] text-[14px] leading-[1.9] text-white/50">
                Cənub Xəbər — Azərbaycan və dünyadan operativ, dəqiq və müstəqil xəbərlər.
              </p>
              <p className="mt-10 text-[13px] text-white/50">Bizi izləyin:</p>
              <div className="mt-4 flex gap-5">
                {socials.map(({ label, href, I }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-white transition-all hover:-translate-y-1 hover:opacity-70"><I className="h-6 w-6" /></a>
                ))}
              </div>
            </Reveal>
            {[colA, colB].map((col, ci) => (
              <Reveal key={ci} delay={0.08 * (ci + 1)} className="lg:min-w-[150px]">
                <h4 className="text-[16px] font-semibold">Səhifələr</h4>
                <ul className="mt-5 space-y-3 text-[14px] text-white/60">
                  {col.map((l) => (
                    <li key={l.label}><Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link></li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.24}>
              <h4 className="text-[16px] font-semibold">Əlaqə</h4>
              <ul className="mt-5 space-y-3 text-[14px] text-white/60">
                <li>Telefon: <a href={`tel:${SITE_PHONE_TEL}`} className="text-white/90 hover:text-white">{SITE_PHONE}</a></li>
                <li>E-poçt: <a href={`mailto:${SITE_EMAIL}`} className="text-white/90 hover:text-white">{SITE_EMAIL}</a></li>
              </ul>
            </Reveal>
          </div>
          <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/60 sm:flex-row">
            <p>© 2026 Cənub Xəbər. Bütün hüquqlar qorunur.</p>
            <p className="flex items-center">
              <Link href="/mexfilik-siyaseti" className="hover:text-white">Məxfilik siyasəti</Link>
              <span className="mx-3 h-4 w-px bg-white/40" />
              <Link href="/istifade-sertleri" className="hover:text-white">İstifadə şərtləri</Link>
            </p>
          </div>
        </div>
      </Glow>
    </footer>
  );
}
