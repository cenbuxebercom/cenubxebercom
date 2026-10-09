import PageTitle from "@/components/PageTitle";
import { Container } from "@/components/ui";

export const metadata = { title: "Subscription — PressPoint" };

const plans = [
  { name: "Free", price: "$0", items: ["Daily headlines", "Newsletter", "Ad-supported"] },
  { name: "The Weekly Digest", price: "$3.50", items: ["Weekly long-read digest", "Ad-free reading", "Archive access"], hot: true },
  { name: "Premium", price: "$9", items: ["Everything in Digest", "Exclusive investigations", "Early access"] },
];

export default function Subscription() {
  return (
    <>
      <PageTitle title="Subscription" sub="Choose the plan that fits the way you read." />
      <Container className="grid gap-6 py-16 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-2xl p-9 ${p.hot ? "bg-navy text-white" : "border border-[#e6e1db]"}`}>
            <h3 className="text-[22px] font-semibold">{p.name}</h3>
            <p className="mt-4 text-[48px] font-semibold tracking-[-0.04em]">{p.price}<span className="text-[16px] font-normal opacity-60"> / month</span></p>
            <ul className="mt-6 space-y-3 text-[17px] opacity-80">{p.items.map((i) => <li key={i}>— {i}</li>)}</ul>
            <button className={`mt-8 w-full py-3.5 text-[17px] font-medium ${p.hot ? "bg-white text-navy" : "bg-navy text-white"}`}>Subscribe</button>
          </div>
        ))}
      </Container>
    </>
  );
}
