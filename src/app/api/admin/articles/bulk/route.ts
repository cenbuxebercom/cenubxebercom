import { revalidateTag } from "next/cache";
import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const b = (await req.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(b?.ids) ? (b!.ids as unknown[]).filter((x): x is string => typeof x === "string").slice(0, 1000) : [];
  if (!ids.length) return json({ error: "Heç nə seçilməyib" }, 400);
  let deleted = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const { error, count } = await db.from("articles").delete({ count: "exact" }).in("id", chunk);
    if (error) return json({ error: error.message, deleted }, 500);
    deleted += count ?? chunk.length;
  }
  revalidateTag("articles", { expire: 0 });
  return json({ ok: true, deleted });
}
