"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, categoryName } from "@/data/news";
import { api } from "./api";
import SourcesPanel from "./SourcesPanel";
import SocialsPanel from "./SocialsPanel";

type Row = {
  id: string; slug: string; title: string; excerpt: string; body: string; category: string; image: string;
  author: string | null; featured: boolean; published: boolean; views: number; published_at: string;
  imported?: boolean; source_name?: string | null; source_url?: string | null; video_url?: string | null;
};

const input = "w-full rounded-lg border border-[#d9d3cc] bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-navy";
const btn = "rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-50";

/** Şəkli yükləmədən əvvəl sıxır: ən uzun tərəf 1600px, JPEG ~82% — xəbər tez açılır, yükləmə uğurlu olur. */
async function compressImage(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const max = 1600;
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * k);
    const h = Math.round(bmp.height * k);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob || (blob.size >= file.size && file.size < 4 * 1024 * 1024)) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // dekod olunmadı (məs. HEIC) — orijinalı göndər
  }
}

const toLocal = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export default function AdminApp() {
  const [state, setState] = useState<"loading" | "out" | "in">("loading");
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    api<{ admin: boolean; configured: boolean }>("/api/admin/me").then((r) => {
      setConfigured(r.configured !== false);
      setState(r.admin ? "in" : "out");
    });
  }, []);

  if (state === "loading") return <div className="p-10 text-[14px] text-[#6f6f6f]">Yüklənir…</div>;
  if (state === "out") return <Login configured={configured} onDone={() => setState("in")} />;
  return <Dashboard onLogout={() => setState("out")} />;
}

function Login({ onDone, configured }: { onDone: () => void; configured: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setErr("");
          const r = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });
          setBusy(false);
          if (r.error) setErr(r.error); else onDone();
        }}
        className="w-full max-w-[400px] space-y-4 rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="mb-2">
          <p className="text-[22px] font-extrabold tracking-[-0.04em] text-navy">Cənub <span className="rounded bg-brand px-1.5 text-white">Xəbər</span></p>
          <p className="mt-2 text-[14px] text-[#6f6f6f]">Admin panelə giriş</p>
        </div>
        {!configured && <p className="rounded-lg bg-amber-50 p-3 text-[13px] text-amber-800">Admin parametrləri Vercel-də hələ təyin edilməyib (KURULUM.md-ə baxın).</p>}
        <input className={input} type="email" required autoComplete="username" placeholder="E-poçt" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" required autoComplete="current-password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-[13px] text-brand">{err}</p>}
        <button disabled={busy} className={`${btn} w-full bg-navy text-white hover:bg-[#1a1a80]`}>{busy ? "Yoxlanılır…" : "Daxil ol"}</button>
      </form>
    </div>
  );
}

