import PageTitle from "@/components/PageTitle";
import ContactForm from "@/components/ContactForm";
import { Container } from "@/components/ui";

export const metadata = { title: "Contact Us — PressPoint" };

export default function Contact() {
  return (
    <>
      <PageTitle title="Contact Us" sub="Tips, feedback or partnership requests — we read every message." />
      <Container className="grid gap-14 py-16 lg:grid-cols-[1fr_480px]">
        <ContactForm />
        <div className="space-y-4 rounded-2xl bg-[#fdf3ee] p-9 text-[17px] text-[#444]">
          <p><b className="text-navy">Head Office:</b> 123 PressPoint, New York, USA.</p>
          <p><b className="text-navy">Phone:</b> +1 (000) 123-4567</p>
          <p><b className="text-navy">Email:</b> contact@presspoint.com</p>
        </div>
      </Container>
    </>
  );
}
