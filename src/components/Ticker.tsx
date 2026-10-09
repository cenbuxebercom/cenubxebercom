import { getAllArticles } from "@/lib/articles";

const fallback = ["Cənub Xəbər — Azərbaycan xəbər portalı", "Operativ", "Dəqiq", "Müstəqil"];

export default async function Ticker() {
  const latest = (await getAllArticles()).slice(0, 8).map((a) => a.title);
  const base = latest.length ? latest : fallback;
  const items = [...base, ...base, ...base, ...base];
  // sabit sürət: hər element üçün ~8 saniyə (≈55px/s)
  const duration = `${items.length * 8}s`;
  return (
    <div className="overflow-hidden bg-brand py-3 text-white">
      <div className="animate-marquee flex w-max whitespace-nowrap text-[14px]" style={{ animationDuration: duration }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {items.map((t, i) => (
              <span key={i} className="flex items-center">
                <span>{t}</span>
                <span className="mx-6 inline-block h-1.5 w-1.5 bg-white" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
