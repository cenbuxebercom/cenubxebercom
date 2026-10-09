import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import { Container } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { categories, byCategory } from "@/data/news";

export const metadata = { title: "Categories — PressPoint" };

export default function Categories() {
  return (
    <>
      <PageTitle title="Category" sub="Browse stories by topic." />
      <Container className="grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#e6e1db] p-7 transition-colors hover:border-brand">
            <span>
              <span className="block text-[20px] font-semibold tracking-[-0.02em]">{c.name}</span>
              <span className="text-[15px] text-[#6f6f6f]">{byCategory(c.slug).length} stories</span>
            </span>
            <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </Container>
    </>
  );
}
