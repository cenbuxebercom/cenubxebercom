import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "cx_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

const secret = () => {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
};

const sign = (data: string, key: string) => createHmac("sha256", key).update(data).digest("base64url");
const sha = (v: string) => createHash("sha256").update(v).digest();

export const authConfigured = () =>
  Boolean(secret() && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

export function checkCredentials(email: string, password: string) {
  const e = process.env.ADMIN_EMAIL ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  const okE = timingSafeEqual(sha(email.trim().toLowerCase()), sha(e.trim().toLowerCase()));
  const okP = timingSafeEqual(sha(password), sha(p));
  return okE && okP;
}

export async function startSession() {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET təyin edilməyib");
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  const token = `${payload}.${sign(payload, key)}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function isAdmin() {
  const key = secret();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!key || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, key);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** CSRF qoruması: dəyişdirici sorğular yalnız eyni saytdan qəbul olunur. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // eyni-origin sorğularda bəzi brauzerlər göndərmir
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

/** Admin route-ları üçün giriş: icazəsizsə Response qaytarır. */
export async function guard(req: Request): Promise<Response | null> {
  if (req.method !== "GET" && !sameOrigin(req)) return json({ error: "Etibarsız mənbə" }, 403);
  if (!(await isAdmin())) return json({ error: "İcazə yoxdur" }, 401);
  return null;
}
