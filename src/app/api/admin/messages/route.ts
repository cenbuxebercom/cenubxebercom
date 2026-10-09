import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const { data, error } = await db.from("messages").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) return json({ error: error.message }, 500);
  return json({ messages: data });
}
