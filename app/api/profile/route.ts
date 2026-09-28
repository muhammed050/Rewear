import { NextResponse } from "next/server";
import { z } from "zod";
import { identity } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
export async function GET() {
  try {
    const { client, user } = await identity();
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error) throw error;
    return NextResponse.json({ profile: data, email: user.email });
  } catch (e) {
    return fail(e);
  }
}
export async function PATCH(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    const input = z
      .object({
        display_name: z.string().max(80).optional(),
        bio: z.string().max(400).optional(),
        style_preferences: z.array(z.string().max(40)).max(12).optional(),
        goals: z.array(z.string().max(100)).max(6).optional(),
        onboarding_completed: z.boolean().optional(),
      })
      .parse(await req.json());
    const { error } = await client
      .from("profiles")
      .update(input)
      .eq("id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
