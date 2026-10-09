import Link from "next/link";
import Img from "./Img";
import Tilt from "./fx/Tilt";
import { Badge, Dot } from "./ui";
import type { Article } from "@/lib/articles";
import { categoryName, fmtLong, fmtShort } from "@/data/news";

const href = (a: Article) => `/xeber/${a.slug}`;

export const Meta = ({ a, short = false }: { a: Article; short?: boolean }) => (
  <p className="text-[13px] leading-none text-[#6f6f6f]">
    <Link href={`/kateqoriya/${a.category}`} className="hover:text-brand">{categoryName(a.category)}</Link>
    <Dot />
    {short ? fmtShort(a.date) : fmtLong(a.date)}
  </p>
);

const title = "text-[16px] font-semibold leading-[1.35] tracking-[-0.01em]";

/** kiçik şəkil solda, mətn sağda */
export function ListItem({ a, badge }: { a: Article; badge?: string }) {
  return (
    <article className="flex gap-4 border-b border-[#e6e1db] py-5 first:pt-0 last:border-b-0">
      <Link href={href(a)} className="block h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl">
        <Img src={a.image} alt={a.title} sizes="104px" className="transition-transform duration-500 hover:scale-105" />
      </Link>
      <div className="flex flex-col justify-center gap-4">
        {badge && <div><Badge>{badge}</Badge></div>}
        <Meta a={a} />
        <h3 className={title}><Link href={href(a)} className="hover:text-brand">{a.title}</Link></h3>
      </div>
    </article>
  );
}

/** böyük şəkil, kateqoriya/tarix, başlıq */
export function ImageCard({ a, ratio = "aspect-[1.18/1]", short = true }: { a: Article; ratio?: string; short?: boolean }) {
  return (
    <Tilt>
      <article>
        <Link href={href(a)} className={`block overflow-hidden rounded-xl ${ratio}`}>
          <Img src={a.image} alt={a.title} className="transition-transform duration-500 hover:scale-105" />
        </Link>
        <div className="mt-5 flex flex-col gap-4">
          <Meta a={a} short={short} />
          <h3 className={title}><Link href={href(a)} className="hover:text-brand">{a.title}</Link></h3>
        </div>
      </article>
    </Tilt>
  );
}

/** şəkil, müəllif | tarix, başlıq */
export function AuthorCard({ a, ratio = "aspect-[1.55/1]" }: { a: Article; ratio?: string }) {
  return (
    <Tilt>
      <article>
        <Link href={href(a)} className={`block overflow-hidden rounded-xl ${ratio}`}>
          <Img src={a.image} alt={a.title} className="transition-transform duration-500 hover:scale-105" />
        </Link>
        <div className="mt-5 flex items-center text-[14px] text-[#6f6f6f]">
          {a.author && (<><span>{a.author}</span><span className="mx-3 h-5 w-px bg-[#6f6f6f]" /></>)}
          <span>{fmtLong(a.date)}</span>
        </div>
        <h3 className={`mt-3 ${title}`}><Link href={href(a)} className="hover:text-brand">{a.title}</Link></h3>
      </article>
    </Tilt>
  );
}

/** qradiyent üzərində badge + başlıq */
export function OverlayCard({ a, className = "", size = "lg" }: { a: Article; className?: string; size?: "lg" | "md" }) {
  return (
    <article className={`group relative overflow-hidden rounded-xl ${className}`}>
      <Link href={href(a)} className="absolute inset-0"><span className="sr-only">{a.title}</span></Link>
      <Img src={a.image} alt={a.title} sizes="(min-width: 768px) 50vw, 100vw" className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <Badge>{categoryName(a.category)}</Badge>
        <h3 className={`mt-4 font-normal leading-[1.2] tracking-[-0.04em] text-white ${size === "lg" ? "text-[20px] sm:text-[22px]" : "text-[18px]"}`}>
          {a.title}
        </h3>
      </div>
    </article>
  );
}
