import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { ImageCard } from "@/components/cards";
import Reveal from "@/components/fx/Reveal";
import { Container, Empty } from "@/components/ui";
import { categories } from "@/data/news";
import { byCategory, getAllArticles } from "@/lib/articles";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  return { title: c?.name ?? "Kateqoriya" };
}

export default async function KateqoriyaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = byCategory(await getAllArticles(), slug);
  return (
    <>
      <PageTitle title={cat.name} />
      <Container className="py-16">
        {list.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((a, i) => <Reveal key={a.slug} delay={(i % 4) * 0.06}><ImageCard a={a} /></Reveal>)}
          </div>
        ) : <Empty />}
      </Container>
    </>
  );
}
