import PageTitle from "./PageTitle";
import Reveal from "./fx/Reveal";
import { Container } from "./ui";

export type Section = { h: string; p?: string[]; list?: string[] };

export default function LegalPage({ title, intro, updated, sections }: { title: string; intro: string; updated: string; sections: Section[] }) {
  return (
    <>
      <PageTitle title={title} sub={intro} />
      <Container className="max-w-[860px] py-12">
        <p className="mb-8 text-[13px] text-[#8a8a8a]">Son yenilənmə: {updated}</p>
        <div className="space-y-9">
          {sections.map((s, i) => (
            <Reveal key={s.h}>
              <section>
                <h2 className="text-[19px] font-semibold tracking-[-0.02em]"><span className="mr-2 text-brand">{i + 1}.</span>{s.h}</h2>
                {s.p?.map((t, k) => <p key={k} className="mt-3 text-[15px] leading-[1.85] text-[#444]">{t}</p>)}
                {s.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-[#444] marker:text-brand">
                    {s.list.map((t, k) => <li key={k}>{t}</li>)}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
