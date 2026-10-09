import { validCategory } from "./articles";
import { assertPublicHttpUrl } from "./fetcher";

export function parseSource(raw: unknown): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Yanlış sorğu" };
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === "string" ? r.name.trim().slice(0, 80) : "";
  const url = typeof r.url === "string" ? r.url.trim().slice(0, 500) : "";
  if (name.length < 2) return { ok: false, error: "Mənbənin adını yazın" };
  try { assertPublicHttpUrl(url); } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Yanlış link" }; }
  const category = typeof r.category === "string" && validCategory(r.category) ? r.category : null;
  const max = Math.min(30, Math.max(1, Math.floor(Number(r.max_per_run) || 10)));
  return {
    ok: true,
    data: {
      name, url, kind: r.kind === "html" ? "html" : "rss", category,
      active: r.active === undefined ? true : Boolean(r.active),
      auto_publish: r.auto_publish === undefined ? true : Boolean(r.auto_publish),
      max_per_run: max,
    },
  };
}
