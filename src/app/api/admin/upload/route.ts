import { guard, json } from "@/lib/auth";

const MAX = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const key = process.env.IMGBB_API_KEY;
  if (!key) return json({ error: "IMGBB_API_KEY Vercel-də təyin edilməyib" }, 500);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "Fayl seçilməyib" }, 400);
  if (!file.type.startsWith("image/")) return json({ error: "Yalnız şəkil faylı yükləyin" }, 400);
  if (file.size > MAX) return json({ error: "Şəkil 8 MB-dan böyük ola bilməz" }, 400);

  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, { method: "POST", body: fd });
  const data = await res.json().catch(() => null);
  const url: string | undefined = data?.data?.url ?? data?.data?.display_url;
  if (!res.ok || !url) return json({ error: data?.error?.message ?? "ImgBB-yə yükləmə alınmadı" }, 502);
  return json({ url });
}
