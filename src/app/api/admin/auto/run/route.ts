import { revalidateTag } from "next/cache";
import { guard, json } from "@/lib/auth";
import { runAutoImport } from "@/lib/importer";

export const maxDuration = 300;

/** Admin paneldən "İndi yoxla": bütün (və ya seçilmiş) mənbələrdən dərhal çəkir. */
export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const b = (await req.json().catch(() => null)) as { sourceId?: unknown } | null;
  try {
    const stats = await runAutoImport({
      budgetMs: 230_000,
      sourceId: typeof b?.sourceId === "string" ? b.sourceId : undefined,
      force: true,
      maxItems: 10,
    });
    if (stats.published > 0) revalidateTag("articles", { expire: 0 });
    return json({ ok: true, ...stats });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Xəta" }, 500);
  }
}
