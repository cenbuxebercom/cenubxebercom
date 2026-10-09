import { tickerHeadlines } from "@/data/news";

export default function Ticker() {
  const items = [...tickerHeadlines, ...tickerHeadlines, ...tickerHeadlines, ...tickerHeadlines];
  return (
    <div className="overflow-hidden bg-brand py-[18px] text-white">
      <div className="animate-marquee flex w-max whitespace-nowrap text-[17px]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {items.map((t, i) => (
              <span key={i} className="flex items-center">
                <span>{t}</span>
                <span className="mx-8 inline-block h-2 w-2 bg-white" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
