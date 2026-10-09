import type { Metadata } from "next";
import PageTitle from "@/components/PageTitle";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "İstifadə şərtləri" };

export default function Page() {
  return (
    <>
      <PageTitle title="İstifadə şərtləri" />
      <Container className="max-w-[820px] space-y-6 py-16 text-[18px] leading-[1.85] text-[#444]">
        <p>Bu səhifənin mətni tezliklə əlavə olunacaq.</p>
      </Container>
    </>
  );
}
