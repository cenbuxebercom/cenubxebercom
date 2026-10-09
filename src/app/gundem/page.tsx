import type { Metadata } from "next";
import PageTitle from "@/components/PageTitle";
import { ImageCard } from "@/components/cards";
import Reveal from "@/components/fx/Reveal";
import { Container, Empty } from "@/components/ui";
import { getFeatured } from "@/data/news";

export const metadata: Metadata = { title: "Gündəm" };

export default function Gundem() {
  const list = getFeatured();
  return (
    <>
      <PageTitle title="Gündəm" sub="Günün ən vacib və ən çox müzakirə olunan xəbərləri." />
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
