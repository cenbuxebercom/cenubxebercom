import { LinkedinIcon, XIcon } from "./icons";
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
        <div className="pointer-events-none absolute -bottom-10 right-4 hidden h-[260px] w-[420px] md:block lg:right-24">
          <div className="float-1 absolute bottom-0 left-0 flex h-[160px] w-[160px] items-center justify-center rounded-[40px] bg-[#1d63e0] text-white shadow-2xl">
            <LinkedinIcon className="h-20 w-20" />
          </div>
          <div className="float-2 absolute left-[110px] top-0 flex h-[200px] w-[200px] items-center justify-center rounded-[50px] bg-[#3a3a3c] text-white shadow-2xl">
            <XIcon className="h-24 w-24" />
          </div>
          <div className="float-3 absolute bottom-0 right-0 flex h-[170px] w-[170px] items-center justify-center rounded-full bg-[#ee4b1f] text-white shadow-2xl">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20"><circle cx="12" cy="14" r="6.5"/><circle cx="19" cy="4" r="2"/><circle cx="5" cy="9" r="2.2"/><circle cx="19" cy="9" r="2.2"/></svg>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
