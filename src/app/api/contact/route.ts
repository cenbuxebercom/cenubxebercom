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

  const mail = await sendContactMail({ name, email, message });
  const mail_status = mail.ok ? "sent" : mail.error.slice(0, 300);

  // admin paneldəki "Mesajlar" üçün bazaya yaz (e-poçt statusu ilə)
  const db = getDb();
  let saved = false;
  if (db) {
    let { error } = await db.from("messages").insert({ name, email, message, mail_status });
    if (error) ({ error } = await db.from("messages").insert({ name, email, message })); // mail_status sütunu hələ yoxdursa
    saved = !error;
  }
  if (!mail.ok && !saved) return json({ error: "Mesaj göndərilmədi, bir az sonra yenidən cəhd edin" }, 500);
  return json({ ok: true });
}
