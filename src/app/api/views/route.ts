import { json, sameOrigin } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Etibarsız mənbə" }, 403);
  const b = (await req.json().catch(() => null)) as { slug?: unknown } | null;
  const slug = typeof b?.slug === "string" ? b.slug.slice(0, 120) : "";
  const db = getDb();
  if (!slug || !db) return json({ ok: false });
  await db.rpc("increment_views", { p_slug: slug });
  return json({ ok: true });
}
