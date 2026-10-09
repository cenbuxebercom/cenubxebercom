import PageTitle from "@/components/PageTitle";
import { Container } from "@/components/ui";

export const metadata = { title: "Terms & Conditions — PressPoint" };

export default function Page() {
  return (
    <>
      <PageTitle title="Terms & Conditions" />
      <Container className="max-w-[820px] space-y-6 py-16 text-[18px] leading-[1.85] text-[#444]">
        <p>This page describes how PressPoint handles the topic above. Replace this placeholder text with your final legal copy.</p>
        <p>Last updated: 2025.</p>
      </Container>
    </>
  );
}
