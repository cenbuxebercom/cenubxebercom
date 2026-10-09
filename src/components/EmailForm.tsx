"use client";
import { useState } from "react";
import { SITE_EMAIL } from "@/data/news";
import Magnetic from "./fx/Magnetic";

/** Redaksiyaya e-poçt göndərmək — istifadəçinin poçt proqramını hazır məktubla açır. */
export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
      <h2 className="max-w-[560px] text-[32px] font-semibold leading-[1.2] tracking-[-0.04em] sm:text-[36px]">
        Redaksiyaya e-poçt göndərin, <span className="text-[#6f73a6]">xəbər və təkliflərinizi bölüşün.</span>
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const body = `${msg}\n\nƏlaqə e-poçtu: ${email}`;
          window.location.href = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent("Cənub Xəbər — müraciət")}&body=${encodeURIComponent(body)}`;
        }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-poçt ünvanınız"
          className="h-[60px] w-full border border-white/25 bg-[#1a1a66] px-5 text-[17px] text-white outline-none transition-colors placeholder:text-white/50 focus:border-white/60 sm:w-[340px]"
        />
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Mesajınız"
          className="h-[60px] w-full border border-white/25 bg-[#1a1a66] px-5 text-[17px] text-white outline-none transition-colors placeholder:text-white/50 focus:border-white/60 sm:w-[280px]"
        />
        <Magnetic>
          <button className="h-[60px] bg-[#fdf3ee] px-10 text-[17px] font-medium text-navy transition-colors hover:bg-white">E-poçt göndər</button>
        </Magnetic>
      </form>
    </div>
  );
}
