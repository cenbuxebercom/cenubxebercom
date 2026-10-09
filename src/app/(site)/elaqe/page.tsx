import type { Metadata } from "next";
import PageTitle from "@/components/PageTitle";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/fx/Reveal";
import Tilt from "@/components/fx/Tilt";
import { Container } from "@/components/ui";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, TiktokIcon, YoutubeIcon } from "@/components/icons";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site";
import { getSocials } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Əlaqə",
  description: "Cənub Xəbər redaksiyası ilə əlaqə: telefon, e-poçt və mesaj formu.",
};

const card = "flex items-center gap-4 rounded-2xl border border-[#e6e1db] bg-white p-5 transition-colors hover:border-brand";
const icon = "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fdf3ee] text-brand";

export default async function Elaqe() {
  const links = await getSocials();
  const socials = ([["Facebook", links.facebook, FacebookIcon], ["Instagram", links.instagram, InstagramIcon], ["YouTube", links.youtube, YoutubeIcon], ["TikTok", links.tiktok, TiktokIcon]] as const).filter((x) => x[1]);
  return (
    <>
      <PageTitle title="Əlaqə" sub="Xəbər, təklif, düzəliş və ya əməkdaşlıq üçün redaksiyamızla əlaqə saxlayın." />
      <Container className="grid gap-12 py-12 lg:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          <Reveal dir="right">
            <Tilt>
              <a href={`tel:${SITE_PHONE_TEL}`} className={card}>
                <span className={icon}><PhoneIcon className="h-5 w-5" /></span>
                <span><span className="block text-[12px] uppercase tracking-wide text-[#8a8a8a]">Telefon</span><span className="text-[17px] font-semibold">{SITE_PHONE}</span></span>
              </a>
            </Tilt>
          </Reveal>
          <Reveal dir="right" delay={0.08}>
            <Tilt>
              <a href={`mailto:${SITE_EMAIL}`} className={card}>
                <span className={icon}><MailIcon className="h-5 w-5" /></span>
                <span><span className="block text-[12px] uppercase tracking-wide text-[#8a8a8a]">E-poçt</span><span className="text-[17px] font-semibold">{SITE_EMAIL}</span></span>
              </a>
            </Tilt>
          </Reveal>
          <Reveal dir="right" delay={0.16}>
            <div className="rounded-2xl bg-navy p-6 text-white">
              {socials.length > 0 && (
                <>
                  <p className="text-[15px] font-semibold">Bizi sosial şəbəkələrdə izləyin</p>
                  <div className="mt-4 flex gap-5">
                    {socials.map(([l, h, Icon]) => (
                      <a key={l} href={h} target="_blank" rel="noopener noreferrer" aria-label={l} className="transition-transform hover:-translate-y-1"><Icon className="h-6 w-6" /></a>
                    ))}
                  </div>
                </>
              )}
              <p className={`${socials.length ? "mt-5" : ""} text-[13px] leading-[1.7] text-white/60`}>Xəbər göndərmək və ya düzəliş təklif etmək üçün telefon, e-poçt və ya sağdakı formadan istifadə edə bilərsiniz.</p>
            </div>
          </Reveal>
        </div>
        <Reveal dir="left">
          <div className="rounded-2xl border border-[#e6e1db] bg-white p-6 sm:p-8">
            <h2 className="mb-5 text-[20px] font-semibold tracking-[-0.02em]">Mesaj göndərin</h2>
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </>
  );
}
