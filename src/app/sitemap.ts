import type { MetadataRoute } from "next";
import { categories } from "@/data/news";
import { getAllArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const pages = ["", "/gundem", "/son", "/kateqoriya", "/haqqimizda", "/elaqe", "/mexfilik-siyaseti", "/istifade-sertleri"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}` })),
    ...categories.map((c) => ({ url: `${SITE_URL}/kateqoriya/${c.slug}` })),
    ...articles.map((a) => ({ url: `${SITE_URL}/xeber/${a.slug}`, lastModified: a.date })),
  ];
}
