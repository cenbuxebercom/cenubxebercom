import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-[88px] font-bold leading-none tracking-[-0.06em] text-brand">404</p>
      <h1 className="mt-6 text-[26px] font-semibold tracking-[-0.04em]">Səhifə tapılmadı</h1>
      <p className="mt-3 text-[16px] text-[#6f6f6f]">Axtardığınız səhifə mövcud deyil və ya köçürülüb.</p>
      <Link href="/" className="mt-10 inline-block bg-navy px-10 py-4 text-[15px] font-medium text-white">Ana səhifəyə qayıt</Link>
    </Container>
  );
}