const empty = {
  id: "", title: "", excerpt: "", body: "", category: "siyaset", image: "", author: "", video_url: "",
  featured: false, published: true, published_at: toLocal(new Date().toISOString()),
};

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"list" | "edit" | "sources" | "socials">("list");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "imported">("all");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState(empty);
  const [q, setQ] = useState("");
  const [note, setNote] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ytBusy, setYtBusy] = useState(false);

  const flash = (t: "ok" | "err", m: string) => { setNote({ t, m }); setTimeout(() => setNote(null), 4000); };

  const load = useCallback(async () => {
    const r = await api<{ articles: Row[] }>("/api/admin/articles");
    if (r.error) return flash("err", r.error);
    setRows(r.articles ?? []);
  }, []);
  useEffect(() => {
    // ilk yükləmə + hər 30 saniyədən bir (avto-çəkilən yeni xəbərlər siyahıda görünsün)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = useMemo(
    () => rows.filter((r) => {
      if (!r.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "published") return r.published;
      if (filter === "draft") return !r.published;
      if (filter === "imported") return Boolean(r.imported);
      return true;
    }),
    [rows, q, filter],
  );
  const allSelected = filtered.length > 0 && filtered.every((r) => sel.has(r.id));
  const toggleSel = (id: string) => setSel((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const bulkDelete = async () => {
    const ids = Array.from(sel);
    if (!ids.length) return;
    if (!confirm(`${ids.length} xəbər birdəfəlik silinsin? Bu əməliyyatı geri qaytarmaq olmur.`)) return;
    const r = await api<{ deleted: number }>("/api/admin/articles/bulk", { method: "POST", body: JSON.stringify({ ids }) });
    if (r.error) return flash("err", r.error);
    flash("ok", `${r.deleted ?? ids.length} xəbər silindi`);
    setSel(new Set());
    load();
  };

  const edit = (r?: Row) => {
    setForm(r ? { id: r.id, title: r.title, excerpt: r.excerpt, body: r.body, category: r.category, image: r.image, author: r.author ?? "", video_url: r.video_url ?? "", featured: r.featured, published: r.published, published_at: toLocal(r.published_at) } : { ...empty, published_at: toLocal(new Date().toISOString()) });
    setTab("edit");
    window.scrollTo({ top: 0 });
  };

  const save = async () => {
    setBusy(true);
    const payload = { ...form, published_at: new Date(form.published_at).toISOString() };
    const r = await api(form.id ? `/api/admin/articles/${form.id}` : "/api/admin/articles", { method: form.id ? "PUT" : "POST", body: JSON.stringify(payload) });
    setBusy(false);
    if (r.error) return flash("err", r.error);
    flash("ok", form.id ? "Xəbər yeniləndi" : "Xəbər əlavə olundu");
    await load();
    setTab("list");
  };

  const remove = async (r: Row) => {
    if (!confirm(`"${r.title}" xəbəri silinsin?`)) return;
    const res = await api(`/api/admin/articles/${r.id}`, { method: "DELETE" });
    if (res.error) return flash("err", res.error);
    flash("ok", "Silindi");
    load();
  };

  const toggle = async (r: Row, key: "featured" | "published") => {
    const res = await api(`/api/admin/articles/${r.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...r, author: r.author ?? "", [key]: !r[key] }),
    });
    if (res.error) return flash("err", res.error);
    load();
  };

  const fillFromYoutube = async () => {
    if (!form.video_url.trim()) return flash("err", "Əvvəlcə YouTube linkini yazın");
    setYtBusy(true);
    flash("ok", "Video oxunur… AI mətn yazırsa 30–60 saniyə çəkə bilər");
    const r = await api<{
      title: string; thumbnail: string; url: string; aiNote?: string;
      draft?: { title: string; excerpt: string; body: string; category: string };
    }>("/api/admin/youtube", { method: "POST", body: JSON.stringify({ url: form.video_url }) });
    setYtBusy(false);
    if (r.error) return flash("err", r.error);
    setForm((f) => ({
      ...f,
      video_url: r.url,
      title: f.title || r.draft?.title || r.title,
      excerpt: f.excerpt || r.draft?.excerpt || "",
      body: f.body || r.draft?.body || "",
      category: !f.id && r.draft?.category ? r.draft.category : f.category,
      image: f.image || r.thumbnail,
    }));
    flash(r.draft ? "ok" : "ok", r.draft ? "Video əsasında başlıq, təsvir və mətn dolduruldu — yoxlayıb yadda saxlayın" : `Başlıq və şəkil dolduruldu.${r.aiNote ? " " + r.aiNote : ""}`);
  };

  const upload = async (original: File) => {
    setUploading(true);
    const file = await compressImage(original);
    if (file.size > 4 * 1024 * 1024) {
      setUploading(false);
      return flash("err", "Şəkil çox böyükdür. Daha kiçik ölçülü şəkil seçin.");
    }
    const fd = new FormData();
    fd.append("file", file);
    const r = await api<{ url: string }>("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (r.error || !r.url) return flash("err", r.error ?? "Yükləmə alınmadı");
    setForm((f) => ({ ...f, image: r.url }));
    flash("ok", "Şəkil yükləndi");
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6" data-lenis-prevent>
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <p className="text-[20px] font-extrabold tracking-[-0.04em] text-navy">Cənub <span className="rounded bg-brand px-1.5 text-white">Xəbər</span> <span className="ml-1 text-[13px] font-medium tracking-normal text-[#6f6f6f]">admin</span></p>
        <nav className="ml-auto flex flex-wrap gap-2 text-[14px]">
          {([["list", "Xəbərlər"], ["edit", form.id ? "Redaktə" : "Yeni xəbər"], ["sources", "Avto-çəkmə"], ["socials", "Sosial şəbəkələr"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => (k === "edit" && tab !== "edit" ? edit() : setTab(k))} className={`${btn} ${tab === k ? "bg-navy text-white" : "bg-white text-ink hover:bg-[#e9e5df]"}`}>{l}</button>
          ))}
          <button
            onClick={async () => {
              flash("ok", "Test məktubu göndərilir… (təxminən 10 saniyə)");
              const r = await api<{ to?: string; via?: string; status?: string | null; from?: string }>("/api/admin/mail-test", { method: "POST", body: "{}" });
              if (r.error) return flash("err", `E-poçt testi alınmadı — ${r.error}`);
              const st = r.status;
              if (r.via === "smtp") flash("ok", `SMTP ilə göndərildi (${r.from} → ${r.to}). Gələnlər qutusunu və spam-ı yoxlayın.`);
              else if (st === "delivered") flash("ok", `Resend: çatdırıldı → ${r.to}. Zoho qəbul etdi; gələnlər qutusunda yoxdursa SPAM/Karantin qovluğuna baxın.`);
              else if (st === "bounced" || st === "failed" || st === "suppressed" || st === "complained") flash("err", `Resend: məktub çatmadı (${st}). Zoho/alıcı rədd etdi — KURULUM.md-dəki Zoho SMTP variantına keçin.`);
              else flash("ok", `Resend qəbul etdi (status: ${st ?? "gözlənilir"}) → ${r.to}. Resend → Emails səhifəsində statusa baxın.`);
            }}
            className={`${btn} bg-white text-ink hover:bg-[#e9e5df]`}
          >E-poçt testi</button>
          <a href="/" target="_blank" className={`${btn} bg-white text-ink hover:bg-[#e9e5df]`}>Sayta bax ↗</a>
          <button onClick={async () => { await api("/api/admin/logout", { method: "POST" }); onLogout(); }} className={`${btn} bg-white text-brand hover:bg-[#fdf3ee]`}>Çıxış</button>
        </nav>
      </header>

      {note && <div className={`mb-4 rounded-lg px-4 py-3 text-[14px] ${note.t === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>{note.m}</div>}

      {tab === "list" && (
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex flex-wrap gap-3">
            <input className={`${input} min-w-[200px] flex-1`} placeholder="Xəbər axtar…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className={`${input} w-auto`} value={filter} onChange={(e) => { setFilter(e.target.value as typeof filter); setSel(new Set()); }}>
              <option value="all">Hamısı ({rows.length})</option>
              <option value="published">Dərc olunmuş</option>
              <option value="draft">Qaralamalar</option>
              <option value="imported">Avto-çəkilmiş</option>
            </select>
            <button onClick={() => edit()} className={`${btn} shrink-0 bg-brand text-white hover:bg-[#c43a2e]`}>+ Yeni xəbər</button>
          </div>
          {filtered.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-3 rounded-lg bg-[#f4f2ee] px-3 py-2 text-[13px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={allSelected} onChange={() => setSel(allSelected ? new Set() : new Set(filtered.map((r) => r.id)))} />
                Hamısını seç ({filtered.length})
              </label>
              {sel.size > 0 && (
                <>
                  <span className="text-[#6f6f6f]">{sel.size} seçilib</span>
                  <button onClick={bulkDelete} className={`${btn} ml-auto bg-red-600 py-1.5 text-white hover:bg-red-700`}>Seçilmişləri sil</button>
                </>
              )}
            </div>
          )}
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-[14px] text-[#6f6f6f]">{rows.length ? "Heç nə tapılmadı" : "Hələ xəbər yoxdur. \"Yeni xəbər\" düyməsi ilə ilk xəbəri əlavə edin."}</p>
          ) : (
            <ul className="divide-y divide-[#eee9e3]">
              {filtered.map((r) => (
                <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                  <input type="checkbox" className="shrink-0" checked={sel.has(r.id)} onChange={() => toggleSel(r.id)} aria-label="Seç" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {r.image ? <img src={r.image} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" /> : <div className="h-16 w-24 shrink-0 rounded-lg bg-[#eee9e3]" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">{r.title}</p>
                    <p className="mt-1 text-[12px] text-[#6f6f6f]">
                      {categoryName(r.category)} • {new Date(r.published_at).toLocaleString("az")} • {r.views} baxış
                      {!r.published && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">Qaralama</span>}
                      {r.featured && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-brand">Gündəm</span>}
                      {r.imported && <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-blue-800" title={r.source_url ?? ""}>Avto{r.source_name ? ` · ${r.source_name}` : ""}</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[13px]">
                    <button onClick={() => toggle(r, "featured")} className={`${btn} bg-[#f4f2ee] hover:bg-[#e9e5df]`}>{r.featured ? "Gündəmdən çıxar" : "Gündəmə əlavə et"}</button>
                    <button onClick={() => toggle(r, "published")} className={`${btn} bg-[#f4f2ee] hover:bg-[#e9e5df]`}>{r.published ? "Gizlət" : "Dərc et"}</button>
                    <button onClick={() => edit(r)} className={`${btn} bg-navy text-white hover:bg-[#1a1a80]`}>Redaktə</button>
                    <button onClick={() => remove(r)} className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}>Sil</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "edit" && (
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-5 text-[18px] font-semibold">{form.id ? "Xəbəri redaktə et" : "Yeni xəbər"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2"><span className="mb-1 block text-[13px] text-[#6f6f6f]">Başlıq *</span>
              <input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} /></label>
            <label><span className="mb-1 block text-[13px] text-[#6f6f6f]">Kateqoriya *</span>
              <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select></label>
            <label><span className="mb-1 block text-[13px] text-[#6f6f6f]">Müəllif (ixtiyari)</span>
              <input className={input} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
            <label className="md:col-span-2"><span className="mb-1 block text-[13px] text-[#6f6f6f]">Qısa təsvir (xəbərin başlığı altında və paylaşımda görünür)</span>
              <textarea className={input} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} maxLength={500} /></label>
            <label className="md:col-span-2"><span className="mb-1 block text-[13px] text-[#6f6f6f]">Xəbərin mətni (abzasları boş sətirlə ayırın)</span>
              <textarea className={input} rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
            <div className="md:col-span-2 rounded-xl border border-[#e6e1db] bg-[#fbfaf8] p-4">
              <span className="mb-1 block text-[13px] text-[#6f6f6f]">YouTube linki (ixtiyari) — xəbərdə şəklin yerində video görünür</span>
              <div className="flex flex-wrap gap-3">
                <input className={`${input} min-w-[220px] flex-1`} placeholder="https://www.youtube.com/watch?v=..." value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
                <button type="button" disabled={ytBusy} onClick={fillFromYoutube} className={`${btn} bg-[#ff0000] text-white hover:bg-[#d90000]`}>{ytBusy ? "Oxunur…" : "Videodan doldur"}</button>
                {form.video_url && !ytBusy && <button type="button" onClick={() => setForm({ ...form, video_url: "" })} className={`${btn} bg-white text-ink hover:bg-[#e9e5df]`}>Videonu sil</button>}
              </div>
              <p className="mt-2 text-[12px] leading-[1.6] text-[#8a8a8a]">“Videodan doldur” başlığı, şəkli (video örtüyü) və Gemini ilə videonun məzmununa əsasən Azərbaycan dilində mətn yazır. Boş olan xanalar doldurulur, yazdıqlarınız silinmir.</p>
            </div>
            <div className="md:col-span-2">
              <span className="mb-1 block text-[13px] text-[#6f6f6f]">Şəkil (cihazdan yüklənir, avtomatik sıxılır)</span>
              <div className="flex flex-wrap items-center gap-3">
                <label className={`${btn} cursor-pointer bg-[#f4f2ee] hover:bg-[#e9e5df]`}>
                  {uploading ? "Yüklənir…" : form.image ? "Şəkli dəyiş" : "Cihazdan şəkil seç"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) upload(f); }} />
                </label>
                {form.image && !uploading && (
                  <button type="button" onClick={() => setForm({ ...form, image: "" })} className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}>Şəkli sil</button>
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {form.image && <img src={form.image} alt="" className="mt-3 h-40 rounded-lg object-cover" />}
            </div>
            <label><span className="mb-1 block text-[13px] text-[#6f6f6f]">Dərc tarixi və saatı</span>
              <input type="datetime-local" className={input} value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></label>
            <div className="flex flex-col justify-end gap-2 text-[14px]">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Gündəm xəbəri</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Dərc olunsun (söndürsəniz qaralama olaraq qalır)</label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button disabled={busy || uploading} onClick={save} className={`${btn} bg-brand text-white hover:bg-[#c43a2e]`}>{busy ? "Saxlanılır…" : "Yadda saxla"}</button>
            <button onClick={() => setTab("list")} className={`${btn} bg-[#f4f2ee] hover:bg-[#e9e5df]`}>Ləğv et</button>
          </div>
        </section>
      )}

      {tab === "sources" && <SourcesPanel flash={flash} onImported={load} />}
      {tab === "socials" && <SocialsPanel flash={flash} />}
    </div>
  );
}
