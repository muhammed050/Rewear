import { NextResponse } from "next/server";
import { z } from "zod";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
export async function GET() {
  try {
    const { client } = await identity();
    const { data, error } = await client
      .from("collections")
      .select("*,collection_outfits(outfit_id)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ collections: data || [] });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const { user } = await identity();
    const { name } = z
      .object({ name: z.string().min(1).max(80) })
      .parse(await req.json());
    const { error } = await adminDb()
      .from("collections")
      .insert({ user_id: user.id, name });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
export async function PATCH(req: Request) {
  try {
    checkOrigin(req);
    const { client } = await identity();
    const { collectionId, outfitId } = z
      .object({ collectionId: z.uuid(), outfitId: z.uuid() })
      .parse(await req.json());
    const [c, o] = await Promise.all([
      client.from("collections").select("id").eq("id", collectionId).single(),
      client.from("outfits").select("id").eq("id", outfitId).single(),
    ]);
    if (!c.data || !o.data) throw new Error("FORBIDDEN");
    const { error } = await adminDb()
      .from("collection_outfits")
      .upsert({ collection_id: collectionId, outfit_id: outfitId });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
