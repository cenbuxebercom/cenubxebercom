import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { json } from "@/lib/auth";
import { runAutoImport } from "@/lib/importer";
import { BOT_UA, assertPublicHttpUrl } from "@/lib/fetcher";

export const maxDuration = 300;

/** 5 dəqiqədən bir çağırılır (GitHub Actions / Vercel Cron). Başlıq: Authorization: Bearer <CRON_SECRET> */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json({ error: "CRON_SECRET təyin edilməyib" }, 503);
  const got = req.headers.get("authorization") ?? "";
  const want = `Bearer ${secret}`;
  if (got.length !== want.length || !timingSafeEqual(Buffer.from(got), Buffer.from(want))) return json({ error: "İcazə yoxdur" }, 401);

  // diaqnostika: ?probe=<link> — Vercel serverindən həmin linkə sorğu atıb statusu göstərir
  const probe = new URL(req.url).searchParams.get("probe");
  if (probe) {
    try {
      assertPublicHttpUrl(probe);
      const r = await fetch(probe, { headers: { "user-agent": BOT_UA, accept: "text/html,application/xml;q=0.9,*/*;q=0.8", "accept-language": "az,en;q=0.8" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
      const body = await r.text();
      return json({ probe, status: r.status, finalUrl: r.url, server: r.headers.get("server"), cf: r.headers.get("cf-ray") ? true : false, bytes: body.length, sample: body.slice(0, 200) });
    } catch (e) {
      return json({ probe, error: e instanceof Error ? e.message : String(e) });
    }
  }

  try {
    const stats = await runAutoImport({ budgetMs: 240_000 });
    if (stats.published > 0) revalidateTag("articles", { expire: 0 });
    return json({ ok: true, ...stats });
  } catch (e) {
    console.error("[cron import]", e);
    return json({ error: e instanceof Error ? e.message : "Xəta" }, 500);
  }
}
