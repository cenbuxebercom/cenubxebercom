import Link from "next/link";
import Ticker from "@/components/Ticker";
import Img from "@/components/Img";
import SocialBanner from "@/components/SocialBanner";
import { AuthorCard, ImageCard, ListItem, OverlayCard } from "@/components/cards";
import { Badge, Container, Dot, SectionHeading } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { articles, fmtNumeric, fmtShort } from "@/data/news";

const A = (i: number) => articles[i];

export default function Home() {
  const hero = A(0);
  return (
    <>
      <Ticker />
      <Container className="pt-12">
        {/* hero + top stories */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1px_520px] lg:gap-11">
          <div>
            <article>
              <Link href={`/news/${hero.slug}`} className="group relative block aspect-[1.55/1] overflow-hidden rounded-[14px]">
                <Img src={hero.image} alt={hero.title} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
                  <Badge>Environment</Badge>
                  <h2 className="mt-4 max-w-[640px] text-[22px] font-normal leading-[1.25] tracking-[-0.04em] text-white sm:text-[29px]">
                    70 nations gathered this weekend in Geneva to finalize agreement at reducing global carbon emissions
                  </h2>
                  <p className="mt-4 text-[16px] text-white/70">
                    Global News<Dot />{fmtShort("2025-09-20T09:00:00Z").replace("Sep", "September")}
                  </p>
                </div>
              </Link>
              <div className="mt-6 flex items-center text-[17px] text-[#6f6f6f]">
                <span>{hero.author}</span>
                <span className="mx-3 h-6 w-px bg-[#6f6f6f]" />
                <span>{fmtNumeric(hero.date)}</span>
              </div>
              <h1 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-[46px]">
                <Link href={`/news/${hero.slug}`}>{hero.title}</Link>
              </h1>
              <p className="mt-5 max-w-[760px] text-[17px] leading-[1.7] text-[#444]">{hero.excerpt}</p>
            </article>

            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              <AuthorCard a={A(6)} ratio="aspect-[1.97/1]" />
              <AuthorCard a={A(7)} ratio="aspect-[1.97/1]" />
            </div>
          </div>

          <div className="hidden bg-[#e6e1db] lg:block" />

          <aside>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-6 w-6 bg-brand" />
              <h2 className="text-[34px] font-medium tracking-[-0.04em]">Top Global Stories</h2>
              <Link href="/news" className="ml-auto flex items-center gap-2.5 text-[16px] text-brand">
                See All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {[1, 2, 3, 4, 5].map((i) => <ListItem key={i} a={A(i)} />)}
          </aside>
        </div>

        {/* economy + technology */}
        <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:gap-[29px]">
          <section>
            <SectionHeading title="Economy" href="/category/economy" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <ImageCard a={A(8)} ratio="aspect-[1/1]" />
              <ImageCard a={A(9)} ratio="aspect-[1/1]" />
            </div>
            <div className="mt-8">
              <ListItem a={A(11)} badge="Lifestyle" />
            </div>
          </section>
          <section>
            <SectionHeading title="Technology" href="/category/technology" />
            <div className="mt-8">
              <AuthorCard a={A(10)} ratio="aspect-[1.45/1]" avatar />
            </div>
          </section>
        </div>

        <SocialBanner />

        {/* science & health */}
        <section className="mt-24">
          <SectionHeading title="Science & Health" href="/category/health" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[13, 14, 15, 16].map((i) => <ImageCard key={i} a={A(i)} ratio="aspect-[1.19/1]" />)}
          </div>
        </section>
      </Container>

      {/* sports & entertainment */}
      <section className="mt-24 bg-navy py-20">
        <Container>
          <SectionHeading title="Sports and Entertainment" href="/category/sports" dark square={false} />
          <div className="mt-12 grid gap-7 md:grid-cols-2">
            <OverlayCard a={A(17)} className="aspect-[1.82/1]" />
            <OverlayCard a={A(18)} className="aspect-[1.82/1]" />
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            <OverlayCard a={A(19)} size="md" className="aspect-[0.82/1]" />
            <OverlayCard a={A(20)} size="md" className="aspect-[0.82/1] md:-translate-y-7" />
            <OverlayCard a={A(21)} size="md" className="aspect-[0.82/1]" />
          </div>
        </Container>
      </section>
    </>
  );
}
