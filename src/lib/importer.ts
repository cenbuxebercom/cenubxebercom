import { getDb } from "./db";
import { slugify } from "./slug";
import { validCategory } from "./articles";
import { assertPublicHttpUrl, discover, downloadImage, extractArticle, fetchText, robotsAllowed, type Candidate } from "./fetcher";
import { aiConfigured, overlap, rewriteArticle, scrubOutlet } from "./rewriter";

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
  const { data: logs } = await db.from("import_log").select("url,status,created_at").in("url", urls);
  for (const l of logs ?? []) {
    if (l.status !== "failed" || +new Date(l.created_at) > dayAgo) seen.add(l.url);
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
  if (!aiConfigured()) return { status: "failed", error: "ANTHROPIC_API_KEY Vercel-də təyin edilməyib" };
  const url = cand.url;
  try {
    assertPublicHttpUrl(url);

    if (!(await robotsAllowed(url))) {
      await log(url, source.id, "skipped", { error: "robots.txt icazə vermir" });
      return { status: "skipped", reason: "Saytın robots.txt faylı bu səhifənin çəkilməsinə icazə vermir" };
    }

    const { text: html, finalUrl } = await fetchText(url);
    const ex = extractArticle(html, finalUrl);
    if (ex.text.length < 500) {
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
    const body = scrubOutlet(draft.body, outletNames);
    if (title.length < 5 || body.length < 200) throw new Error("AI boş/qısa mətn qaytardı");

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
    await log(url, source.id, "failed", { error: msg });
    return { status: "failed", error: msg };
  }
}

export async function loadSource(id: string): Promise<Source | null> {
  const db = getDb();
  if (!db) return null;
  const { data } = await db.from("sources").select("*").eq("id", id).maybeSingle();
  return (data as Source | null) ?? null;
}
