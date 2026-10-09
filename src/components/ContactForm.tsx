"use client";
import { useState } from "react";
import Magnetic from "./fx/Magnetic";

const f = "w-full rounded-lg border border-[#d9d3cc] bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-navy";

export default function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy"); setErr("");
        try {
          const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(v) });
          const data = await res.json();
          if (!res.ok) { setErr(data.error ?? "Xəta baş verdi"); setState("err"); return; }
          setState("ok"); setV({ name: "", email: "", message: "", website: "" });
        } catch { setErr("Şəbəkə xətası"); setState("err"); }
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input required minLength={2} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="Adınız" className={f} />
        <input required type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} placeholder="E-poçt ünvanı" className={f} />
      </div>
      {/* bot tələsi — real istifadəçilər görmür */}
      <input tabIndex={-1} autoComplete="off" aria-hidden value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} className="hidden" name="website" />
      <textarea required minLength={5} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} placeholder="Mesajınız" rows={6} className={f} />
      {state === "ok" && <p className="rounded-lg bg-green-50 px-4 py-3 text-[14px] text-green-800">Mesajınız göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.</p>}
      {state === "err" && <p className="rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-700">{err}</p>}
      <Magnetic className="inline-block">
        <button disabled={state === "busy"} className="rounded-lg bg-navy px-8 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#1a1a80] disabled:opacity-60">
          {state === "busy" ? "Göndərilir…" : "Mesajı göndər"}
        </button>
      </Magnetic>
    </form>
  );
}
