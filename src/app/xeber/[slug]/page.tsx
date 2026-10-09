import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";
import { Badge, Container } from "@/components/ui";
import { ImageCard } from "@/components/cards";
import { byCategory, categoryName, fmtTime, getArticle } from "@/data/news";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return { title: a?.title ?? "Xəbər" };
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const related = byCategory(a.category).filter((x) => x.slug !== a.slug).slice(0, 4);
  return (
    <>
      <Container className="max-w-[920px] pt-14">
        <Link href={`/kateqoriya/${a.category}`}><Badge>{categoryName(a.category)}</Badge></Link>
        <h1 className="mt-5 text-[27px] font-semibold leading-[1.15] tracking-[-0.04em] sm:text-[34px]">{a.title}</h1>
        <Reveal delay={0.1}>
          <div className="mt-6 flex items-center text-[15px] text-[#6f6f6f]">
            {a.author && (<><span>{a.author}</span><span className="mx-3 h-6 w-px bg-[#6f6f6f]" /></>)}
            <span>{fmtTime(a.date)}</span>
          </div>
        </Reveal>
        <Reveal><Parallax className="mt-10 aspect-[1.7/1] rounded-[14px]"><Img src={a.image} alt={a.title} /></Parallax></Reveal>
        <div className="mt-10 space-y-6 text-[16px] leading-[1.85] text-[#333]">
          <Reveal><p>{a.excerpt}</p></Reveal>
          {a.body?.map((p, i) => <Reveal key={i}><p>{p}</p></Reveal>)}
        </div>
      </Container>
      {related.length > 0 && (
        <Container className="pt-24">
          <h2 className="mb-8 text-[23px] font-medium tracking-[-0.04em]">Əlaqəli xəbərlər</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
