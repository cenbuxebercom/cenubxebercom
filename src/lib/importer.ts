import { getDb } from "./db";
import { slugify } from "./slug";
import { validCategory } from "./articles";
import { assertPublicHttpUrl, discover, downloadImage, extractArticle, fetchText, robotsAllowed, type Candidate } from "./fetcher";
import { addAttribution, aiConfigured, aiProvider, hasAttribution, overlap, rewriteArticle, scrubOutlet } from "./rewriter";

export type Source = {
  id: string; name: string; url: string; kind: string; category: string | null;
  active: boolean; auto_publish: boolean; max_per_run: number; last_run_at: string | null;
};

export type ProcessResult =
  | { status: "done"; articleId: string; title: string; published: boolean }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

/** Mənbədən yeni (hələ işlənməmiş) linkləri tapır. */
export async function discoverNew(source: Source): Promise<Candidate[]> {
  const db = getDb();
  if (!db) throw new Error("Supabase təyin edilməyib");
  const all = await discover(source);
  if (!all.length) return [];
  const urls = all.map((c) => c.url);
  const seen = new Set<string>();
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const tenMinAgo = Date.now() - 10 * 60 * 1000;
  const { data: logs } = await db.from("import_log").select("url,status,created_at").in("url", urls);
  for (const l of logs ?? []) {
    const at = +new Date(l.created_at);
    if (l.status === "failed" ? at > dayAgo : l.status === "processing" ? at > tenMinAgo : true) seen.add(l.url);
  }
  const { data: arts } = await db.from("articles").select("source_url").in("source_url", urls);
  for (const a of arts ?? []) if (a.source_url) seen.add(a.source_url);
  return all.filter((c) => !seen.has(c.url));
}

async function log(url: string, sourceId: string, status: string, extra: { articleId?: string; error?: string } = {}) {
  const db = getDb();
  await db?.from("import_log").upsert({
    url, source_id: sourceId, status, article_id: extra.articleId ?? null, error: extra.error?.slice(0, 500) ?? null, created_at: new Date().toISOString(),
  });
}

/** Eyni xəbərin iki paralel prosesdə (məs. cron + əl ilə) təkrar işlənməsinin qarşısını alır. */
async function claim(url: string, sourceId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const now = new Date().toISOString();
  const { error } = await db.from("import_log").insert({ url, source_id: sourceId, status: "processing", created_at: now });
  if (!error) return true;
  const failedCut = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const procCut = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data } = await db
    .from("import_log")
    .update({ status: "processing", created_at: now })
    .eq("url", url)
    .or(`and(status.eq.failed,created_at.lt.${failedCut}),and(status.eq.processing,created_at.lt.${procCut})`)
    .select("url");
  return Boolean(data?.length);
}

async function uploadToImgbb(blob: Blob, name: string): Promise<string> {
  const key = process.env.IMGBB_API_KEY;
  if (!key) return "";
  try {
    const fd = new FormData();
    fd.append("image", blob, name);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, { method: "POST", body: fd, signal: AbortSignal.timeout(40000) });
    const data = await res.json().catch(() => null);
    return res.ok ? (data?.data?.url ?? "") : "";
  } catch {
    return "";
  }
}

