import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "./db";
import { categories } from "@/data/news";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string; // kateqoriya slug-ı
  image: string;
  author?: string | null;
  featured: boolean;
  views: number;
  date: string; // published_at (ISO)
};

type Row = {
  id: string; slug: string; title: string; excerpt: string; body: string; category: string;
  image: string; author: string | null; featured: boolean; views: number; published_at: string;
};

export const toArticle = (r: Row): Article => ({
  id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt, body: r.body, category: r.category,
  image: r.image, author: r.author, featured: r.featured, views: r.views, date: r.published_at,
});

/** Dərc olunmuş bütün xəbərlər (keşlənir; admin paneldə dəyişiklik olanda "articles" tag-ı ilə təzələnir). */
export async function getAllArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  cacheLife("minutes");
  const db = getDb();
  if (!db) return [];
  const { data, error } = await db
    .from("articles")
    .select("id,slug,title,excerpt,body,category,image,author,featured,views,published_at")
    .eq("published", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(500);
  // xəta olarsa boş nəticəni keşləməmək üçün istisna atırıq
  if (error || !data) throw new Error(`Xəbərləri oxumaq alınmadı: ${error?.message ?? "bilinməyən xəta"}`);
  return (data as Row[]).map(toArticle);
}

export const getLatest = (list: Article[]) => list;
export const getFeatured = (list: Article[]) => list.filter((a) => a.featured);
export const byCategory = (list: Article[], slug: string) => list.filter((a) => a.category === slug);
export const findArticle = (list: Article[], slug: string) => list.find((a) => a.slug === slug);
export const getPopular = (list: Article[], n = 5) =>
  [...list].filter((a) => a.views > 0).sort((a, b) => b.views - a.views).slice(0, n);
export const bodyParagraphs = (body: string) => body.split(/\n{2,}|\r\n{2,}/).map((p) => p.trim()).filter(Boolean);
export const validCategory = (slug: string) => categories.some((c) => c.slug === slug);

const bakuDay = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baku" }).format(new Date(iso));

/** Qırmızı xəbər barı üçün: bu günün (Bakı vaxtı ilə) xəbərləri; yoxdursa ən son 10 xəbər. */
export async function getTickerItems(): Promise<{ title: string; slug: string }[]> {
  "use cache";
  cacheTag("articles");
  cacheLife("minutes");
  const all = await getAllArticles();
  const today = bakuDay(new Date().toISOString());
  let list = all.filter((a) => bakuDay(a.date) === today);
  if (!list.length) list = all.slice(0, 10);
  return list.slice(0, 20).map((a) => ({ title: a.title, slug: a.slug }));
}
