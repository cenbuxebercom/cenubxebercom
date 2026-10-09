import { testArticles } from "./test-articles";

export type Article = {
  slug: string;
  title: string;
  category: string; // kateqoriya slug-ı (aşağıdakı `categories`-dən)
  date: string; // ISO
  image: string;
  excerpt: string;
  body?: string[];
  author?: string;
  featured?: boolean; // "Gündəm" bölməsi
};

export const SITE_NAME = "Cənub Xəbər";
export const SITE_EMAIL = "info@cenubxeber.com";

export const categories = [
  { name: "Siyasət", slug: "siyaset" },
  { name: "İqtisadiyyat", slug: "iqtisadiyyat" },
  { name: "Cəmiyyət", slug: "cemiyyet" },
  { name: "Region", slug: "region" },
  { name: "Dünya", slug: "dunya" },
  { name: "İdman", slug: "idman" },
  { name: "Mədəniyyət", slug: "medeniyyet" },
  { name: "Texnologiya", slug: "texnologiya" },
  { name: "Səhiyyə", slug: "seheyye" },
];

/** Xəbərlər burada saxlanılır. `...testArticles` test xəbərləridir — real xəbər əlavə etdikdən sonra silin. */
export const articles: Article[] = [...testArticles];

const sorted = () => [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const getLatest = () => sorted();
export const getFeatured = () => sorted().filter((a) => a.featured);
export const byCategory = (slug: string) => sorted().filter((a) => a.category === slug);

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("az", { timeZone: "Asia/Baku", ...o }).format(new Date(iso));

export const fmtLong = (iso: string) => fmt(iso, { day: "numeric", month: "long", year: "numeric" });
export const fmtShort = (iso: string) => fmt(iso, { day: "numeric", month: "short", year: "numeric" });
export const fmtTime = (iso: string) =>
  fmt(iso, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