/** Bir xəbəri çəkir → AI ilə yenidən yazır → bazaya əlavə edir. */
export async function processItem(source: Source, cand: Candidate): Promise<ProcessResult> {
  const db = getDb();
  if (!db) return { status: "failed", error: "Supabase təyin edilməyib" };
  if (!aiConfigured()) return { status: "failed", error: "AI açarı təyin edilməyib — Vercel-də GEMINI_API_KEY (pulsuz) əlavə edin" };
  const url = cand.url;
  try {
    assertPublicHttpUrl(url);
    if (!(await claim(url, source.id))) return { status: "skipped", reason: "Bu xəbər artıq işlənir və ya işlənib" };

    if (!(await robotsAllowed(url))) {
      await log(url, source.id, "skipped", { error: "robots.txt icazə vermir" });
      return { status: "skipped", reason: "Saytın robots.txt faylı bu səhifənin çəkilməsinə icazə vermir" };
    }

    const { text: html, finalUrl } = await fetchText(url);
    const ex = extractArticle(html, finalUrl);
    if (ex.text.length < 250) {
      await log(url, source.id, "skipped", { error: "mətn qısadır" });
      return { status: "skipped", reason: "Mətn çox qısadır və ya oxunmadı" };
    }

    const host = new URL(source.url).hostname.replace(/^www\./, "");
    const outletNames = [source.name, host, host.split(".")[0], ex.siteName];

    // 1-ci cəhd, çox oxşarlıq olarsa 2-ci cəhd
    let draft = await rewriteArticle({ title: ex.title || cand.title, text: ex.text, outletNames });
    if (!draft.skip) {
      let ov = overlap(ex.text, `${draft.title}\n${draft.body}`);
      if (ov.ratio > 0.08) {
        const note = `Your previous draft still reused wording from the source (e.g. "${ov.samples.slice(0, 3).join('", "')}"). Rewrite it again, much more independently: new sentence structures, new vocabulary, different order of details. Keep all facts.`;
        draft = await rewriteArticle({ title: ex.title || cand.title, text: ex.text, outletNames, retryNote: note });
        if (!draft.skip) ov = overlap(ex.text, `${draft.title}\n${draft.body}`);
      }
      if (!draft.skip && ov.ratio > 0.2) {
        await log(url, source.id, "skipped", { error: "AI mətni mənbəyə çox oxşayır" });
        return { status: "skipped", reason: "Yenidən yazılan mətn mənbəyə çox oxşar qaldı (təkrar sına bilərsiniz)" };
      }
    }
    if (draft.skip) {
      await log(url, source.id, "skipped", { error: draft.skip_reason });
      return { status: "skipped", reason: draft.skip_reason || "Uyğun xəbər deyil" };
    }

    const title = scrubOutlet(draft.title, outletNames).slice(0, 200);
    const excerpt = scrubOutlet(draft.excerpt, outletNames).slice(0, 500);
    let body = scrubOutlet(draft.body, outletNames);
    if (!hasAttribution(body) && aiProvider() === "gemini") {
      try {
        const [first, ...rest] = body.split(/\n{2,}/);
        body = [await addAttribution(first), ...rest].join("\n\n");
      } catch { /* istinad əlavə olunmasa belə xəbər saxlanılır */ }
    }
    if (title.length < 5 || body.length < 120) throw new Error("AI boş/qısa mətn qaytardı");

    // şəkil
    let image = "";
    const imgUrl = ex.image || cand.image;
    if (imgUrl) {
      const dl = await downloadImage(imgUrl);
      if (dl) image = await uploadToImgbb(dl.blob, dl.name);
    }

    const category = validCategory(draft.category) ? draft.category : source.category && validCategory(source.category) ? source.category : "cemiyyet";
    const orig = Date.parse(ex.date || cand.date || "");
    const publishedAt = Number.isFinite(orig) && orig <= Date.now() ? new Date(orig).toISOString() : new Date().toISOString();

    let slug = slugify(title);
    const { data: clash } = await db.from("articles").select("id").eq("slug", slug).maybeSingle();
    if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

    const { data, error } = await db.from("articles").insert({
      slug, title, excerpt, body, category, image, author: null,
      featured: false, published: source.auto_publish, published_at: publishedAt,
      imported: true, source_url: url, source_name: source.name,
    }).select("id").single();
    if (error || !data) throw new Error(error?.message ?? "Bazaya yazmaq alınmadı");

    await log(url, source.id, "done", { articleId: data.id });
    return { status: "done", articleId: data.id, title, published: source.auto_publish };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[import]", url, msg);
    // AI limiti (müvəqqəti) — xəbəri "uğursuz" yazma, növbəti yoxlamada təkrar sınansın
    if (/limit|müvəqqəti məşğul|429|quota|cavab vermədi|JSON/i.test(msg)) {
      await getDb()?.from("import_log").delete().eq("url", url).eq("status", "processing");
    } else {
      await log(url, source.id, "failed", { error: msg });
    }
    return { status: "failed", error: msg };
  }
}

export async function loadSource(id: string): Promise<Source | null> {
  const db = getDb();
  if (!db) return null;
  const { data } = await db.from("sources").select("*").eq("id", id).maybeSingle();
  return (data as Source | null) ?? null;
}


