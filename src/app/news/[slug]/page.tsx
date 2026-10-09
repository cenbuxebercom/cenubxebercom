import Link from "next/link";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import { Badge, Container } from "@/components/ui";
import { ImageCard } from "@/components/cards";
import { articles, categorySlug, fmtTime, getArticle } from "@/data/news";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  return { title: a ? `${a.title} — PressPoint` : "PressPoint" };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 4);
  const more = related.length ? related : articles.filter((x) => x.slug !== a.slug).slice(0, 4);
  return (
    <>
      <Container className="max-w-[920px] pt-14">
        <Link href={`/category/${categorySlug(a.category)}`}><Badge>{a.category}</Badge></Link>
        <h1 className="mt-6 text-[36px] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-[52px]">{a.title}</h1>
        <div className="mt-6 flex items-center text-[17px] text-[#6f6f6f]">
          <span>{a.author}</span><span className="mx-3 h-6 w-px bg-[#6f6f6f]" /><span>{fmtTime(a.date)}</span>
        </div>
        <div className="mt-10 aspect-[1.7/1] overflow-hidden rounded-[14px]"><Img src={a.image} alt={a.title} /></div>
        <div className="mt-10 space-y-6 text-[19px] leading-[1.85] text-[#333]">
          <p>{a.excerpt}</p>
          <p>Officials said the move marks a turning point, with analysts expecting wide-ranging effects over the coming months. Reaction from industry groups and the public has been swift, and further announcements are expected in the days ahead.</p>
          <p>PressPoint will continue to follow the story and update this article as new information becomes available.</p>
        </div>
      </Container>
      <Container className="pt-24">
        <h2 className="mb-8 text-[30px] font-medium tracking-[-0.04em]">Related stories</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {more.map((x) => <ImageCard key={x.slug} a={x} />)}
        </div>
      </Container>
    </>
  );
}
