export async function api<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T & { error?: string }> {
  try {
    const res = await fetch(url, { ...init, headers: init?.body instanceof FormData ? undefined : { "content-type": "application/json", ...(init?.headers ?? {}) } });
    return await res.json();
  } catch {
    return { error: "Şəbəkə xətası" } as T & { error?: string };
  }
}
