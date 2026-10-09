"use client";
import { useState } from "react";

const f = "h-[56px] w-full border border-[#d9d3cc] bg-white px-5 text-[17px] outline-none focus:border-navy";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <input required placeholder="Your name" className={f} />
      <input required type="email" placeholder="Email address" className={f} />
      <textarea required placeholder="Message" rows={6} className={`${f} h-auto py-4`} />
      <button className="bg-navy px-10 py-4 text-[17px] font-medium text-white">{sent ? "Sent — thank you!" : "Send message"}</button>
    </form>
  );
}
