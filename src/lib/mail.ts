import nodemailer from "nodemailer";
import { SITE_EMAIL } from "./site";

export type MailResult = { ok: true } | { ok: false; error: string };

const smtpConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

/** SMTP (məs. Gmail "tətbiq parolu") — domen təsdiqi tələb etmir. */
async function sendSmtp(p: { to: string; subject: string; text: string; replyTo?: string }): Promise<MailResult> {
  try {
    const port = Number(process.env.SMTP_PORT) || 465;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: (process.env.SMTP_PASS ?? "").replace(/\s+/g, "") },
      connectionTimeout: 12000,
      greetingTimeout: 12000,
      socketTimeout: 15000,
    });
    await transport.sendMail({
      from: `"Cənub Xəbər" <${process.env.SMTP_USER}>`,
      to: p.to,
      replyTo: p.replyTo,
      subject: p.subject,
      text: p.text,
    });
    return { ok: true };
  } catch (e) {
    const msg = `SMTP xətası: ${e instanceof Error ? e.message : String(e)}`;
    console.error("[mail]", msg);
    return { ok: false, error: msg.slice(0, 300) };
  }
}

async function send(payload: Record<string, unknown>): Promise<MailResult> {
  if (smtpConfigured()) {
    return sendSmtp({
      to: (payload.to as string[])[0],
      subject: String(payload.subject),
      text: String(payload.text),
      replyTo: payload.reply_to as string | undefined,
    });
  }
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
    const detail: string = body?.message ?? body?.name ?? "bilinməyən xəta";
    const hint = /not verified|verify/i.test(detail)
      ? " → Resend → Domains bölməsində cenubxeber.com domenini təsdiqləyin (DNS qeydləri Cloudflare-də)."
      : /only send testing emails|own email/i.test(detail)
        ? " → Domen təsdiqlənməyib: yalnız Resend hesabının öz e-poçtuna göndərmək olar. Domeni təsdiqləyin."
        : "";
    const msg = `Resend ${res.status}: ${detail}${hint}`;
    console.error("[mail]", msg);
    return { ok: false, error: msg };
  } catch (e) {
    const msg = `Resend-ə qoşulmaq alınmadı: ${e instanceof Error ? e.message : String(e)}`;
    console.error("[mail]", msg);
    return { ok: false, error: msg };
  }
}

/** CONTACT_FROM_EMAIL hansı formatda yazılsa da (dırnaq, "Ad <e-poçt>" və ya sadəcə e-poçt) düzgün `from` düzəldir. */
function fromAddress(): string {
  const raw = (process.env.CONTACT_FROM_EMAIL || "").trim().replace(/^["'\s]+|["'\s]+$/g, "");
  const m = /<\s*([^<>\s]+@[^<>\s]+)\s*>/.exec(raw) || /^([^<>\s"',;]+@[^<>\s"',;]+)$/.exec(raw);
  const email = m ? m[1] : "noreply@cenubxeber.com";
  return `Cenub Xeber <${email}>`;
}

const target = () => ({
  to: (process.env.CONTACT_TO_EMAIL || SITE_EMAIL).trim().replace(/^["'\s]+|["'\s]+$/g, ""),
  from: fromAddress(),
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
