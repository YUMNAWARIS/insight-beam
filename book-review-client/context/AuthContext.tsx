"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  user_name: string;
  user_email: string;
  user_bio?: string;
  liked_books?: unknown[];
  created_books?: unknown[];
};

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  initializing: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { name: string; email: string; password: string; bio?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("ib_token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("ib_user") : null;
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setInitializing(false);
  }, []);

  const persistAuth = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("ib_token", newToken);
      localStorage.setItem("ib_user", JSON.stringify(newUser));
      document.cookie = "ib_auth=1; path=/; max-age=2592000; samesite=lax";
    }
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ib_token");
      localStorage.removeItem("ib_user");
      document.cookie = "ib_auth=; path=/; max-age=0";
    }
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || data?.Error) throw new Error(data?.Error_Message || "Login failed");
    persistAuth(data.Authentication_Token, data.user as User);
    router.replace("/user/explore");
  }, [persistAuth, router]);

  const register = useCallback(async ({ name, email, password, bio }: { name: string; email: string; password: string; bio?: string }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, bio })
    });
    const data = await res.json();
    if (!res.ok || data?.Error) throw new Error(data?.Error_Message || "Register failed");
    persistAuth(data.Authentication_Token, data.user as User);
    router.replace("/user/explore");
  }, [persistAuth, router]);

  const logout = useCallback(() => {
    clearAuth();
    router.push("/auth/login");
  }, [clearAuth, router]);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    initializing,
    login,
    register,
    logout,
  }), [token, user, initializing, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


