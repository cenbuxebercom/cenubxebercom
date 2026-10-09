import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { discoverNew, processItem, type Source } from "@/lib/importer";

export const maxDuration = 300;

/** Vercel Cron (və ya xarici planlayıcı) çağırır. Başlıq: Authorization: Bearer <CRON_SECRET> */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json({ error: "CRON_SECRET təyin edilməyib" }, 503);
  const got = req.headers.get("authorization") ?? "";
  const want = `Bearer ${secret}`;
  if (got.length !== want.length || !timingSafeEqual(Buffer.from(got), Buffer.from(want))) return json({ error: "İcazə yoxdur" }, 401);

  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const started = Date.now();
  const budget = 270_000; // saniyə limitindən əvvəl dayan
  const { data: sources } = await db.from("sources").select("*").eq("active", true).order("last_run_at", { ascending: true, nullsFirst: true });

  const summary: { source: string; done: number; skipped: number; failed: number }[] = [];
  let publishedAny = false;
  for (const s of (sources ?? []) as Source[]) {
    const row = { source: s.name, done: 0, skipped: 0, failed: 0 };
    summary.push(row);
    try {
      const fresh = (await discoverNew(s)).slice(0, s.max_per_run);
      for (const c of fresh) {
        if (Date.now() - started > budget) break;
        const r = await processItem(s, c);
        await new Promise((res) => setTimeout(res, 5000)); // pulsuz AI limitinə hörmət
        if (r.status === "done") { row.done++; if (r.published) publishedAny = true; }
        else if (r.status === "skipped") row.skipped++;
        else row.failed++;
      }
    } catch (e) {
      console.error("[cron import]", s.name, e);
      row.failed++;
    }
    await db.from("sources").update({ last_run_at: new Date().toISOString() }).eq("id", s.id);
    if (Date.now() - started > budget) break;
  }
  if (publishedAny) revalidateTag("articles", { expire: 0 });
  return json({ ok: true, summary, seconds: Math.round((Date.now() - started) / 1000) });
}
