import type { Article } from "./news";

/**
 * TEST XƏBƏRLƏR — yalnız dizaynı yoxlamaq üçündür.
 * Silmək üçün: `news.ts`-də `...testArticles` sətrini çıxarın (və bu faylı silin).
 */
const plan: [string, string, number][] = [
  ["siyaset", "Siyasət", 4],
  ["iqtisadiyyat", "İqtisadiyyat", 4],
  ["cemiyyet", "Cəmiyyət", 4],
  ["region", "Region", 4],
  ["dunya", "Dünya", 3],
  ["idman", "İdman", 5],
  ["medeniyyet", "Mədəniyyət", 4],
  ["texnologiya", "Texnologiya", 4],
  ["seheyye", "Səhiyyə", 4],
];

const variants = [
  (c: string) => `${c} bölməsi üçün əlavə olunmuş test xəbər başlığı`,
  (c: string) => `${c}: dizaynı yoxlamaq məqsədilə yazılmış uzun nümunə başlıq mətni`,
  (c: string) => `${c} bölməsində test xəbəri`,
  (c: string) => `Test xəbəri: ${c} kateqoriyası üzrə nümunə başlıq`,
  (c: string) => `${c} üzrə sınaq xəbəri — başlıq və şəkil yoxlaması`,
];

const BASE = Date.parse("2026-10-09T10:00:00Z");

const rows: { slug: string; cat: string; title: string; seed: string }[] = [];
// kateqoriyaları növbə ilə qarışdır ki, "son" siyahısı müxtəlif olsun
const max = Math.max(...plan.map((p) => p[2]));
for (let i = 0; i < max; i++) {
  for (const [slug, name, n] of plan) {
    if (i < n) rows.push({ slug, cat: name, title: variants[(i + slug.length) % variants.length](name), seed: `${slug}-${i}` });
  }
}

export const testArticles: Article[] = rows.map((r, i) => ({
  slug: `test-${r.seed}`,
  title: r.title,
  category: r.slug,
  date: new Date(BASE - i * 47 * 60_000).toISOString(),
  image: `https://picsum.photos/seed/cx-${r.seed}/1200/800`,
  excerpt: "Bu, saytın dizaynını yoxlamaq üçün əlavə edilmiş test xəbəridir. Real xəbər əlavə olunduqda bu mətn silinəcək.",
  body: [
    "Bu mətn yalnız test məqsədi daşıyır və real hadisəni əks etdirmir.",
    "Xəbər səhifəsinin görünüşünü, şriftlərini və şəkil nisbətlərini yoxlamaq üçün istifadə olunur.",
  ],
  featured: i < 12,
}));
