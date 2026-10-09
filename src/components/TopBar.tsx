"use client";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()),
    );
  }, []);
  return (
    <div className="bg-navy text-[14px] text-white/60">
      <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center justify-between px-5 sm:px-8 xl:px-0">
        <span className="min-h-5">{date}</span>
        <span className="hidden sm:block">
          The Weekly Digest <span className="mx-3">•</span> $3.50
        </span>
      </div>
    </div>
  );
}
