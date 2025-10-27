export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ib_token");
}

export async function apiFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers || {});
  if (!headers.has("Content-Type") && init?.body) headers.set("Content-Type", "application/json");
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.Error) {
    const message = data?.Error_Message || data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}


