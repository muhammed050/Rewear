import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { checkOrigin, fail } from "@/lib/http";
import { db, adminDb, configured } from "@/lib/supabase";
import { reserve } from "@/lib/usage";
const events = [
  "landing_view",
  "recreate_clicked",
  "image_uploaded",
  "analysis_started",
  "analysis_completed",
  "analysis_failed",
  "closet_item_added",
  "recreation_saved",
  "recreation_shared",
  "share_link_opened",
  "paywall_viewed",
  "checkout_started",
  "checkout_completed_client",
] as const;
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    if (!configured()) return new Response(null, { status: 204 });
    const b = z.object({ event: z.enum(events) }).parse(await req.json());
    const ip =
      req.headers.get("x-vercel-forwarded-for") ||
      req.headers.get("x-forwarded-for") ||
      "local";
    await reserve(
      createHash("sha256").update(ip).digest("hex"),
      "events",
      100,
      new Date().toISOString().slice(0, 13),
    );
    const {
      data: { user },
    } = await (await db()).auth.getUser();
    const { error } = await adminDb()
      .from("analytics_events")
      .insert({ event: b.event, user_id: user?.id });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
