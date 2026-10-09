import { Container } from "./ui";

export default function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <section className="border-b border-[#e6e1db]">
      <Container className="py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 shrink-0 bg-brand" />
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] sm:text-[36px]">{title}</h1>
        </div>
        {sub && <p className="mt-4 max-w-[720px] text-[15px] leading-[1.7] text-[#5f5f5f]">{sub}</p>}
      </Container>
    </section>
  );
}
