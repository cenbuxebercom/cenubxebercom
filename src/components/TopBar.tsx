"use client";
import { useSyncExternalStore } from "react";
import { FacebookIcon, InstagramIcon, TelegramIcon, XIcon, YoutubeIcon } from "./icons";

const DAYS = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Bakı vaxtı (UTC+4) ilə: "Cümə, 9 oktyabr 2026 • 17:52:03" */
function now() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Baku", weekday: "short", year: "numeric", month: "numeric", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  const day = DAYS[WD.indexOf(parts.weekday)];
  return `${day}, ${parts.day} ${MONTHS[+parts.month - 1]} ${parts.year} • ${parts.hour}:${parts.minute}:${parts.second}`;
}

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

const socials = [
  { label: "Facebook", href: "#", I: FacebookIcon },
  { label: "Instagram", href: "#", I: InstagramIcon },
  { label: "YouTube", href: "#", I: YoutubeIcon },
  { label: "Telegram", href: "#", I: TelegramIcon },
  { label: "X", href: "#", I: XIcon },
];

export default function TopBar() {
  const text = useSyncExternalStore(subscribe, now, () => "");
  return (
    <div className="bg-navy text-[13px] text-white/70">
      <div className="mx-auto flex h-10 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 2xl:px-0">
        <span className="min-h-4 tabular-nums">{text}</span>
        <div className="flex items-center gap-4">
          {socials.map(({ label, href, I }) => (
            <a key={label} href={href} aria-label={label} className="transition-colors hover:text-white"><I className="h-4 w-4" /></a>
          ))}
        </div>
      </div>
    </div>
  );
}
