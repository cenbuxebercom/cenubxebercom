import type { Metadata } from "next";
import PageTitle from "@/components/PageTitle";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/fx/Reveal";
import { Container } from "@/components/ui";
import { SITE_EMAIL } from "@/data/news";

export const metadata: Metadata = { title: "Əlaqə" };

export default function Elaqe() {
  return (
    <>
      <PageTitle title="Əlaqə" sub="Xəbər, təklif və ya əməkdaşlıq üçün bizə yazın." />
      <Container className="grid gap-14 py-16 lg:grid-cols-[1fr_480px]">
        <Reveal dir="right"><ContactForm /></Reveal>
        <Reveal dir="left">
          <div className="space-y-4 rounded-2xl bg-[#fdf3ee] p-9 text-[17px] text-[#444]">
            <p><b className="text-navy">E-poçt:</b> <a href={`mailto:${SITE_EMAIL}`} className="hover:text-brand">{SITE_EMAIL}</a></p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
