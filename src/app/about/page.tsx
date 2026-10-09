import PageTitle from "@/components/PageTitle";
import { Container } from "@/components/ui";

export const metadata = { title: "About — PressPoint" };

const stats = [["120+", "Journalists"], ["35", "Countries covered"], ["2M", "Monthly readers"], ["24/7", "Live updates"]];

export default function About() {
  return (
    <>
      <PageTitle title="About PressPoint" sub="Independent, fast and reliable reporting on the stories that shape the world." />
      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div className="space-y-6 text-[18px] leading-[1.8] text-[#444]">
          <p>PressPoint is a modern newsroom delivering breaking news, in-depth analysis and global perspectives across politics, economy, technology, science, sports and culture.</p>
          <p>Our editors and correspondents work around the clock to verify facts, add context and bring you the headlines that matter — without noise.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {stats.map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-[#fdf3ee] p-8">
              <p className="text-[44px] font-semibold tracking-[-0.04em] text-navy">{n}</p>
              <p className="mt-1 text-[16px] text-[#5a5f87]">{l}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
