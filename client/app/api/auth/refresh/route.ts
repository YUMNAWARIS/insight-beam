import { NextResponse } from "next/server";

// This app uses a single JWT from backend; no real refresh endpoint on backend.
// We expose a stub so the client can later support refresh if needed.
export async function GET() {
  return NextResponse.json({ ok: true });
}


