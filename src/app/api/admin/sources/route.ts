import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { parseSource } from "@/lib/validate-source";

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const { data, error } = await db.from("sources").select("*").order("created_at", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ sources: data });
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const p = parseSource(await req.json().catch(() => null));
  if (!p.ok) return json({ error: p.error }, 400);
  const { data, error } = await db.from("sources").insert(p.data).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ source: data }, 201);
}
