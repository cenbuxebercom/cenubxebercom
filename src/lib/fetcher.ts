import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";

export const BOT_UA = "Mozilla/5.0 (compatible; CenubXeberBot/1.0; +https://www.cenubxeber.com)";

export type Candidate = { url: string; title: string; date?: string; image?: string };
export type Extracted = { title: string; siteName: string; image: string; date: string; text: string };

/** SSRF qoruması: yalnız ictimai http/https ünvanlar. */
export function assertPublicHttpUrl(raw: string): URL {
  let u: URL;
  try { u = new URL(raw); } catch { throw new Error("Yanlış link"); }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Yalnız http/https linkləri qəbul olunur");
  const h = u.hostname.toLowerCase();
  const bad =
    h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal") ||
    /^(0|10|127)\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    h === "::1" || h.startsWith("[") || /^f[cd][0-9a-f]{2}:/.test(h);
  if (bad) throw new Error("Bu ünvana icazə verilmir");
  return u;
}

const baseHost = (h: string) => h.replace(/^www\./, "");
export const sameSite = (a: string, b: string) => {
  const x = baseHost(a), y = baseHost(b);
  return x === y || x.endsWith("." + y) || y.endsWith("." + x);
};

export async function fetchText(url: string, timeout = 15000, maxBytes = 3_000_000) {
  assertPublicHttpUrl(url);
  const res = await fetch(url, {
    headers: {
      "user-agent": BOT_UA,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml,text/xml;q=0.9,*/*;q=0.8",
      "accept-language": "az,en;q=0.8,ru;q=0.5",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
  });
  assertPublicHttpUrl(res.url || url);
  if (!res.ok) throw new Error(`Sayt cavab vermədi (HTTP ${res.status})`);
  const contentType = res.headers.get("content-type") ?? "";
  const buf = Buffer.from(await res.arrayBuffer()).subarray(0, maxBytes);
  const charset = /charset=([\w-]+)/i.exec(contentType)?.[1] ?? /<meta[^>]+charset=["']?([\w-]+)/i.exec(buf.subarray(0, 2048).toString("latin1"))?.[1] ?? "utf-8";
  let text: string;
  try { text = new TextDecoder(charset).decode(buf); } catch { text = buf.toString("utf8"); }
  return { text, finalUrl: res.url || url, contentType };
}

/* ---------------- robots.txt ---------------- */
const robotsCache = new Map<string, { rules: { allow: boolean; path: string }[]; at: number }>();

export async function robotsAllowed(url: string): Promise<boolean> {
  const u = new URL(url);
  const key = u.origin;
  let entry = robotsCache.get(key);
  if (!entry || Date.now() - entry.at > 3600_000) {
    const rules: { allow: boolean; path: string }[] = [];
    try {
      const { text } = await fetchText(`${u.origin}/robots.txt`, 5000, 300_000);
      let applies = false, sawAgent = false;
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.replace(/#.*/, "").trim();
        const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line);
        if (!m) continue;
        const k = m[1].toLowerCase(), v = m[2].trim();
        if (k === "user-agent") {
          if (sawAgent && rules.length && !applies) { /* yeni qrup */ }
          applies = v === "*" || /cenubxeberbot/i.test(v);
          sawAgent = true;
        } else if (applies && (k === "disallow" || k === "allow") && v) {
          rules.push({ allow: k === "allow", path: v });
        }
      }
    } catch { /* robots.txt yoxdur/oxunmadı — icazəli sayılır */ }
    entry = { rules, at: Date.now() };
    robotsCache.set(key, entry);
  }
  const path = u.pathname + u.search;
  let best: { allow: boolean; len: number } | null = null;
  for (const r of entry.rules) {
    const pat = r.path.replace(/\*/g, ".*").replace(/\$$/, "$");
    const re = new RegExp("^" + pat.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\\\.\*/g, ".*"));
    if (re.test(path) && (!best || r.path.length > best.len)) best = { allow: r.allow, len: r.path.length };
  }
  return best ? best.allow : true;
}

/* ---------------- feed / səhifə siyahısı ---------------- */
const txt = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v).trim();
  if (Array.isArray(v)) return txt(v[0]);
  if (typeof v === "object") return txt((v as Record<string, unknown>)["#text"]);
  return "";
};
const arr = <T,>(v: T | T[] | undefined): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

