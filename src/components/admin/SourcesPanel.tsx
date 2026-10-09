"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

type Source = { id: string; name: string; url: string; active: boolean; last_run_at: string | null };
type Stats = { at: string; done: number; skipped: number; failed: number; published: number; seconds: number; errors: string[] };
type Auto = { enabled: boolean; status: Stats | null; today: number; ai: string | null; cron: boolean };

const input = "w-full rounded-lg border border-[#d9d3cc] bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-navy";
const btn = "rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-50";

export default function SourcesPanel({ flash, onImported }: { flash: (t: "ok" | "err", m: string) => void; onImported: () => void }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [auto, setAuto] = useState<Auto | null>(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [running, setRunning] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [s, a] = await Promise.all([api<{ sources: Source[] }>("/api/admin/sources"), api<Auto>("/api/admin/auto")]);
    if (s.error) flash("err", s.error);
    else setSources(s.sources ?? []);
    if (!a.error) setAuto(a);
  }, [flash]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, 20000); // statusu avtomatik yenilə
    return () => clearInterval(id);
  }, [load]);

  const add = async () => {
    const r = await api("/api/admin/sources", { method: "POST", body: JSON.stringify(form) });
    if (r.error) return flash("err", r.error);
    flash("ok", "Sayt əlavə olundu — avtomatik rejimə düşdü, növbəti yoxlamada xəbərlər çəkiləcək");
    setForm({ name: "", url: "" });
    load();
  };
  const toggleActive = async (s: Source) => {
    const r = await api(`/api/admin/sources/${s.id}`, { method: "PUT", body: JSON.stringify({ name: s.name, url: s.url, active: !s.active }) });
    if (r.error) return flash("err", r.error);
    load();
  };
  const remove = async (s: Source) => {
    if (!confirm(`"${s.name}" saytı siyahıdan silinsin? (Əvvəl çəkilmiş xəbərlər qalır.)`)) return;
    const r = await api(`/api/admin/sources/${s.id}`, { method: "DELETE" });
    if (r.error) return flash("err", r.error);
    load();
  };
  const setEnabled = async (enabled: boolean) => {
    const r = await api("/api/admin/auto", { method: "PUT", body: JSON.stringify({ enabled }) });
    if (r.error) return flash("err", r.error);
    flash("ok", enabled ? "Avtomatik rejim işə salındı" : "Avtomatik rejim dayandırıldı");
    load();
  };
  const runNow = async (sourceId?: string) => {
    setRunning(sourceId ?? "all");
    flash("ok", "Saytlar yoxlanılır və xəbərlər yazılır… 1–4 dəqiqə çəkə bilər, səhifəni bağlamayın");
    const r = await api<Stats>("/api/admin/auto/run", { method: "POST", body: JSON.stringify({ sourceId }) });
    setRunning(null);
    if (r.error) return flash("err", r.error);
    flash(r.failed && !r.done ? "err" : "ok", `${r.done} xəbər əlavə olundu, ${r.skipped} ötürüldü, ${r.failed} xəta${r.errors?.length ? " — " + r.errors[0] : ""}`);
    if (r.done) onImported();
    load();
  };

  const st = auto?.status;
  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[18px] font-semibold">Avtomatik xəbər çəkmə</h2>
          <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${auto?.enabled ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            {auto ? (auto.enabled ? "● Avto rejim aktivdir" : "● Dayandırılıb") : "…"}
          </span>
          <div className="ml-auto flex gap-2">
            {auto && (
              <button onClick={() => setEnabled(!auto.enabled)} className={`${btn} ${auto.enabled ? "bg-amber-50 text-amber-800 hover:bg-amber-100" : "bg-green-600 text-white hover:bg-green-700"}`}>
                {auto.enabled ? "Dayandır" : "İşə sal"}
              </button>
            )}
            <button disabled={!!running || !sources.length} onClick={() => runNow()} className={`${btn} bg-navy text-white hover:bg-[#1a1a80]`}>
              {running === "all" ? "Çəkilir…" : "İndi yoxla"}
            </button>
          </div>
        </div>
        <p className="mt-2 text-[13px] leading-[1.7] text-[#6f6f6f]">
          Aşağıdakı saytlar hər <b>5 dəqiqədən bir</b> yoxlanılır. Yeni xəbər tapılanda AI onu oxuyur, Azərbaycan dilində özü yenidən yazır,
          kateqoriyasını müəyyən edir və saytda dərhal dərc edir. Heç bir əl işi lazım deyil.
        </p>
        <div className="mt-4 grid gap-3 text-[13px] sm:grid-cols-3">
          <div className="rounded-xl bg-[#f4f2ee] p-3"><p className="text-[#8a8a8a]">Bu gün çəkilən</p><p className="mt-1 text-[22px] font-semibold">{auto?.today ?? "—"}</p></div>
          <div className="rounded-xl bg-[#f4f2ee] p-3">
            <p className="text-[#8a8a8a]">Son yoxlama</p>
            <p className="mt-1 font-semibold">{st ? new Date(st.at).toLocaleTimeString("az") : "hələ olmayıb"}</p>
            {st && <p className="text-[12px] text-[#6f6f6f]">+{st.done} · ötürülən {st.skipped} · xəta {st.failed} · {st.seconds}s</p>}
          </div>
          <div className="rounded-xl bg-[#f4f2ee] p-3">
            <p className="text-[#8a8a8a]">Sistem</p>
            <p className="mt-1 text-[12px] leading-[1.6]">
              AI: <b>{auto?.ai ? (auto.ai === "gemini" ? "Gemini (pulsuz)" : "Claude") : "yoxdur ⚠"}</b><br />
              Planlayıcı (CRON_SECRET): <b>{auto?.cron ? "hazırdır" : "yoxdur ⚠"}</b>
            </p>
          </div>
        </div>
        {st?.errors?.length ? (
          <ul className="mt-3 space-y-1 rounded-lg bg-red-50 p-3 text-[12px] leading-[1.6] text-red-700">
            {st.errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        ) : null}
        {auto && (!auto.ai || !auto.cron) && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-[12px] leading-[1.6] text-amber-800">
            Avtomatik işləmək üçün Vercel-də {!auto.ai && <b>GEMINI_API_KEY</b>}{!auto.ai && !auto.cron && " və "}{!auto.cron && <b>CRON_SECRET</b>} əlavə olunmalıdır (KURULUM.md → 3c).
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-[18px] font-semibold">Saytlar</h2>
        <p className="mt-1 text-[13px] text-[#6f6f6f]">Saytın adını və RSS linkini (və ya ana səhifə linkini) yazıb əlavə edin — qalanını sistem özü edir.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr_auto]">
          <input className={input} placeholder="Sayt adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={input} placeholder="https://numune.az/rss  (və ya https://numune.az)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <button onClick={add} className={`${btn} bg-brand text-white hover:bg-[#c43a2e]`}>+ Əlavə et</button>
        </div>

        {sources.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#6f6f6f]">Hələ sayt əlavə olunmayıb.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[#eee9e3]">
            {sources.map((s) => (
              <li key={s.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{s.name} {!s.active && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-normal text-amber-800">dayandırılıb</span>}</p>
                  <p className="truncate text-[12px] text-[#6f6f6f]">{s.url}</p>
                  {s.last_run_at && <p className="text-[11px] text-[#8a8a8a]">Son yoxlama: {new Date(s.last_run_at).toLocaleString("az")}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={s.active} onChange={() => toggleActive(s)} /> Avto</label>
                  <button disabled={!!running} onClick={() => runNow(s.id)} className={`${btn} bg-[#f4f2ee] py-2 hover:bg-[#e9e5df]`}>{running === s.id ? "Çəkilir…" : "İndi yoxla"}</button>
                  <button disabled={!!running} onClick={() => remove(s)} className={`${btn} bg-red-50 py-2 text-red-700 hover:bg-red-100`}>Sil</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
