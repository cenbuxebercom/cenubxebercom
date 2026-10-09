"use client";
import { useSyncExternalStore } from "react";
import { ClockIcon, FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";
import { SOCIALS } from "@/lib/site";

const DAYS = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Bakı vaxtı (UTC+4) ilə: "Cümə, 9 oktyabr 2026|18:00:50" */
function now() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Baku", weekday: "short", year: "numeric", month: "numeric", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return `${DAYS[WD.indexOf(p.weekday)]}, ${p.day} ${MONTHS[+p.month - 1]} ${p.year}|${p.hour}:${p.minute}:${p.second}`;
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
  const [date, time] = useSyncExternalStore(subscribe, now, () => "|").split("|");
  return (
    <div className="bg-navy text-[13px] text-white/70">
      <div className="mx-auto flex h-10 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 2xl:px-0">
        <div className="flex items-center gap-3">
          <span className="min-h-4 first-letter:uppercase">{date}</span>
          <span className="flex min-w-[88px] items-center gap-1.5 rounded-md bg-brand px-2.5 py-1 font-semibold tabular-nums text-white shadow-[0_2px_10px_rgba(220,68,55,0.4)]">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>{time || "--:--:--"}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {socials.map(({ label, href, I }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition-colors hover:text-white"><I className="h-4 w-4" /></a>
          ))}
        </div>
      </div>
    </div>
  );
}
