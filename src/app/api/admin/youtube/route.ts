import { guard, json } from "@/lib/auth";
import { draftFromYoutube } from "@/lib/rewriter";
import { parseYoutubeId, youtubeThumb, youtubeWatchUrl } from "@/lib/youtube";

export const maxDuration = 180;

/** YouTube linkindən: başlıq, kanal, şəkil (oEmbed) + istəyə görə Gemini ilə xəbər mətni. */
export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const b = (await req.json().catch(() => null)) as { url?: unknown; ai?: unknown } | null;
  const id = typeof b?.url === "string" ? parseYoutubeId(b.url) : null;
  if (!id) return json({ error: "YouTube linki düzgün deyil" }, 400);
  const url = youtubeWatchUrl(id);

  let title = "", author = "";
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return json({ error: res.status === 404 || res.status === 401 ? "Video tapılmadı və ya embed icazəsi yoxdur (gizli/məhdud video ola bilər)" : `YouTube cavab vermədi (${res.status})` }, 422);
    const d = await res.json();
    title = String(d.title ?? "");
    author = String(d.author_name ?? "");
  } catch {
    return json({ error: "YouTube-a qoşulmaq alınmadı" }, 502);
  }

  const out: Record<string, unknown> = { id, url, title, author, thumbnail: youtubeThumb(id) };
  if (b?.ai !== false && process.env.GEMINI_API_KEY) {
    try {
      const d = await draftFromYoutube(url, title);
      if (d.skip) out.aiNote = d.skip_reason || "Video xəbər kimi uyğun görünmədi";
      else out.draft = { title: d.title, excerpt: d.excerpt, body: d.body, category: d.category };
    } catch (e) {
      out.aiNote = e instanceof Error ? e.message : "AI mətni yaza bilmədi";
    }
  } else if (b?.ai !== false) {
    out.aiNote = "AI ilə mətn yazmaq üçün Vercel-də GEMINI_API_KEY əlavə edin";
  }
  return json(out);
}
