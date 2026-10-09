"use client";
import { useState } from "react";

export default function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
      <h2 className="max-w-[560px] text-[32px] font-semibold leading-[1.2] tracking-[-0.04em] sm:text-[36px]">
        Subscribe to Our Newsletter to Stay ahead with <span className="text-[#6f73a6]">daily headlines.</span>
      </h2>
      <form
        onSubmit={(e) => { e.preventDefault(); setDone(true); }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <input
          type="email"
          required
          placeholder={done ? "Thank you for subscribing!" : "Enter your email address"}
          className="h-[60px] w-full border border-white/25 bg-[#1a1a66] px-5 text-[17px] text-white outline-none placeholder:text-white/50 sm:w-[444px]"
        />
        <button className="h-[60px] bg-[#fdf3ee] px-12 text-[17px] font-medium text-navy transition-colors hover:bg-white">Subscribe</button>
      </form>
    </div>
  );
}
