import Link from "next/link";
import { getTickerItems } from "@/lib/articles";

const fallback = [
  { title: "Cənub Xəbər — Azərbaycan xəbər portalı", slug: "" },
  { title: "Operativ", slug: "" },
  { title: "Dəqiq", slug: "" },
  { title: "Müstəqil", slug: "" },
];

/** Gündəlik xəbərlər fasiləsiz dövr edir; bir tam dövr 60 saniyə çəkir. */
export default async function Ticker() {
  const today = await getTickerItems();
  const base = today.length ? today : fallback;
  // bir zolağın eni ekrandan geniş olsun deyə siyahı təkrarlanır
  const strip = Array.from({ length: Math.ceil(8 / base.length) }).flatMap(() => base);
  return (
    <div className="overflow-hidden bg-brand py-3 text-white">
      <div className="animate-marquee flex w-max whitespace-nowrap text-[14px]" style={{ animationDuration: "60s" }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
            {strip.map((t, i) => (
              <span key={i} className="flex items-center">
                {t.slug ? (
                  <Link href={`/xeber/${t.slug}`} className="hover:underline">{t.title}</Link>
                ) : (
                  <span>{t.title}</span>
                )}
                <span className="mx-6 inline-block h-1.5 w-1.5 bg-white" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
