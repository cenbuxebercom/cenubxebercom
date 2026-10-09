import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/fx/Preloader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Cursor from "@/components/fx/Cursor";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: { default: "Cənub Xəbər", template: "%s — Cənub Xəbər" },
  description: "Cənub Xəbər — Azərbaycan xəbər portalı: gündəm, son xəbərlər və kateqoriyalar üzrə operativ məlumat.",
  applicationName: "Cənub Xəbər",
  openGraph: { siteName: "Cənub Xəbər", locale: "az_AZ", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <noscript><style>{`.preloader{display:none!important}`}</style></noscript>
        <Preloader />
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <TopBar />
        <Suspense fallback={<div className="h-[88px] bg-navy md:h-[111px]" />}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
