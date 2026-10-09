import { json, sameOrigin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sendContactMail } from "@/lib/mail";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Etibarsız mənbə" }, 403);
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return json({ error: "Yanlış sorğu" }, 400);
  if (typeof b.website === "string" && b.website) return json({ ok: true }); // bot tələsi (honeypot)
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 100) : "";
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 150) : "";
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 4000) : "";
  if (name.length < 2 || message.length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Zəhmət olmasa bütün xanaları düzgün doldurun" }, 400);
  }

  // həm e-poçta göndər, həm də bazaya (admin paneldəki "Mesajlar") yaz — biri alınsa kifayətdir
  const db = getDb();
  const [mailed, saved] = await Promise.all([
    sendContactMail({ name, email, message }),
    db ? db.from("messages").insert({ name, email, message }).then(({ error }) => !error) : Promise.resolve(false),
  ]);
  if (!mailed && !saved) return json({ error: "Mesaj göndərilmədi, bir az sonra yenidən cəhd edin" }, 500);
  return json({ ok: true });
}
