"use client";
import { useAuth } from "@/context/AuthContext";
import GuestNavbar from "@/components/GuestNavbar";
import UserNavbar from "@/components/UserNavbar";

export default function NavbarSwitch() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <UserNavbar /> : <GuestNavbar />;
}



