import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isAutoEnabled } from "@/lib/importer";
import { aiProvider } from "@/lib/rewriter";

const bakuMidnight = () => {
  const d = new Date(Date.now() + 4 * 3600_000);
  d.setUTCHours(0, 0, 0, 0);
  return new Date(d.getTime() - 4 * 3600_000).toISOString();
};

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const [{ data: st }, { count }, enabled] = await Promise.all([
    db.from("settings").select("value").eq("key", "import_status").maybeSingle(),
    db.from("articles").select("id", { count: "exact", head: true }).eq("imported", true).gte("created_at", bakuMidnight()),
    isAutoEnabled(),
  ]);
  return json({
    enabled,
    status: st?.value ?? null,
    today: count ?? 0,
    ai: aiProvider(),
    cron: Boolean(process.env.CRON_SECRET),
  });
}

export async function PUT(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const b = (await req.json().catch(() => null)) as { enabled?: unknown } | null;
  const { error } = await db.from("settings").upsert({ key: "auto_import", value: { enabled: b?.enabled !== false }, updated_at: new Date().toISOString() });
  if (error) return json({ error: /settings/.test(error.message) ? "`settings` cədvəli yoxdur — schema.sql-i yenidən işə salın" : error.message }, 500);
  return json({ ok: true });
}
