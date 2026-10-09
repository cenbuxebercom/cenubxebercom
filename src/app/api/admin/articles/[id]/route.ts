import { revalidateTag } from "next/cache";
import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { parseArticle } from "@/lib/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const parsed = parseArticle(await req.json().catch(() => null));
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const { id } = await params;
  let { data, error } = await db
    .from("articles").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error && /video_url/.test(error.message)) {
    if (parsed.data.video_url) return json({ error: "Supabase-də `video_url` sütunu yoxdur — schema.sql faylını SQL Editor-da yenidən işə salın" }, 500);
    const { video_url: _omit, ...rest } = parsed.data;
    void _omit;
    ({ data, error } = await db.from("articles").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id).select().single());
  }
  if (error) return json({ error: error.message }, 500);
  revalidateTag("articles", { expire: 0 });
  return json({ article: data });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const { id } = await params;
  const { error } = await db.from("articles").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  revalidateTag("articles", { expire: 0 });
  return json({ ok: true });
}
