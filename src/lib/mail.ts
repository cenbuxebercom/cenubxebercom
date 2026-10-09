import { SITE_EMAIL } from "./site";

export type MailResult = { ok: true } | { ok: false; error: string };

async function send(payload: Record<string, unknown>): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY Vercel-də təyin edilməyib (və ya təyin edildikdən sonra Redeploy edilməyib)" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => null);
    const msg = `Resend ${res.status}: ${body?.message ?? body?.name ?? "bilinməyən xəta"}`;
    console.error("[mail]", msg);
    return { ok: false, error: msg };
  } catch (e) {
    const msg = `Resend-ə qoşulmaq alınmadı: ${e instanceof Error ? e.message : String(e)}`;
    console.error("[mail]", msg);
    return { ok: false, error: msg };
  }
}

const target = () => ({
  to: process.env.CONTACT_TO_EMAIL || SITE_EMAIL,
  from: process.env.CONTACT_FROM_EMAIL || "Cənub Xəbər <noreply@cenubxeber.com>",
});

/** Əlaqə formundan gələn mesajı redaksiyanın e-poçtuna göndərir (Resend). */
export function sendContactMail(m: { name: string; email: string; message: string }): Promise<MailResult> {
  const { to, from } = target();
  return send({
    from,
    to: [to],
    reply_to: m.email,
    subject: `Cənub Xəbər — yeni mesaj: ${m.name}`,
    text: `Saytın əlaqə formundan yeni mesaj:\n\nAd: ${m.name}\nE-poçt: ${m.email}\n\nMesaj:\n${m.message}\n`,
  });
}

/** Admin paneldən "E-poçt testi" üçün. */
export function sendTestMail(): Promise<MailResult & { to: string; from: string }> {
  const { to, from } = target();
  return send({
    from,
    to: [to],
    subject: "Cənub Xəbər — test məktubu",
    text: "Bu, admin paneldən göndərilən test məktubudur. Bunu aldınızsa, əlaqə formu e-poçt göndərməyə hazırdır.",
  }).then((r) => ({ ...r, to, from }));
}
