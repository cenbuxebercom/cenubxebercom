import Link from "next/link";
import Ticker from "@/components/Ticker";
import Img from "@/components/Img";
import SocialBanner from "@/components/SocialBanner";
import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";
import Tilt from "@/components/fx/Tilt";
import { ImageCard, ListItem, OverlayCard } from "@/components/cards";
import { Badge, Container, Empty, SectionHeading } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { categoryName, fmtLong } from "@/data/news";
import { byCategory, getAllArticles, getFeatured, getLatest, getPopular, type Article } from "@/lib/articles";

const PAIRS: [string, string][] = [
  ["siyaset", "iqtisadiyyat"],
  ["cemiyyet", "region"],
  ["dunya", "texnologiya"],
];

function CategoryColumn({ slug, all }: { slug: string; all: Article[] }) {
  const list = byCategory(all, slug);
  if (!list.length) return <div />;
  const [first, ...rest] = list;
  return (
    <section>
      <SectionHeading title={categoryName(slug)} href={`/kateqoriya/${slug}`} />
      <div className="mt-6">
        <Reveal><ImageCard a={first} ratio="aspect-[1.9/1]" /></Reveal>
        <div className="mt-6">
          {rest.slice(0, 3).map((a) => <ListItem key={a.slug} a={a} />)}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const all = await getAllArticles();
  const latest = getLatest(all);
  const featured = getFeatured(all);
  const hero = featured[0] ?? latest[0];

  if (!hero) {
    return (
      <>
        <Ticker />
        <Container className="py-10"><Empty /></Container>
      </>
    );
  }

  const side = (featured.length > 1 ? featured : latest).filter((a) => a.slug !== hero.slug).slice(0, 5);
  const used = new Set([hero.slug, ...side.map((a) => a.slug)]);
  const under = latest.filter((a) => !used.has(a.slug)).slice(0, 2);
  under.forEach((a) => used.add(a.slug));
  const recent = latest.filter((a) => !used.has(a.slug)).slice(0, 8);
  const popular = getPopular(all, 5);
  const dark = [...byCategory(all, "idman").slice(0, 2), ...byCategory(all, "medeniyyet").slice(0, 3)];
  const health = byCategory(all, "seheyye").slice(0, 4);

  return (
    <>
      <Ticker />
      <Container className="pt-8">
        {/* ana xəbər + gündəm */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1px_460px] lg:gap-9">
          <div>
            <article>
              <Link href={`/xeber/${hero.slug}`} className="group relative block aspect-[1.7/1] overflow-hidden rounded-xl">
                <Parallax className="absolute inset-0" amount={12}><Img src={hero.image} alt={hero.title} priority sizes="(min-width: 1024px) 60vw, 100vw" /></Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <Badge>{categoryName(hero.category)}</Badge>
                  <h1 className="mt-3 max-w-[760px] text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-white sm:text-[30px]">{hero.title}</h1>
                  <p className="mt-3 text-[13px] text-white/70">{fmtLong(hero.date)}</p>
                </div>
              </Link>
            </article>
            {under.length > 0 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {under.map((a, i) => <Reveal key={a.slug} delay={i * 0.06}><ImageCard a={a} ratio="aspect-[1.7/1]" /></Reveal>)}
              </div>
            )}
          </div>
          <div className="hidden bg-[#e6e1db] lg:block" />
          <aside>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-5 w-5 bg-brand" />
              <h2 className="text-[22px] font-medium tracking-[-0.03em]">Gündəm</h2>
              <Link href="/gundem" className="group ml-auto flex items-center gap-2 text-[14px] text-brand">
                Hamısı <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            {side.map((a, i) => <Reveal key={a.slug} dir="left" delay={i * 0.04}><ListItem a={a} /></Reveal>)}
          </aside>
        </div>

        {/* son xəbərlər */}
        {recent.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="Son xəbərlər" href="/son" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((a, i) => <Reveal key={a.slug} delay={(i % 4) * 0.05}><ImageCard a={a} ratio="aspect-[1.4/1]" /></Reveal>)}
            </div>
          </section>
        )}

        {/* ən çox oxunan */}
        {popular.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="Ən çox oxunan" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {popular.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.05}>
                  <Tilt>
                    <Link href={`/xeber/${a.slug}`} className="group block h-full rounded-xl border border-[#e6e1db] p-5 transition-colors hover:border-brand">
                      <span className="text-[34px] font-bold leading-none tracking-[-0.05em] text-brand/80">{String(i + 1).padStart(2, "0")}</span>
                      <p className="mt-3 text-[11px] uppercase tracking-wide text-[#8a8a8a]">{categoryName(a.category)}</p>
                      <h3 className="mt-2 text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] group-hover:text-brand">{a.title}</h3>
                    </Link>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* kateqoriya cütləri */}
        {PAIRS.filter(([a, b]) => byCategory(all, a).length + byCategory(all, b).length > 0).map(([a, b]) => (
          <div key={a} className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-10">
            <CategoryColumn slug={a} all={all} />
            <CategoryColumn slug={b} all={all} />
          </div>
        ))}

        <SocialBanner />
      </Container>

      {/* idman və mədəniyyət */}
      {dark.length > 0 && (
        <section className="mt-16 bg-navy py-14">
          <Container>
            <SectionHeading title="İdman və Mədəniyyət" href="/kateqoriya/idman" dark square={false} />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {dark.slice(0, 2).map((a) => <Reveal key={a.slug}><OverlayCard a={a} className="aspect-[1.9/1]" /></Reveal>)}
            </div>
            {dark.length > 2 && (
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {dark.slice(2).map((a, i) => (
                  <Reveal key={a.slug} delay={i * 0.06}><OverlayCard a={a} size="md" className="aspect-[1.2/1]" /></Reveal>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {health.length > 0 && (
        <Container className="mt-16">
          <SectionHeading title="Səhiyyə" href="/kateqoriya/seheyye" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {health.map((a, i) => <Reveal key={a.slug} delay={i * 0.05}><ImageCard a={a} ratio="aspect-[1.4/1]" /></Reveal>)}
          </div>
        </Container>
      )}
    </>
  );
}
