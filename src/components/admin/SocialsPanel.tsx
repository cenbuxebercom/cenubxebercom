"use client";
import { useEffect, useState } from "react";
import { api } from "./api";

const input = "w-full rounded-lg border border-[#d9d3cc] bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-navy";
const fields = [
  ["facebook", "Facebook", "https://www.facebook.com/sehifeniz"],
  ["instagram", "Instagram", "https://www.instagram.com/hesabiniz"],
  ["youtube", "YouTube", "https://www.youtube.com/@kanaliniz"],
  ["tiktok", "TikTok", "https://www.tiktok.com/@hesabiniz"],
] as const;

export default function SocialsPanel({ flash }: { flash: (t: "ok" | "err", m: string) => void }) {
  const [v, setV] = useState<Record<string, string>>({ facebook: "", instagram: "", youtube: "", tiktok: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ socials: Record<string, string> }>("/api/admin/settings").then((r) => {
      if (r.socials) setV(r.socials);
    });
  }, []);

  const save = async () => {
    setBusy(true);
    const r = await api("/api/admin/settings", { method: "PUT", body: JSON.stringify({ socials: v }) });
    setBusy(false);
    if (r.error) flash("err", r.error);
    else flash("ok", "Sosial şəbəkə linkləri yadda saxlanıldı və saytda yeniləndi");
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-[18px] font-semibold">Sosial şəbəkə linkləri</h2>
      <p className="mt-1 text-[13px] leading-[1.6] text-[#6f6f6f]">
        Linki <b>https://</b> ilə yazın. Boş saxladığınız şəbəkənin ikonu saytda (üst bar, footer, əlaqə səhifəsi) göstərilmir.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map(([k, label, ph]) => (
          <label key={k}>
            <span className="mb-1 block text-[13px] text-[#6f6f6f]">{label}</span>
            <input className={input} placeholder={ph} value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <button disabled={busy} onClick={save} className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#c43a2e] disabled:opacity-50">
        {busy ? "Saxlanılır…" : "Yadda saxla"}
      </button>
    </section>
  );
}
