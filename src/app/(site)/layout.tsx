import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/fx/SmoothScroll";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Cursor from "@/components/fx/Cursor";
import { getSocials } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const socials = await getSocials();
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <TopBar socials={socials} />
      <Suspense fallback={<div className="h-[61px] bg-navy" />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
