import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { json } from "@/lib/auth";
import { runAutoImport } from "@/lib/importer";

export const maxDuration = 300;

/** 5 dəqiqədən bir çağırılır (GitHub Actions / Vercel Cron). Başlıq: Authorization: Bearer <CRON_SECRET> */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json({ error: "CRON_SECRET təyin edilməyib" }, 503);
  const got = req.headers.get("authorization") ?? "";
  const want = `Bearer ${secret}`;
  if (got.length !== want.length || !timingSafeEqual(Buffer.from(got), Buffer.from(want))) return json({ error: "İcazə yoxdur" }, 401);

  try {
    const stats = await runAutoImport({ budgetMs: 240_000 });
    if (stats.published > 0) revalidateTag("articles", { expire: 0 });
    return json({ ok: true, ...stats });
  } catch (e) {
    console.error("[cron import]", e);
    return json({ error: e instanceof Error ? e.message : "Xəta" }, 500);
  }
}
