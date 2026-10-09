import { endSession, json, sameOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Etibarsız mənbə" }, 403);
  await endSession();
  return json({ ok: true });
}
