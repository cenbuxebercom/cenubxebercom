import { authConfigured, isAdmin, json } from "@/lib/auth";

export async function GET() {
  return json({ admin: await isAdmin(), configured: authConfigured() });
}
