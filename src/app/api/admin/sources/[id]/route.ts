import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { parseSource } from "@/lib/validate-source";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const p = parseSource(await req.json().catch(() => null));
  if (!p.ok) return json({ error: p.error }, 400);
  const { id } = await params;
  const { data, error } = await db.from("sources").update(p.data).eq("id", id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ source: data });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const { id } = await params;
  const { error } = await db.from("sources").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
