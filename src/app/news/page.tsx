import PageTitle from "@/components/PageTitle";
import { ImageCard } from "@/components/cards";
import { Container } from "@/components/ui";
import { articles } from "@/data/news";

export const metadata = { title: "News — PressPoint" };

export default function News() {
  return (
    <>
      <PageTitle title="News" sub="All the latest stories." />
      <Container className="grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => <ImageCard key={a.slug} a={a} />)}
      </Container>
    </>
  );
}
