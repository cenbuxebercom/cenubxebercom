import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";
import Reveal from "./fx/Reveal";

export default function SocialBanner() {
  return (
    <Reveal className="mt-24">
      <section className="relative overflow-hidden rounded-2xl bg-[#fdf3ee] px-6 py-10 sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-[680px]">
          <h2 className="text-[23px] font-semibold leading-[1.2] tracking-[-0.04em] text-navy sm:text-[28px]">
            Dünyadan gələn <span className="text-brand">son xəbərlər</span> üçün bizi sosial şəbəkələrdə izləyin.
          </h2>
          <p className="mt-6 max-w-[580px] text-[16px] leading-[1.8] text-[#5a5f87]">
            Harada olursunuz olun məlumatlı qalın — oxucu və izləyici icmamıza qoşulun.
          </p>
        </div>
        <div className="pointer-events-none absolute -bottom-10 right-4 hidden h-[260px] w-[440px] md:block lg:right-24">
          <div className="float-1 absolute bottom-0 left-0 flex h-[140px] w-[140px] items-center justify-center rounded-[36px] bg-[#1877f2] text-white shadow-2xl">
            <FacebookIcon className="h-16 w-16" />
          </div>
          <div className="float-2 absolute left-[100px] top-0 flex h-[170px] w-[170px] items-center justify-center rounded-[44px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white shadow-2xl">
            <InstagramIcon className="h-20 w-20" />
          </div>
          <div className="float-3 absolute bottom-2 left-[230px] flex h-[120px] w-[150px] items-center justify-center rounded-[30px] bg-[#ff0000] text-white shadow-2xl">
            <YoutubeIcon className="h-16 w-16" />
          </div>
          <div className="float-1 absolute right-0 top-4 flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#111] text-white shadow-2xl">
            <TiktokIcon className="h-12 w-12" />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
