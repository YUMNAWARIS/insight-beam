import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data?.Error) {
      const message = data?.Error_Message || "Registration failed";
      return NextResponse.json({ Error: true, Error_Message: message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ Error: true, Error_Message: e?.message || "Register error" }, { status: 500 });
  }
}


