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

export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("az", { timeZone: "Asia/Baku", ...o }).format(new Date(iso));

export const fmtLong = (iso: string) => fmt(iso, { day: "numeric", month: "long", year: "numeric" });
export const fmtShort = (iso: string) => fmt(iso, { day: "numeric", month: "short", year: "numeric" });
export const fmtTime = (iso: string) =>
  fmt(iso, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
