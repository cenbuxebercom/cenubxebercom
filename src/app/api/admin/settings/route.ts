import { revalidateTag } from "next/cache";
import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { SOCIAL_KEYS, getSocials } from "@/lib/settings";

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  return json({ socials: await getSocials() });
}

export async function PUT(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const b = (await req.json().catch(() => null)) as { socials?: Record<string, unknown> } | null;
  const out: Record<string, string> = {};
  for (const k of SOCIAL_KEYS) {
    const v = typeof b?.socials?.[k] === "string" ? (b.socials[k] as string).trim() : "";
    if (v && !/^https:\/\/[^\s]{3,300}$/i.test(v)) return json({ error: `${k}: link https:// ilə başlamalıdır` }, 400);
    out[k] = v;
  }
  const { error } = await db.from("settings").upsert({ key: "socials", value: out, updated_at: new Date().toISOString() });
  if (error) return json({ error: /relation .*settings|does not exist|schema cache/i.test(error.message) ? "Supabase-də `settings` cədvəli yoxdur — schema.sql-i yenidən işə salın" : error.message }, 500);
  revalidateTag("settings", { expire: 0 });
  return json({ ok: true });
}
