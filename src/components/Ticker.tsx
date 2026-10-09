import { getLatest } from "@/data/news";

const fallback = ["Cənub Xəbər — Azərbaycan xəbər portalı", "Operativ", "Dəqiq", "Müstəqil"];

export default function Ticker() {
  const latest = getLatest().slice(0, 6).map((a) => a.title);
  const base = latest.length ? latest : fallback;
  const items = [...base, ...base, ...base, ...base];
  return (
    <div className="overflow-hidden bg-brand py-3 text-white">
      <div className="animate-marquee flex w-max whitespace-nowrap text-[15px]">
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
