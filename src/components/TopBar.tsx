"use client";
import { useSyncExternalStore } from "react";
import { ClockIcon, FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";
import { SOCIALS } from "@/lib/site";

const DAYS = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Bakı vaxtı (UTC+4) ilə: "Cümə, 9 oktyabr 2026|9 oktyabr, cümə|18:00:50" (uzun | qısa | saat) */
function now() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Baku", weekday: "short", year: "numeric", month: "numeric", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  const day = DAYS[WD.indexOf(p.weekday)];
  const month = MONTHS[+p.month - 1];
  return `${day}, ${p.day} ${month} ${p.year}|${p.day} ${month}|${p.hour}:${p.minute}:${p.second}`;
}

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

const socials = [
  { label: "Facebook", href: SOCIALS.facebook, I: FacebookIcon },
  { label: "Instagram", href: SOCIALS.instagram, I: InstagramIcon },
  { label: "YouTube", href: SOCIALS.youtube, I: YoutubeIcon },
  { label: "TikTok", href: SOCIALS.tiktok, I: TiktokIcon },
];

export default function TopBar() {
  const [date, shortDate, time] = useSyncExternalStore(subscribe, now, () => "||").split("|");
  return (
    <div className="bg-navy text-[12px] text-white/70 sm:text-[13px]">
      <div className="mx-auto flex h-9 w-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:h-10 sm:px-8 2xl:px-0">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="min-h-4 whitespace-nowrap first-letter:uppercase">
            <span className="sm:hidden">{shortDate}</span>
            <span className="hidden sm:inline">{date}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-brand px-2 py-0.5 font-semibold tabular-nums text-white shadow-[0_2px_10px_rgba(220,68,55,0.4)] sm:gap-1.5 sm:px-2.5 sm:py-1">
            <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="min-w-[56px] sm:min-w-[62px]">{time || "--:--:--"}</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {socials.map(({ label, href, I }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-6 w-6 items-center justify-center transition-colors hover:text-white sm:h-auto sm:w-auto"><I className="h-4 w-4" /></a>
          ))}
        </div>
      </div>
    </div>
  );
}
