import { authConfigured, checkCredentials, json, sameOrigin, startSession } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Etibarsız mənbə" }, 403);
  if (!authConfigured()) return json({ error: "Admin parametrləri (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET) Vercel-də təyin edilməyib." }, 500);
  let body: { email?: unknown; password?: unknown } = {};
  try { body = await req.json(); } catch {}
  // brute-force-u yavaşlatmaq üçün süni gecikmə
  await new Promise((r) => setTimeout(r, 700));
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!checkCredentials(email, password)) return json({ error: "E-poçt və ya parol yanlışdır" }, 401);
  await startSession();
  return json({ ok: true });
}
