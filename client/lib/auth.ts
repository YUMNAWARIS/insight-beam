export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ib_token");
}

export function getUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ib_user");
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}


