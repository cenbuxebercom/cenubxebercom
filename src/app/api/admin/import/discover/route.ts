import { guard, json } from "@/lib/auth";
import { discoverNew, loadSource } from "@/lib/importer";

export const maxDuration = 60;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const b = (await req.json().catch(() => null)) as { sourceId?: unknown } | null;
  const source = typeof b?.sourceId === "string" ? await loadSource(b.sourceId) : null;
  if (!source) return json({ error: "Mənbə tapılmadı" }, 404);
  try {
    const items = await discoverNew(source);
    return json({ items: items.slice(0, 50), source: { id: source.id, name: source.name, max: source.max_per_run } });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Mənbəni oxumaq alınmadı" }, 502);
  }
}
