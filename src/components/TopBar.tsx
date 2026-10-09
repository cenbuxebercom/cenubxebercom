"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const today = () =>
  new Intl.DateTimeFormat("az", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Baku" }).format(new Date());

export default function TopBar() {
  const date = useSyncExternalStore(subscribe, today, () => "");
  return (
    <div className="bg-navy text-[14px] text-white/60">
      <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center justify-between px-5 sm:px-8 xl:px-0">
        <span className="min-h-5 first-letter:uppercase">{date}</span>
        <span className="hidden sm:block">Azərbaycan xəbər portalı</span>
      </div>
    </div>
  );
}
