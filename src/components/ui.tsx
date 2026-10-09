import Link from "next/link";
import { ArrowRight } from "./icons";

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 xl:px-0 ${className}`}>{children}</div>
);

export const Dot = () => (
  <span className="mx-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[#ee9a93] align-middle" />
);

export function SectionHeading({
  title, href, dark = false, square = true,
}: { title: string; href?: string; dark?: boolean; square?: boolean }) {
  return (
    <div className="flex items-center gap-5">
      {square && <span className="h-6 w-6 shrink-0 bg-brand" />}
      <h2 className={`text-[28px] font-medium tracking-[-0.04em] sm:text-[34px] ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      <span className={`h-px flex-1 ${dark ? "bg-white/25" : "bg-[#e6e1db]"}`} />
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-2.5 text-[16px] text-brand">
          See All <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block bg-brand px-3 py-1.5 text-[14px] leading-none text-white">{children}</span>
);
