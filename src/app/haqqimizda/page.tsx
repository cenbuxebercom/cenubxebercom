import type { Metadata } from "next";
import PageTitle from "@/components/PageTitle";
import Reveal from "@/components/fx/Reveal";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Haqqımızda" };

export default function Haqqimizda() {
  return (
    <>
      <PageTitle title="Haqqımızda" sub="Cənub Xəbər — Azərbaycan xəbər portalı." />
      <Container className="max-w-[820px] space-y-6 py-16 text-[18px] leading-[1.85] text-[#444]">
        <Reveal><p>Cənub Xəbər Azərbaycan və dünyadan siyasət, iqtisadiyyat, cəmiyyət, region, idman, mədəniyyət və digər sahələr üzrə operativ xəbərlər təqdim edən xəbər portalıdır.</p></Reveal>
        <Reveal delay={0.08}><p>Məqsədimiz oxucuya dəqiq, tərəfsiz və vaxtında məlumat çatdırmaqdır.</p></Reveal>
      </Container>
    </>
  );
}
