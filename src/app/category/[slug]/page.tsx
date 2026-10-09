import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { ImageCard } from "@/components/cards";
import { Container } from "@/components/ui";
import { byCategory, categories } from "@/data/news";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = byCategory(slug);
  return (
    <>
      <PageTitle title={cat.name} />
      <Container className="grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((a) => <ImageCard key={a.slug} a={a} />)}
      </Container>
    </>
  );
}
