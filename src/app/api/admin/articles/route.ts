import { revalidateTag } from "next/cache";
import { guard, json } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { parseArticle } from "@/lib/validate";

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)" }, 500);
  const { data, error } = await db.from("articles").select("*").order("published_at", { ascending: false }).limit(1000);
  if (error) return json({ error: error.message }, 500);
  return json({ articles: data });
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const db = getDb();
  if (!db) return json({ error: "Supabase təyin edilməyib" }, 500);
  const parsed = parseArticle(await req.json().catch(() => null));
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  let slug = slugify(parsed.data.title);
  const { data: clash } = await db.from("articles").select("id").eq("slug", slug).maybeSingle();
  if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  let { data, error } = await db.from("articles").insert({ ...parsed.data, slug }).select().single();
  if (error && /video_url/.test(error.message)) {
    // `video_url` sütunu hələ yaradılmayıb (schema.sql v4 işə salınmayıb)
    if (parsed.data.video_url) return json({ error: "Supabase-də `video_url` sütunu yoxdur — schema.sql faylını SQL Editor-da yenidən işə salın" }, 500);
    const { video_url: _omit, ...rest } = parsed.data;
    void _omit;
    ({ data, error } = await db.from("articles").insert({ ...rest, slug }).select().single());
  }
  if (error) return json({ error: error.message }, 500);
  revalidateTag("articles", { expire: 0 });
  return json({ article: data }, 201);
}
