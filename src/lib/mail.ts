import { SITE_EMAIL } from "./site";

/** Resend vasitəsilə redaksiyanın e-poçtuna məktub göndərir. RESEND_API_KEY yoxdursa false qaytarır. */
export async function sendContactMail(m: { name: string; email: string; message: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const to = process.env.CONTACT_TO_EMAIL || SITE_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || `Cənub Xəbər <noreply@cenubxeber.com>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: m.email,
        subject: `Cənub Xəbər — yeni mesaj: ${m.name}`,
        text: `Saytın əlaqə formundan yeni mesaj:\n\nAd: ${m.name}\nE-poçt: ${m.email}\n\nMesaj:\n${m.message}\n`,
      }),
    });
    if (!res.ok) {
      console.error("[mail] Resend xətası:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mail] göndərmə xətası:", e);
    return false;
  }
}
