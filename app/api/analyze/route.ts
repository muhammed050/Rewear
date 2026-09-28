import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createHash } from "crypto";
import { checkOrigin, fail } from "@/lib/http";
import { db, adminDb } from "@/lib/supabase";
import { reserve, planLimits, hasEntitlement } from "@/lib/usage";
import { cleanImage } from "@/lib/images";
import { analyzeImage } from "@/lib/ai";
export const maxDuration = 120;
export async function POST(req: Request) {
  let release: (() => Promise<void>) | undefined;
  try {
    checkOrigin(req);
    if (!process.env.AI_API_KEY) throw new Error("AI_UNAVAILABLE");
    const client = await db();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (user) {
      const { data: profile, error } = await client
        .from("profiles")
        .select("suspended")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      if (profile?.suspended) throw new Error("FORBIDDEN");
    }
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) throw new Error("INVALID");
    const mode = form.get("mode") === "import" ? "import" : "recreate";
    if (mode === "import" && (!user || !(await hasEntitlement(user.id))))
      return NextResponse.json(
        { error: "Bulk import is included with Rewear+." },
        { status: 403 },
      );
    const jar = await cookies();
    const guest = jar.get("rewear_guest")?.value || crypto.randomUUID();
    const head = await headers();
    const ip =
      head.get("x-vercel-forwarded-for") ||
      head.get("x-forwarded-for") ||
      "local";
    await reserve(
      createHash("sha256").update(ip).digest("hex"),
      "analysis-rate",
      10,
      new Date().toISOString().slice(0, 13),
    );
    const limit = user ? (await planLimits(user.id)).recreate : 1;
    release = await reserve(user?.id || `guest:${guest}`, "recreate", limit);
    const bytes = await cleanImage(file);
    const result = await analyzeImage(
      `data:image/webp;base64,${bytes.toString("base64")}`,
    );
    await adminDb()
      .from("ai_usage")
      .insert({
        user_id: user?.id,
        feature: mode,
        provider: "openai-compatible",
        model: process.env.AI_VISION_MODEL || "gpt-4.1-mini",
        input_units: result.usage.prompt_tokens || 0,
        output_units: result.usage.completion_tokens || 0,
      });
    const response = NextResponse.json({ analysis: result.analysis });
    response.cookies.set("rewear_guest", guest, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 31536000,
    });
    return response;
  } catch (e) {
    if (release) await release();
    return fail(e);
  }
}
