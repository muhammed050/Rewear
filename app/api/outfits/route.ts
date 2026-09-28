import { NextResponse } from "next/server";
import { z } from "zod";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
export async function GET() {
  try {
    const { client } = await identity();
    const { data, error } = await client
      .from("outfits")
      .select("*,recreations(analysis_json,match_score),wear_history(worn_on)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ outfits: data || [] });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    const b = z
      .object({ recreationId: z.uuid(), title: z.string().min(1).max(100) })
      .parse(await req.json());
    const { data: r } = await client
      .from("recreations")
      .select("id")
      .eq("id", b.recreationId)
      .single();
    if (!r) throw new Error("FORBIDDEN");
    const { data, error } = await adminDb()
      .from("outfits")
      .insert({ user_id: user.id, title: b.title, source_recreation_id: r.id })
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return fail(e);
  }
}
export async function PATCH(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    const b = z
      .object({
        id: z.uuid(),
        action: z.enum(["favorite", "wear"]),
        favorite: z.boolean().optional(),
      })
      .parse(await req.json());
    const { data } = await client
      .from("outfits")
      .select("id")
      .eq("id", b.id)
      .single();
    if (!data) throw new Error("FORBIDDEN");
    const r =
      b.action === "wear"
        ? await adminDb()
            .from("wear_history")
            .upsert(
              {
                user_id: user.id,
                outfit_id: b.id,
                worn_on: new Date().toISOString().slice(0, 10),
              },
              { onConflict: "user_id,outfit_id,worn_on" },
            )
        : await adminDb()
            .from("outfits")
            .update({ favorite: !!b.favorite })
            .eq("id", b.id)
            .eq("user_id", user.id);
    if (r.error) throw r.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
export async function DELETE(req: Request) {
  try {
    checkOrigin(req);
    const { user } = await identity();
    const { id } = z.object({ id: z.uuid() }).parse(await req.json());
    const { error } = await adminDb()
      .from("outfits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
