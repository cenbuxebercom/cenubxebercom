import Link from "next/link";
import { ArrowRight } from "./icons";
import Reveal from "./fx/Reveal";

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 2xl:px-0 ${className}`}>{children}</div>
);

export const Dot = () => (
  <span className="mx-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[#ee9a93] align-middle" />
);

export function SectionHeading({
  title, href, dark = false, square = true,
}: { title: string; href?: string; dark?: boolean; square?: boolean }) {
  return (
    <Reveal>
      <div className="flex items-center gap-5">
        {square && <span className="h-6 w-6 shrink-0 bg-brand" />}
        <h2 className={`text-[22px] font-medium tracking-[-0.04em] sm:text-[26px] ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
        <span className={`h-px flex-1 ${dark ? "bg-white/25" : "bg-[#e6e1db]"}`} />
        {href && (
          <Link href={href} className="group flex shrink-0 items-center gap-2.5 text-[14px] text-brand">
            Hamısı <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block bg-brand px-3 py-1.5 text-[13px] leading-none text-white">{children}</span>
);

export function Empty({ title = "Hələlik xəbər yoxdur", text = "Xəbərlər əlavə olunduqca burada görünəcək." }: { title?: string; text?: string }) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-dashed border-[#d9d3cc] bg-[#fdf6f1] px-6 py-20 text-center">
        <p className="text-[20px] font-semibold tracking-[-0.03em] text-navy">{title}</p>
        <p className="mt-3 text-[15px] text-[#6f6f6f]">{text}</p>
      </div>
    </Reveal>
  );
}
