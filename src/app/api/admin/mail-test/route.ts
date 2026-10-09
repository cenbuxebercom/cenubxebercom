import { guard, json } from "@/lib/auth";
import { sendTestMail } from "@/lib/mail";

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const r = await sendTestMail();
  return json(r, r.ok ? 200 : 502);
}
