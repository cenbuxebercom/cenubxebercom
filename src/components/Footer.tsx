import Link from "next/link";
import Ticker from "./Ticker";
import { Logo } from "./Header";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "./icons";
import Newsletter from "./Newsletter";

const colA = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Authors", href: "/authors" },
  { label: "Subscription", href: "/subscription" },
];
const colB = [
  { label: "Contact us", href: "/contact" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms and conditions", href: "/terms" },
  { label: "404 error", href: "/404" },
];

export default function Footer() {
  return (
    <footer className="mt-24">
      <Ticker />
      <div className="bg-navy text-white">
        <div className="mx-auto w-full max-w-[1360px] px-5 pb-8 pt-20 sm:px-8 xl:px-0">
          <Newsletter />
          <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-16">
            <div>
              <Logo className="text-[56px] md:text-[64px]" />
              <p className="mt-5 max-w-[480px] text-[17px] leading-[1.9] text-white/40">
                World leaders gathered in Geneva to discuss urgent actions for global warming, pledging new commitments.
              </p>
              <p className="mt-16 text-[16px] text-white/40">Follow us on:</p>
              <div className="mt-5 flex gap-7">
                {[XIcon, FacebookIcon, InstagramIcon, LinkedinIcon].map((I, i) => (
                  <a key={i} href="#" aria-label="social" className="text-white transition-opacity hover:opacity-70"><I className="h-7 w-7" /></a>
                ))}
              </div>
            </div>
            {[colA, colB].map((col, ci) => (
              <div key={ci} className="lg:min-w-[150px]">
                <h4 className="text-[18px] font-semibold">Pages</h4>
                <ul className="mt-6 space-y-3.5 text-[17px] text-white/60">
                  {col.map((l) => (
                    <li key={l.label}><Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="text-[18px] font-semibold">Contact us</h4>
              <ul className="mt-6 space-y-3.5 text-[17px] text-white/60">
                <li>Head Office: 123 PressPoint, New York, USA.</li>
                <li>Phone: +1 (000) 123-4567</li>
                <li>Email: contact@presspoint.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 text-[17px] text-white/60 sm:flex-row">
            <p>© 2025 PressPoint. All Rights Reserved.</p>
            <p className="flex items-center">
              <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <span className="mx-3 h-5 w-px bg-white/40" />
              <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
