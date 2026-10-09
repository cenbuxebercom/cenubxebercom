import type { Metadata } from "next";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import Reveal from "@/components/fx/Reveal";
import Tilt from "@/components/fx/Tilt";
import { Container } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { byCategory, categories } from "@/data/news";

export const metadata: Metadata = { title: "Kateqoriyalar" };

export default function Kateqoriyalar() {
  return (
    <>
      <PageTitle title="Kateqoriyalar" sub="Xəbərləri mövzuya görə seçin." />
      <Container className="grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.06}>
            <Tilt>
              <Link href={`/kateqoriya/${c.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#e6e1db] p-7 transition-colors hover:border-brand">
                <span>
                  <span className="block text-[18px] font-semibold tracking-[-0.02em]">{c.name}</span>
                  <span className="text-[13px] text-[#6f6f6f]">{byCategory(c.slug).length} xəbər</span>
                </span>
                <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
              </Link>
            </Tilt>
          </Reveal>
        ))}
      </Container>
    </>
  );
}
