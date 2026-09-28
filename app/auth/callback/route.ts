import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { appUrl } from "@/lib/config";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const raw = url.searchParams.get("next") || "/onboarding";
  const next =
    raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")
      ? raw
      : "/home";
  if (code) {
    try {
      const { error } = await (await db()).auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(next, appUrl));
    } catch {}
  }
  return NextResponse.redirect(new URL("/sign-in?error=callback", appUrl));
}
