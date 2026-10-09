import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: "Cənub Xəbər — Azərbaycan xəbər portalı: gündəm, son xəbərlər və kateqoriyalar üzrə operativ məlumat.",
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: "az_AZ", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
