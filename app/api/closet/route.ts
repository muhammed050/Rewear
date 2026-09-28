import { NextResponse } from "next/server";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
import { garment } from "@/lib/schemas";
import { planLimits } from "@/lib/usage";
import { cleanImage, saveImage, signedImage } from "@/lib/images";
import { z } from "zod";
export async function GET() {
  try {
    const { client, user } = await identity();
    const { data, error } = await client
      .from("closet_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({
      items: await Promise.all(
        (data || []).map(async (item) => ({
          ...item,
          image_url: await signedImage("closet-private", item.image_url),
        })),
      ),
      limits: await planLimits(user.id),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  let path: string | null = null;
  try {
    checkOrigin(req);
    const { user } = await identity();
    const form = await req.formData();
    const parsed = garment.safeParse(JSON.parse(String(form.get("item"))));
    if (!parsed.success) throw new Error("INVALID");
    const image = form.get("image");
    if (image instanceof File && image.size)
      path = await saveImage(
        user.id,
        "closet-private",
        await cleanImage(image),
      );
    const { data, error } = await adminDb().rpc("add_closet_item", {
      p_user: user.id,
      p_item: { ...parsed.data, image_url: path },
      p_limit: (await planLimits(user.id)).closet,
    });
    if (error) {
      if (path) await adminDb().storage.from("closet-private").remove([path]);
      throw new Error(
        error.message.includes("LIMIT") ? "LIMIT" : "SAVE_FAILED",
      );
    }
    return NextResponse.json({ id: data });
  } catch (e) {
    return fail(e);
  }
}
export async function PATCH(req: Request) {
  try {
    checkOrigin(req);
    const { user } = await identity();
    const input = z
      .object({
        id: z.uuid(),
        favorite: z.boolean().optional(),
        item: garment.optional(),
      })
      .parse(await req.json());
    const { error } = await adminDb()
      .from("closet_items")
      .update(input.item || { favorite: input.favorite })
      .eq("id", input.id)
      .eq("user_id", user.id);
    if (error) throw error;
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
    const { data, error } = await adminDb()
      .from("closet_items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("image_url")
      .single();
    if (error) throw error;
    if (data.image_url)
      await adminDb().storage.from("closet-private").remove([data.image_url]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
