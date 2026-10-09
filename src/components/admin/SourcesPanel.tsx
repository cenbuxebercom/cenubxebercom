"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { categories } from "@/data/news";
import { api } from "./api";

type Source = {
  id: string; name: string; url: string; kind: string; category: string | null;
  active: boolean; auto_publish: boolean; max_per_run: number; last_run_at: string | null;
};
type Item = { url: string; title: string; date?: string; image?: string };

const input = "w-full rounded-lg border border-[#d9d3cc] bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-navy";
const btn = "rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-50";
const blank = { name: "", url: "", kind: "rss", category: "", max_per_run: 5, active: true, auto_publish: false };

export default function SourcesPanel({ flash, onImported }: { flash: (t: "ok" | "err", m: string) => void; onImported: () => void }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [form, setForm] = useState(blank);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const stop = useRef(false);

  const load = useCallback(async () => {
    const r = await api<{ sources: Source[] }>("/api/admin/sources");
    if (r.error) return flash("err", r.error);
    setSources(r.sources ?? []);
  }, [flash]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const add = async () => {
    const r = await api("/api/admin/sources", { method: "POST", body: JSON.stringify(form) });
    if (r.error) return flash("err", r.error);
    flash("ok", "Mənbə əlavə olundu");
    setForm(blank);
    load();
  };
  const patch = async (s: Source, change: Partial<Source>) => {
    const r = await api(`/api/admin/sources/${s.id}`, { method: "PUT", body: JSON.stringify({ ...s, ...change }) });
    if (r.error) return flash("err", r.error);
    load();
  };
  const remove = async (s: Source) => {
    if (!confirm(`"${s.name}" mənbəsi silinsin? (Əvvəl çəkilmiş xəbərlər qalır.)`)) return;
    const r = await api(`/api/admin/sources/${s.id}`, { method: "DELETE" });
    if (r.error) return flash("err", r.error);
    load();
  };

  const say = (m: string) => setLog((l) => [...l.slice(-200), `${new Date().toLocaleTimeString("az")}  ${m}`]);

  const run = async (list: Source[]) => {
    setRunning(true);
    stop.current = false;
    setLog([]);
    let created = 0;
    for (const s of list) {
      if (stop.current) break;
      say(`▶ ${s.name}: yeni xəbərlər axtarılır…`);
      const d = await api<{ items: Item[] }>("/api/admin/import/discover", { method: "POST", body: JSON.stringify({ sourceId: s.id }) });
      if (d.error) { say(`✖ ${s.name}: ${d.error}`); continue; }
      const items = (d.items ?? []).slice(0, s.max_per_run);
      say(`  ${(d.items ?? []).length} yeni link tapıldı, ${items.length} işlənəcək`);
      for (const it of items) {
        if (stop.current) break;
        say(`  ⏳ ${it.title || it.url}`);
        const r = await api<{ status: string; title?: string; reason?: string; error?: string; published?: boolean }>("/api/admin/import/process", {
          method: "POST", body: JSON.stringify({ sourceId: s.id, url: it.url, title: it.title, image: it.image, date: it.date }),
        });
        if (r.error) say(`  ✖ ${r.error}`);
        else if (r.status === "done") { created++; say(`  ✔ əlavə olundu${r.published ? "" : " (qaralama)"}: ${r.title}`); }
        else if (r.status === "skipped") say(`  – ötürüldü: ${r.reason}`);
        else say(`  ✖ xəta: ${r.error}`);
      }
    }
    setRunning(false);
    say(stop.current ? "■ Dayandırıldı" : `■ Bitdi. ${created} yeni xəbər əlavə olundu.`);
    if (created) { flash("ok", `${created} yeni xəbər əlavə olundu`); onImported(); }
    load();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-[18px] font-semibold">Xəbər mənbələri</h2>
        <p className="mt-1 text-[13px] leading-[1.6] text-[#6f6f6f]">
          Mənbə saytın RSS linkini (ən yaxşısı) və ya ana/bölmə səhifəsinin linkini yazın. Çəkilən hər xəbəri AI oxuyur, öz sözləri ilə
          yenidən yazır, başqa saytların adını silir və bazaya əlavə edir. Defolt olaraq xəbərlər <b>qaralama</b> kimi saxlanılır — yoxlayıb “Dərc et” basın.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-6">
          <input className={`${input} md:col-span-2`} placeholder="Ad (məs. Nümunə xəbər)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={`${input} md:col-span-4`} placeholder="https://numune.az/rss" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <select className={input} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="rss">RSS / avto-aşkar</option>
            <option value="html">Səhifə linkləri</option>
          </select>
          <select className={`${input} md:col-span-2`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Kateqoriyanı AI seçsin</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <label className="flex items-center gap-2 text-[13px]">Maks/dəfə
            <input type="number" min={1} max={20} className={`${input} w-20`} value={form.max_per_run} onChange={(e) => setForm({ ...form, max_per_run: Number(e.target.value) })} />
          </label>
          <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={form.auto_publish} onChange={(e) => setForm({ ...form, auto_publish: e.target.checked })} /> Birbaşa dərc et</label>
          <button onClick={add} className={`${btn} bg-brand text-white hover:bg-[#c43a2e] md:col-span-6 md:w-fit`}>+ Mənbə əlavə et</button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-[18px] font-semibold">Siyahı ({sources.length})</h2>
          <button disabled={running || !sources.length} onClick={() => run(sources.filter((s) => s.active))} className={`${btn} ml-auto bg-navy text-white hover:bg-[#1a1a80]`}>
            {running ? "Çəkilir…" : "Aktiv mənbələrin hamısından çək"}
          </button>
          {running && <button onClick={() => { stop.current = true; }} className={`${btn} bg-red-50 text-red-700`}>Dayandır</button>}
        </div>
        {sources.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#6f6f6f]">Hələ mənbə yoxdur.</p>
        ) : (
          <ul className="divide-y divide-[#eee9e3]">
            {sources.map((s) => (
              <li key={s.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{s.name} <span className="text-[12px] font-normal text-[#8a8a8a]">{s.kind === "html" ? "səhifə" : "RSS"} • maks {s.max_per_run}</span></p>
                  <p className="truncate text-[12px] text-[#6f6f6f]">{s.url}</p>
                  {s.last_run_at && <p className="text-[11px] text-[#8a8a8a]">Son çəkiliş: {new Date(s.last_run_at).toLocaleString("az")}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={s.active} onChange={() => patch(s, { active: !s.active })} /> Aktiv</label>
                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={s.auto_publish} onChange={() => patch(s, { auto_publish: !s.auto_publish })} /> Birbaşa dərc</label>
                  <button disabled={running} onClick={() => run([s])} className={`${btn} bg-[#f4f2ee] py-2 hover:bg-[#e9e5df]`}>Çək</button>
                  <button disabled={running} onClick={() => remove(s)} className={`${btn} bg-red-50 py-2 text-red-700 hover:bg-red-100`}>Sil</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {log.length > 0 && (
        <section className="rounded-2xl bg-[#0b0b1a] p-4 text-[12px] leading-[1.7] text-green-200 shadow-sm">
          <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap" data-lenis-prevent>{log.join("\n")}</pre>
        </section>
      )}
    </div>
  );
}
