import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import Reveal from "@/components/fx/Reveal";
import ShareBar from "@/components/ShareBar";
import ViewCounter from "@/components/ViewCounter";
import { Badge, Container } from "@/components/ui";
import { ImageCard } from "@/components/cards";
import { bodyParagraphs, byCategory, findArticle, getAllArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";
import { categoryName, fmtTime } from "@/data/news";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = findArticle(await getAllArticles(), slug);
  if (!a) return { title: "Xəbər" };
  const url = `${SITE_URL}/xeber/${a.slug}`;
  const description = a.excerpt || a.title;
  return {
    title: a.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article", url, title: a.title, description, siteName: "Cənub Xəbər", locale: "az_AZ",
      publishedTime: a.date, images: a.image ? [{ url: a.image, alt: a.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: a.title, description, images: a.image ? [a.image] : undefined },
  };
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getAllArticles();
  const a = findArticle(all, slug);
  if (!a) notFound();
  const related = byCategory(all, a.category).filter((x) => x.slug !== a.slug).slice(0, 4);
  const paras = bodyParagraphs(a.body);
  return (
    <>
      <ViewCounter slug={a.slug} />
      <Container className="max-w-[760px] pt-10">
        <Link href={`/kateqoriya/${a.category}`}><Badge>{categoryName(a.category)}</Badge></Link>
        <h1 className="mt-4 text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[32px]">{a.title}</h1>
        <div className="mt-4 flex items-center text-[13px] text-[#6f6f6f]">
          {a.author && (<><span>{a.author}</span><span className="mx-3 h-4 w-px bg-[#6f6f6f]" /></>)}
          <span>{fmtTime(a.date)}</span>
        </div>
        {a.image && (
          <Reveal>
            <div className="mt-6 aspect-[16/10] w-full max-w-[520px] overflow-hidden rounded-xl"><Img src={a.image} alt={a.title} /></div>
          </Reveal>
        )}
        {a.excerpt && <p className="mt-6 text-[16px] font-medium leading-[1.7] text-[#222]">{a.excerpt}</p>}
        <div className="mt-5 space-y-4 text-[15px] leading-[1.85] text-[#333]">
          {paras.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ShareBar url={`${SITE_URL}/xeber/${a.slug}`} title={a.title} />
      </Container>
      {related.length > 0 && (
        <Container className="pt-16">
          <h2 className="mb-6 text-[22px] font-medium tracking-[-0.03em]">Əlaqəli xəbərlər</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((x) => <ImageCard key={x.slug} a={x} />)}
          </div>
        </Container>
      )}
    </>
  );
}

export default function XeberPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}