/* ===================== AVTOMATİK REJİM ===================== */
async function pool<T>(items: T[], size: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

export async function isAutoEnabled(): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const { data } = await db.from("settings").select("value").eq("key", "auto_import").maybeSingle();
  return (data?.value as { enabled?: boolean } | null)?.enabled !== false;
}

export type RunStats = {
  at: string; done: number; skipped: number; failed: number; published: number; seconds: number;
  errors: string[]; disabled?: boolean;
};

/**
 * Bütün aktiv mənbələri yoxlayır, yeni xəbərləri tapır, AI ilə yenidən yazıb kateqoriyasına uyğun əlavə edir.
 * Cron (5 dəqiqədən bir) və admin paneldəki "İndi yoxla" düyməsi bunu çağırır.
 */
export async function runAutoImport(o: { budgetMs: number; sourceId?: string; maxItems?: number; force?: boolean }): Promise<RunStats> {
  const db = getDb();
  if (!db) throw new Error("Supabase təyin edilməyib");
  const started = Date.now();
  const stats: RunStats = { at: new Date().toISOString(), done: 0, skipped: 0, failed: 0, published: 0, seconds: 0, errors: [] };

  if (!o.force && !(await isAutoEnabled())) return { ...stats, disabled: true };

  let q = db.from("sources").select("*");
  q = o.sourceId ? q.eq("id", o.sourceId) : q.eq("active", true);
  const { data } = await q.order("last_run_at", { ascending: true, nullsFirst: true });
  const sources = (data ?? []) as Source[];

  const found = new Map<string, Candidate[]>();
  await pool(sources, 3, async (s) => {
    try {
      found.set(s.id, (await discoverNew(s)).slice(0, Math.max(1, s.max_per_run)));
    } catch (e) {
      stats.errors.push(`${s.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  });

  // mənbələr arası növbə ilə (bir sayt digərlərini sıxışdırmasın)
  const tasks: { s: Source; c: Candidate }[] = [];
  const cap = o.maxItems ?? 12;
  for (let round = 0; tasks.length < cap; round++) {
    let any = false;
    for (const s of sources) {
      const c = found.get(s.id)?.[round];
      if (c && tasks.length < cap) { tasks.push({ s, c }); any = true; }
    }
    if (!any) break;
  }

  await pool(tasks, 1, async ({ s, c }) => {
    if (Date.now() - started > o.budgetMs) return;
    const r = await processItem(s, c);
    if (r.status === "done") { stats.done++; if (r.published) stats.published++; }
    else if (r.status === "skipped") stats.skipped++;
    else { stats.failed++; if (stats.errors.length < 6) stats.errors.push(`${s.name}: ${r.error}`); }
  });

  if (sources.length) await db.from("sources").update({ last_run_at: new Date().toISOString() }).in("id", sources.map((s) => s.id));
  stats.seconds = Math.round((Date.now() - started) / 1000);
  await db.from("settings").upsert({ key: "import_status", value: stats, updated_at: new Date().toISOString() });
  return stats;
}

/** Əvvəl çəkilmiş avto-xəbərlərdə "Cənub Xəbər bildirir ki" istinadı yoxdursa əlavə edir (cron: ?fix=attribution). */
export async function fixAttributions(max = 15): Promise<{ checked: number; fixed: number; failed: number }> {
  const db = getDb();
  if (!db) throw new Error("Supabase təyin edilməyib");
  const { data } = await db.from("articles").select("id,body").eq("imported", true).order("created_at", { ascending: false }).limit(200);
  const todo = (data ?? []).filter((a) => !hasAttribution(a.body ?? "")).slice(0, max);
  const out = { checked: data?.length ?? 0, fixed: 0, failed: 0 };
  for (const a of todo) {
    try {
      const [first, ...rest] = String(a.body).split(/\n{2,}/);
      const body = [await addAttribution(first), ...rest].join("\n\n");
      const { error } = await db.from("articles").update({ body, updated_at: new Date().toISOString() }).eq("id", a.id);
      if (error) throw new Error(error.message);
      out.fixed++;
    } catch (e) {
      out.failed++;
      console.error("[fix attribution]", a.id, e instanceof Error ? e.message : e);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return out;
}
