import { revalidateTag } from "next/cache";
import { guard, json } from "@/lib/auth";
import { loadSource, processItem } from "@/lib/importer";

export const maxDuration = 300;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const b = (await req.json().catch(() => null)) as { sourceId?: unknown; url?: unknown; title?: unknown; image?: unknown; date?: unknown } | null;
  const source = typeof b?.sourceId === "string" ? await loadSource(b.sourceId) : null;
  if (!source || typeof b?.url !== "string") return json({ error: "Yanlış sorğu" }, 400);
  const result = await processItem(source, {
    url: b.url,
    title: typeof b.title === "string" ? b.title : "",
    image: typeof b.image === "string" ? b.image : undefined,
    date: typeof b.date === "string" ? b.date : undefined,
  });
  if (result.status === "done" && result.published) revalidateTag("articles", { expire: 0 });
  return json(result);
}
