import { Container } from "./ui";

export default function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <section className="border-b border-[#e6e1db]">
      <Container className="py-14 sm:py-20">
        <div className="flex items-center gap-4">
          <span className="h-6 w-6 bg-brand" />
          <h1 className="text-[40px] font-semibold tracking-[-0.045em] sm:text-[56px]">{title}</h1>
        </div>
        {sub && <p className="mt-5 max-w-[720px] text-[18px] leading-[1.8] text-[#5f5f5f]">{sub}</p>}
      </Container>
    </section>
  );
}
