import { guard, json } from "@/lib/auth";

// Vercel serverless sorğu limiti ~4.5 MB-dır; admin panel şəkli əvvəlcədən sıxıb göndərir.
const MAX = 4 * 1024 * 1024;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const key = process.env.IMGBB_API_KEY;
  if (!key) return json({ error: "IMGBB_API_KEY Vercel-də təyin edilməyib" }, 500);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "Fayl qəbul edilmədi (ölçü çox böyük ola bilər)" }, 400);
  if (!file.type.startsWith("image/")) return json({ error: "Yalnız şəkil faylı yükləyin" }, 400);
  if (file.size > MAX) return json({ error: "Şəkil 4 MB-dan böyükdür" }, 413);

  const fd = new FormData();
  fd.append("image", file, file.name || "xeber.jpg");
  let res: Response;
  try {
    res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, { method: "POST", body: fd });
  } catch (e) {
    console.error("[upload] ImgBB-yə qoşulmaq alınmadı:", e);
    return json({ error: "ImgBB-yə qoşulmaq alınmadı" }, 502);
  }
  const data = await res.json().catch(() => null);
  const url: string | undefined = data?.data?.url ?? data?.data?.display_url;
  if (!res.ok || !url) {
    const msg = data?.error?.message ?? data?.status_txt ?? `HTTP ${res.status}`;
    console.error("[upload] ImgBB xətası:", res.status, msg);
    return json({ error: `ImgBB: ${msg}` }, 502);
  }
  return json({ url });
}
