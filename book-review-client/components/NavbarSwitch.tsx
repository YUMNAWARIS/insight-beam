"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GuestNavbar from "@/components/GuestNavbar";
import UserNavbar from "@/components/UserNavbar";

function readIsAuthed(): boolean {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem("ib_token");
  const cookies = typeof document !== "undefined" ? document.cookie : "";
  const hasCookie = /(?:^|; )ib_auth=1(?:;|$)/.test(cookies);
  return Boolean(token) || hasCookie;
}

export default function NavbarSwitch() {
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState<boolean>(() => readIsAuthed());

  useEffect(() => {
    setIsAuthed(readIsAuthed());
  }, [pathname]);

  useEffect(() => {
    const onFocus = () => setIsAuthed(readIsAuthed());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ib_token" || e.key === "ib_user") {
        setIsAuthed(readIsAuthed());
      }
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return isAuthed ? <UserNavbar /> : <GuestNavbar />;
}



