import { validCategory } from "./articles";

export type ArticleInput = {
  title: string; excerpt: string; body: string; category: string; image: string;
  author: string | null; featured: boolean; published: boolean; published_at: string;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseArticle(raw: unknown): { ok: true; data: ArticleInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Yanlış sorğu" };
  const r = raw as Record<string, unknown>;
  const title = str(r.title, 200);
  const category = str(r.category, 40);
  const image = str(r.image, 1000);
  if (title.length < 3) return { ok: false, error: "Başlıq ən azı 3 simvol olmalıdır" };
  if (!validCategory(category)) return { ok: false, error: "Kateqoriya seçilməyib" };
  if (image && !/^https:\/\//i.test(image)) return { ok: false, error: "Şəkil linki https:// ilə başlamalıdır" };
  const when = typeof r.published_at === "string" && !Number.isNaN(Date.parse(r.published_at)) ? new Date(r.published_at).toISOString() : new Date().toISOString();
  return {
    ok: true,
    data: {
      title, category, image,
      excerpt: str(r.excerpt, 500),
      body: str(r.body, 60000),
      author: str(r.author, 100) || null,
      featured: Boolean(r.featured),
      published: r.published === undefined ? true : Boolean(r.published),
      published_at: when,
    },
  };
}
