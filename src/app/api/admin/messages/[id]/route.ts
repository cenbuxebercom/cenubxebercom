import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const { id } = await params;
  const { error } = await db.from("messages").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