function parseFeed(xml: string, base: string): { items: Candidate[]; channelHost?: string } {
  const p = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text", processEntities: true });
  const doc = p.parse(xml);
  const out: Candidate[] = [];
  const rssItems = arr(doc?.rss?.channel?.item ?? doc?.["rdf:RDF"]?.item);
  for (const it of rssItems as Record<string, unknown>[]) {
    const link = txt(it.link) || txt(it.guid);
    if (!link) continue;
    const enc = arr(it.enclosure as Record<string, string>[])[0];
    const media = arr((it["media:content"] ?? it["media:thumbnail"]) as Record<string, string>[])[0];
    const image = (enc && /image/.test(enc["@_type"] ?? "image") ? enc["@_url"] : undefined) ?? media?.["@_url"];
    out.push({ url: new URL(link, base).toString(), title: txt(it.title), date: txt(it.pubDate) || txt(it["dc:date"]) || undefined, image });
  }
  for (const en of arr(doc?.feed?.entry) as Record<string, unknown>[]) {
    const links = arr(en.link as Record<string, string>[]);
    const href = (links.find((l) => l["@_rel"] === "alternate") ?? links[0])?.["@_href"];
    if (!href) continue;
    out.push({ url: new URL(href, base).toString(), title: txt(en.title), date: txt(en.published) || txt(en.updated) || undefined });
  }
  let channelHost: string | undefined;
  try { const cl = txt(doc?.rss?.channel?.link) || txt(doc?.feed?.link); if (cl) channelHost = new URL(cl, base).hostname; } catch { /* yoxdur */ }
  return { items: out, channelHost };
}

function heuristicLinks(html: string, base: string): Candidate[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const out: Candidate[] = [];
  $("a[href]").each((_, a) => {
    let u: URL;
    try { u = new URL($(a).attr("href")!, base); } catch { return; }
    if (!/^https?:$/.test(u.protocol) || !sameSite(u.hostname, new URL(base).hostname)) return;
    const path = u.pathname;
    if (u.hash && path === new URL(base).pathname) return;
    if (/\.(jpg|jpeg|png|gif|webp|pdf|zip|mp4|svg)$/i.test(path) || /\/(tag|tags|category|kateqoriya|author|page|search|login|about|contact|rss)(\/|$)/i.test(path)) return;
    if (path.split("/").filter(Boolean).length < 1 || (!/\d/.test(path) && path.split("/").filter(Boolean).length < 2)) return;
    const title = $(a).text().replace(/\s+/g, " ").trim();
    if (title.length < 30) return;
    u.hash = "";
    const key = u.toString();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ url: key, title });
  });
  return out.slice(0, 40);
}

export async function discover(source: { url: string }): Promise<Candidate[]> {
  const { text, finalUrl, contentType } = await fetchText(source.url);
  const head = text.slice(0, 500).toLowerCase();
  let items: Candidate[];
  let channelHost: string | undefined;
  if (/xml/.test(contentType) || head.includes("<rss") || head.includes("<feed") || head.includes("<rdf")) {
    ({ items, channelHost } = parseFeed(text, finalUrl));
  } else {
    const $ = cheerio.load(text);
    const feedHref = $('link[rel="alternate"][type*="rss"], link[rel="alternate"][type*="atom"]').first().attr("href");
    items = [];
    if (feedHref) {
      try {
        const f = await fetchText(new URL(feedHref, finalUrl).toString());
        ({ items, channelHost } = parseFeed(f.text, f.finalUrl));
      } catch { /* feed oxunmadı — səhifə linklərinə keç */ }
    }
    if (!items.length) items = heuristicLinks(text, finalUrl);
  }
  const host = new URL(finalUrl).hostname;
  const seen = new Set<string>();
  return items
    .filter((i) => {
      try { const h = new URL(i.url).hostname; return sameSite(h, host) || (channelHost ? sameSite(h, channelHost) : false); } catch { return false; }
    })
    .filter((i) => (seen.has(i.url) ? false : (seen.add(i.url), true)))
    .slice(0, 50);
}

