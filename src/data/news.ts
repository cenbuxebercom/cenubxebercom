export type Article = {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string; // ISO
  image: string;
  excerpt: string;
};

export const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const categorySlug = slugify;

const d = "2025-09-20T09:00:00Z";
const dt = "2025-11-17T02:12:00Z";

const make = (
  title: string,
  category: string,
  author: string,
  date: string,
  seed: string,
  excerpt = "World leaders gathered in Geneva to discuss urgent actions for global warming, pledging new commitments to renewable energy and emission reduction by 2030.",
): Article => ({
  slug: slugify(title),
  title,
  category,
  author,
  date,
  image: img(seed, 1200, 800),
  excerpt,
});

export const articles: Article[] = [
  // hero
  make("Global Leaders Commit to Ambitious Climate Goals at Geneva Summit.", "Environment", "Emma Richards", dt, "geneva"),
  // top stories
  make("Streaming Platforms Compete for Viewers as Subscriptions Hit Record Highs", "Environment", "Olivia Brown", d, "streaming"),
  make("Breakthrough in Renewable Energy Storage Could Transform Global Power Supply", "Science & Environment", "Daniel Kim", d, "renewable"),
  make("Major Cities Adopt AI Traffic Systems to Combat Congestion and Pollution", "Technology", "Sophia Turner", d, "traffic"),
  make("Global Markets React Positively to Trade Agreement Between Asia and Europe", "Entertainment", "James Patel", d, "markets"),
  make("Chatbots Redefine Online Learning as Students Embrace Virtual Tutors", "Technology", "Hannah Scott", d, "chatbots"),
  // two cards
  make("AI Revolution Accelerates as Tech Giants Unveil Next-Gen Intelligent Assistants", "Technology", "Hannah Scott", dt, "airevolution"),
  make("Stock Markets Surge as Investors Regain Confidence After Inflation Cooldowns", "Economy", "James Patel", dt, "stockmarkets"),
  // economy
  make("Electric Racing Series Draws Record Crowds in Europe", "Economy", "Liam Carter", d, "racing"),
  make("Cities Rethink Highways as Urban Planners Favor Green Corridors", "Economy", "Mia Johnson", d, "highways"),
  make("The Rise of Artificial Intelligence in Everyday Technology", "Technology", "Isabella Ruiz", dt, "airise"),
  // lifestyle
  make("More people are embracing minimalist lifestyles, focusing on possessions.", "Lifestyle", "Ava Wilson", d, "minimalist"),
  make("Remote work reshapes how families choose where to live.", "Lifestyle", "Noah Davis", d, "remote"),
  // science & health
  make("Demand for mental health support tools continues to rise as people seek.", "Astronomy", "Emma Richards", d, "mental"),
  make("Researchers have corrected genetic mutations in human cells.", "Wellness", "Daniel Kim", d, "genetic"),
  make("Recent satellite data shows the Arctic ice melting faster than expected.", "Climate Change", "Olivia Brown", d, "arctic"),
  make("Scientists develop a next-gen vaccine that could target multiple.", "Health", "Sophia Turner", d, "vaccine"),
  // sports & entertainment
  make("Cinema revenues hit a new post-pandemic high, fueled by blockbuster releases and strong attendance.", "Tennis", "Liam Carter", d, "cinema"),
  make("A thrilling final match saw an unexpected champion rise, stunning fans and analysts alike.", "Esports", "Mia Johnson", d, "champion"),
  make("Baseball season opens to sold-out stadiums across the country.", "Sports", "Noah Davis", d, "baseball"),
  make("Football clubs invest in youth academies to build future stars.", "Football", "Ava Wilson", d, "football"),
  make("Hollywood streets come alive as the premiere season begins.", "Entertainment", "James Patel", d, "hollywood"),
];

export const byCategory = (cat: string) =>
  articles.filter((a) => categorySlug(a.category) === cat);

export const categories = Array.from(new Set(articles.map((a) => a.category))).map(
  (name) => ({ name, slug: categorySlug(name) }),
);

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const tickerHeadlines = [
  "Stocks Advance as Cooling Prices Renew Investor Confidence",
  "Shares Surge as Inflation Relief Boosts Market Sentiment",
  "Equities Climb as Investors Cheer Slowdown in Inflation Rates",
  "Global Markets Surge Amid Investor Optimism Over Lower Inflation",
];

export const authors = Array.from(new Set(articles.map((a) => a.author))).map(
  (name) => ({
    name,
    slug: slugify(name),
    count: articles.filter((a) => a.author === name).length,
  }),
);

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...o }).format(new Date(iso));

export const fmtLong = (iso: string) =>
  fmt(iso, { month: "long", day: "numeric", year: "numeric" });
export const fmtShort = (iso: string) =>
  fmt(iso, { month: "short", day: "numeric", year: "numeric" });
export const fmtTime = (iso: string) =>
  fmt(iso, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
export const fmtNumeric = (iso: string) =>
  fmt(iso, { year: "2-digit", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" });
