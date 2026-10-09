import PageTitle from "@/components/PageTitle";
import { Container } from "@/components/ui";
import { authors } from "@/data/news";

export const metadata = { title: "Authors — PressPoint" };

export default function Authors() {
  return (
    <>
      <PageTitle title="Authors" sub="Meet the reporters and editors behind PressPoint." />
      <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {authors.map((a) => (
          <div key={a.slug} className="rounded-2xl border border-[#e6e1db] p-7">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0a5a0] text-[24px] font-semibold text-white">{a.name[0]}</span>
            <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.02em]">{a.name}</h3>
            <p className="mt-1 text-[15px] text-[#6f6f6f]">{a.count} articles</p>
          </div>
        ))}
      </Container>
    </>
  );
}