/* ---------------- xəbər səhifəsindən mətn ---------------- */
const JUNK_LINE = /^(foto|photo|video|mənbə|source|reklam|ad|paylaş|share|oxşar|əlaqəli|related|bu da maraqlıdır|ətraflı|həmçinin oxuyun|abunə|subscribe|telegram|facebook|instagram|youtube|tiktok|whatsapp|©)\b/i;

export function extractArticle(html: string, pageUrl: string): Extracted {
  const $ = cheerio.load(html);
  const meta = (sel: string) => $(sel).first().attr("content")?.trim() ?? "";
  const abs = (u: string) => { try { return u ? new URL(u, pageUrl).toString() : ""; } catch { return ""; } };

  const title = meta('meta[property="og:title"]') || $("h1").first().text().trim() || $("title").text().trim();
  const siteName = meta('meta[property="og:site_name"]') || meta('meta[name="application-name"]');
  const date = meta('meta[property="article:published_time"]') || meta('meta[itemprop="datePublished"]') || $("time[datetime]").first().attr("datetime") || "";
  let image = abs(meta('meta[property="og:image"]') || meta('meta[name="twitter:image"]'));

  $("script,style,noscript,nav,header,footer,aside,form,iframe,svg,button,figcaption,[class*='share'],[class*='social'],[class*='related'],[class*='comment'],[class*='banner'],[class*='advert'],[class*='sidebar'],[class*='menu'],[id*='comment'],[id*='related'],[id*='sidebar']").remove();

  const score = (el: cheerio.Cheerio<never>) => {
    let s = 0;
    el.find("p").each((_, p) => { const t = $(p).text().trim(); if (t.length >= 40) s += t.length; });
    return s;
  };
  const els = $("article, main, section, div, [itemprop='articleBody']").slice(0, 700).toArray();
  let max = 0;
  const scored = els.map((e) => { const s = score($(e) as never); if (s > max) max = s; return { e, s }; });
  const close = scored.filter((x) => x.s >= max * 0.9 && x.s > 0);
  const best = close.sort((a, b) => $(a.e).find("*").length - $(b.e).find("*").length)[0]?.e;

  const paras: string[] = [];
  if (best) {
    $(best).find("p, blockquote").each((_, p) => {
      const t = $(p).text().replace(/\s+/g, " ").trim();
      if (t.length >= 25 && !JUNK_LINE.test(t) && !paras.includes(t)) paras.push(t);
    });
    if (!image) image = abs($(best).find("img").first().attr("src") ?? "");
  }
  return { title, siteName, image, date, text: paras.join("\n\n").slice(0, 14000) };
}

/** Şəkli endirir (SSRF yoxlaması + ölçü limiti). */
export async function downloadImage(url: string, maxBytes = 12 * 1024 * 1024): Promise<{ blob: Blob; name: string } | null> {
  try {
    assertPublicHttpUrl(url);
    const res = await fetch(url, { headers: { "user-agent": BOT_UA, accept: "image/*" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    assertPublicHttpUrl(res.url || url);
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength > maxBytes || buf.byteLength < 2000) return null;
    return { blob: new Blob([buf], { type }), name: `xeber.${type.split("/")[1]?.split(";")[0] || "jpg"}` };
  } catch {
    return null;
  }
}
