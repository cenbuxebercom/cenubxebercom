import Link from "next/link";
import Ticker from "@/components/Ticker";
import Img from "@/components/Img";
import SocialBanner from "@/components/SocialBanner";
import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";
import Glow from "@/components/fx/Glow";
import Tilt from "@/components/fx/Tilt";
import SplitText from "@/components/fx/SplitText";
import { ImageCard, ListItem, OverlayCard } from "@/components/cards";
import { Badge, Container, SectionHeading } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { byCategory, categories, categoryName, fmtLong, getFeatured, getLatest } from "@/data/news";

export default function Home() {
  const latest = getLatest();
  const featured = getFeatured();
  const hero = featured[0] ?? latest[0];
  const side = (featured.length > 1 ? featured : latest).filter((a) => a.slug !== hero?.slug).slice(0, 5);
  const used = new Set([hero?.slug, ...side.map((a) => a.slug)]);
  const recent = latest.filter((a) => !used.has(a.slug)).slice(0, 4);
  const blocks = categories
    .filter((c) => c.slug !== "idman" && c.slug !== "medeniyyet")
    .map((c) => ({ ...c, list: byCategory(c.slug).slice(0, 4) }))
    .filter((c) => c.list.length);
  const dark = [...byCategory("idman").slice(0, 2), ...byCategory("medeniyyet").slice(0, 3)];

  return (
    <>
      <Ticker />
      <Container className="pt-12">
        {!hero ? (
          <>
            <Glow className="rounded-2xl bg-navy px-6 py-20 text-center text-white sm:py-28">
              <SplitText as="h1" text="Cənub Xəbər" className="text-[44px] font-bold tracking-[-0.06em] sm:text-[72px]" />
              <Reveal delay={0.2}>
                <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-[1.8] text-white/60">
                  Hələlik xəbər yoxdur. Xəbərlər əlavə olunduqca gündəm və son xəbərlər burada görünəcək.
                </p>
              </Reveal>
            </Glow>
            <div className="mt-16"><SectionHeading title="Kateqoriyalar" href="/kateqoriya" /></div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 3) * 0.06}>
                  <Tilt>
                    <Link href={`/kateqoriya/${c.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#e6e1db] p-7 transition-colors hover:border-brand">
                      <span className="text-[22px] font-semibold tracking-[-0.02em]">{c.name}</span>
                      <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1px_520px] lg:gap-11">
            <div>
              <Reveal>
                <article>
                  <Link href={`/xeber/${hero.slug}`} className="group relative block aspect-[1.55/1] overflow-hidden rounded-[14px]">
                    <Parallax className="absolute inset-0" amount={30}><Img src={hero.image} alt={hero.title} /></Parallax>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
                      <Badge>{categoryName(hero.category)}</Badge>
                      <p className="mt-4 text-[16px] text-white/70">{fmtLong(hero.date)}</p>
                    </div>
                  </Link>
                  <h1 className="mt-8 text-[34px] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-[46px]">
                    <Link href={`/xeber/${hero.slug}`}>{hero.title}</Link>
                  </h1>
                  <p className="mt-5 max-w-[760px] text-[17px] leading-[1.7] text-[#444]">{hero.excerpt}</p>
                </article>
              </Reveal>
              {recent.length > 0 && (
                <div className="mt-14 grid gap-8 sm:grid-cols-2">
                  {recent.slice(0, 2).map((a, i) => <Reveal key={a.slug} delay={i * 0.08}><ImageCard a={a} ratio="aspect-[1.6/1]" /></Reveal>)}
                </div>
              )}
            </div>
            <div className="hidden bg-[#e6e1db] lg:block" />
            <aside>
              <div className="mb-8 flex items-center gap-4">
                <span className="h-6 w-6 bg-brand" />
                <h2 className="text-[34px] font-medium tracking-[-0.04em]">Gündəm</h2>
                <Link href="/gundem" className="group ml-auto flex items-center gap-2.5 text-[16px] text-brand">
                  Hamısı <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              {side.map((a, i) => <Reveal key={a.slug} dir="left" delay={i * 0.05}><ListItem a={a} /></Reveal>)}
            </aside>
          </div>
        )}

        {recent.length > 2 && (
          <section className="mt-24">
            <SectionHeading title="Son xəbərlər" href="/son" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((a, i) => <Reveal key={a.slug} delay={i * 0.06}><ImageCard a={a} ratio="aspect-[1.19/1]" /></Reveal>)}
            </div>
          </section>
        )}

        {blocks.map((c) => (
          <section key={c.slug} className="mt-24">
            <SectionHeading title={c.name} href={`/kateqoriya/${c.slug}`} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.list.map((a, i) => <Reveal key={a.slug} delay={i * 0.06}><ImageCard a={a} ratio="aspect-[1.19/1]" /></Reveal>)}
            </div>
          </section>
        ))}

        <SocialBanner />
      </Container>

      {dark.length > 0 && (
        <Glow className="mt-24 bg-navy py-20" color="rgba(220,68,55,0.22)">
          <Container>
            <SectionHeading title="İdman və Mədəniyyət" href="/kateqoriya/idman" dark square={false} />
            <div className="mt-12 grid gap-7 md:grid-cols-2">
              {dark.slice(0, 2).map((a) => <Reveal key={a.slug}><OverlayCard a={a} className="aspect-[1.82/1]" /></Reveal>)}
            </div>
            {dark.length > 2 && (
              <div className="mt-12 grid gap-7 md:grid-cols-3">
                {dark.slice(2).map((a, i) => (
                  <Reveal key={a.slug} delay={i * 0.08} className={i === 1 ? "md:-translate-y-7" : ""}>
                    <OverlayCard a={a} size="md" className="aspect-[0.82/1]" />
                  </Reveal>
                ))}
              </div>
            )}
          </Container>
        </Glow>
      )}
    </>
  );
}
