import type { Metadata } from "next";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import Reveal from "@/components/fx/Reveal";
import Tilt from "@/components/fx/Tilt";
import { Container } from "@/components/ui";
import { categories } from "@/data/news";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description: "Cənub Xəbər — Azərbaycan xəbər portalı. Missiyamız, redaksiya prinsiplərimiz və əhatə dairəmiz.",
};

const principles = [
  { t: "Dəqiqlik", d: "Hər xəbər dərc olunmazdan əvvəl faktlar yoxlanılır. Mənbəsi dəqiq olmayan məlumat xəbər kimi təqdim edilmir." },
  { t: "Operativlik", d: "Hadisələri mümkün qədər tez, lakin dəqiqlik hesabına deyil, oxucuya çatdırmağı hədəfləyirik." },
  { t: "Müstəqillik", d: "Redaksiya qərarları maraq qruplarından asılı olmadan, yalnız jurnalistika standartlarına əsasən verilir." },
  { t: "Şəffaflıq", d: "Səhv aşkar olunduqda onu açıq şəkildə düzəldir, oxucunun müraciətinə cavab veririk." },
  { t: "Tərəfsizlik", d: "Mübahisəli mövzularda bütün tərəflərin mövqeyini əks etdirməyə, rəy ilə faktı qarışdırmamağa çalışırıq." },
  { t: "Məsuliyyət", d: "Şəxsi həyatın toxunulmazlığına, uşaqların və həssas qrupların hüquqlarına hörmətlə yanaşırıq." },
];

export default function Haqqimizda() {
  return (
    <>
      <PageTitle title="Haqqımızda" sub="Cənub Xəbər — Azərbaycan və dünyadan operativ, dəqiq və müstəqil xəbərlər təqdim edən xəbər portalıdır." />

      <Container className="grid gap-10 py-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal dir="right">
          <h2 className="text-[22px] font-semibold tracking-[-0.03em]">Biz kimik</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-[1.85] text-[#444]">
            <p>Cənub Xəbər cənub bölgəsi və bütün Azərbaycanla bağlı gündəmi izləyən, siyasət, iqtisadiyyat, cəmiyyət, dünya, idman, mədəniyyət, texnologiya və səhiyyə sahələrində xəbərlər hazırlayan onlayn media platformasıdır.</p>
            <p>Portal oxucuya yalnız xəbəri çatdırmaqla kifayətlənmir: hadisənin kontekstini izah etməyi, vacib mövzularda faktlara əsaslanan və başa düşülən məlumat verməyi əsas vəzifəmiz sayırıq.</p>
          </div>
        </Reveal>
        <Reveal dir="left">
          <h2 className="text-[22px] font-semibold tracking-[-0.03em]">Missiyamız</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-[1.85] text-[#444]">
            <p>Cəmiyyətin düzgün və vaxtında məlumatlanmasına xidmət etmək, oxucu ilə etibara əsaslanan münasibət qurmaq və regionun səsini ölkə miqyasında eşitdirməkdir.</p>
            <p>Hər bir xəbərdə sadə bir qaydaya əməl edirik: <b className="text-ink">əvvəl yoxla, sonra yaz.</b></p>
          </div>
        </Reveal>
      </Container>

      <section className="bg-[#fdf3ee] py-14">
        <Container>
          <Reveal><h2 className="text-[22px] font-semibold tracking-[-0.03em]">Redaksiya prinsiplərimiz</h2></Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.t} delay={(i % 3) * 0.07}>
                <Tilt>
                  <div className="h-full rounded-2xl bg-white p-6 shadow-sm">
                    <span className="text-[13px] font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.02em]">{p.t}</h3>
                    <p className="mt-2 text-[14px] leading-[1.75] text-[#555]">{p.d}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <Reveal><h2 className="text-[22px] font-semibold tracking-[-0.03em]">Nələri əhatə edirik</h2></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link key={c.slug} href={`/kateqoriya/${c.slug}`} className="rounded-full border border-[#e6e1db] px-5 py-2.5 text-[14px] transition-colors hover:border-brand hover:text-brand">{c.name}</Link>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal dir="right">
            <h2 className="text-[22px] font-semibold tracking-[-0.03em]">Düzəliş və etiraz siyasəti</h2>
            <p className="mt-4 text-[15px] leading-[1.85] text-[#444]">Səhvə yol verə bilərik. Dərc olunmuş materialda qeyri-dəqiqlik və ya hüquqlarınızın pozulması ilə bağlı müraciətiniz olarsa, bizimlə əlaqə saxlayın — müraciət araşdırılacaq, əsaslı olduqda material düzəldiləcək və ya cavab hüququ təmin ediləcək.</p>
          </Reveal>
          <Reveal dir="left">
            <h2 className="text-[22px] font-semibold tracking-[-0.03em]">Əməkdaşlıq</h2>
            <p className="mt-4 text-[15px] leading-[1.85] text-[#444]">Xəbər ipucu, foto və video materialları, reklam və əməkdaşlıq təklifləri ilə redaksiyaya müraciət edə bilərsiniz.</p>
            <Link href="/elaqe" className="mt-5 inline-block rounded-lg bg-navy px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a80]">Əlaqə səhifəsi</Link>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
