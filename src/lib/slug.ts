const MAP: Record<string, string> = { ə: "e", Ə: "e", ı: "i", İ: "i", ö: "o", Ö: "o", ü: "u", Ü: "u", ş: "s", Ş: "s", ç: "c", Ç: "c", ğ: "g", Ğ: "g" };

export function slugify(input: string) {
  const s = input
    .replace(/[əƏıİöÖüÜşŞçÇğĞ]/g, (c) => MAP[c] ?? c)
    .toLowerCase()
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
    .replace(/-$/, "");
  return s || "xeber";
}
