"use client";
import { useState } from "react";
import { SITE_EMAIL } from "@/data/news";
import Magnetic from "./fx/Magnetic";

const f = "h-[56px] w-full border border-[#d9d3cc] bg-white px-5 text-[17px] outline-none transition-colors focus:border-navy";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const body = `${msg}\n\nAd: ${name}\nE-poçt: ${email}`;
        window.location.href = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent("Cənub Xəbər — əlaqə")}&body=${encodeURIComponent(body)}`;
      }}
      className="space-y-4"
    >
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız" className={f} />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-poçt ünvanı" className={f} />
      <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Mesajınız" rows={6} className={`${f} h-auto py-4`} />
      <Magnetic className="inline-block">
        <button className="bg-navy px-10 py-4 text-[17px] font-medium text-white transition-colors hover:bg-[#1a1a80]">Göndər</button>
      </Magnetic>
    </form>
  );
}
