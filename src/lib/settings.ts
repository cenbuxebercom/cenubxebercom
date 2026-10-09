import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "./db";
import { SOCIALS } from "./site";

export type Socials = { facebook: string; instagram: string; youtube: string; tiktok: string };
export const SOCIAL_KEYS: (keyof Socials)[] = ["facebook", "instagram", "youtube", "tiktok"];

/** Saytdakı sosial şəbəkə linkləri. Admin paneldə dəyişilənə qədər defolt (platformaların ana səhifələri) göstərilir. */
export async function getSocials(): Promise<Socials> {
  "use cache";
  cacheTag("settings");
  cacheLife("minutes");
  const db = getDb();
  if (!db) return { ...SOCIALS };
  const { data, error } = await db.from("settings").select("value").eq("key", "socials").maybeSingle();
  if (error || !data?.value) return { ...SOCIALS }; // cədvəl hələ yoxdursa və ya link yazılmayıbsa
  const v = data.value as Partial<Socials>;
  return {
    facebook: typeof v.facebook === "string" ? v.facebook : "",
    instagram: typeof v.instagram === "string" ? v.instagram : "",
    youtube: typeof v.youtube === "string" ? v.youtube : "",
    tiktok: typeof v.tiktok === "string" ? v.tiktok : "",
  };
}
